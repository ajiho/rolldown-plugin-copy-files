import { copyfiles } from "native-copyfiles";
import type { Plugin } from "rolldown";
import { describe, expect, it, vi } from "vitest";

import { copyFiles, type CopyTarget } from "../src/index.ts";

vi.mock("native-copyfiles", () => ({
  copyfiles: vi.fn(),
}));

const mockedCopyfiles = vi.mocked(copyfiles);

// 仅用于测试运行时参数校验，不改变正式 API 类型。
function invalidTarget(target: Partial<CopyTarget>): CopyTarget {
  return target as CopyTarget;
}

async function runCloseBundle(plugin: Plugin): Promise<void> {
  const hook = plugin.closeBundle;

  if (!hook) {
    throw new Error("Plugin does not implement closeBundle");
  }

  if (typeof hook === "function") {
    await hook.call({} as never);
  } else {
    await hook.handler.call({} as never);
  }
}

describe("copyFiles", () => {
  it("应该创建正确的 Rolldown 插件", () => {
    const plugin = copyFiles();

    expect(plugin.name).toBe("rolldown-plugin-copy-files");
    expect(plugin.closeBundle).toBeTypeOf("function");
  });

  it("应该调用 native-copyfiles 复制文件", async () => {
    mockedCopyfiles.mockImplementation((_src, _dest, _options, callback) => {
      callback?.();
    });

    const plugin = copyFiles({
      targets: [
        {
          src: "src/**/*.js",
          dest: "dist",
        },
      ],
    });

    await runCloseBundle(plugin);

    expect(mockedCopyfiles).toHaveBeenCalledWith("src/**/*.js", "dist", {}, expect.any(Function));
  });

  it("应该将 options 原样传递给 native-copyfiles", async () => {
    mockedCopyfiles.mockImplementation((_src, _dest, _options, callback) => {
      callback?.();
    });

    const options = {
      verbose: true,
      up: 1,
      all: true,
      exclude: "**/*.test.js",
      dryRun: true,
      follow: true,
      stat: true,
    };

    const plugin = copyFiles({
      targets: [
        {
          src: "src/**/*",
          dest: "dist",
          options,
        },
      ],
    });

    await runCloseBundle(plugin);

    expect(mockedCopyfiles).toHaveBeenCalledWith("src/**/*", "dist", options, expect.any(Function));
  });

  it("应该支持多个源路径", async () => {
    mockedCopyfiles.mockImplementation((_src, _dest, _options, callback) => {
      callback?.();
    });

    const src = ["foo", "bar"];

    const plugin = copyFiles({
      targets: [{ src, dest: "dist" }],
    });

    await runCloseBundle(plugin);

    expect(mockedCopyfiles).toHaveBeenCalledWith(src, "dist", {}, expect.any(Function));
  });

  it("应该依次执行多个复制任务", async () => {
    mockedCopyfiles.mockImplementation((_src, _dest, _options, callback) => {
      callback?.();
    });

    const plugin = copyFiles({
      targets: [
        { src: "foo", dest: "dist/foo" },
        { src: "bar", dest: "dist/bar" },
      ],
    });

    await runCloseBundle(plugin);

    expect(mockedCopyfiles).toHaveBeenCalledTimes(2);

    expect(mockedCopyfiles).toHaveBeenNthCalledWith(1, "foo", "dist/foo", {}, expect.any(Function));

    expect(mockedCopyfiles).toHaveBeenNthCalledWith(2, "bar", "dist/bar", {}, expect.any(Function));
  });

  it("应该在复制完成后调用用户 callback", async () => {
    const callback = vi.fn();
    const error = new Error("done");

    mockedCopyfiles.mockImplementation((_src, _dest, _options, nativeCallback) => {
      if (!nativeCallback) {
        throw new Error("Expected native-copyfiles callback");
      }

      nativeCallback(error);
    });

    const plugin = copyFiles({
      targets: [{ src: "foo", dest: "dist", callback }],
    });

    await runCloseBundle(plugin);

    expect(callback).toHaveBeenCalledWith(error);
    expect(callback.mock.calls[0]![0].message).toBe("done");
  });

  it("应该等待复制任务完成后 closeBundle 才结束", async () => {
    let finish!: NonNullable<Parameters<typeof copyfiles>[3]>;

    mockedCopyfiles.mockImplementation((_src, _dest, _options, callback) => {
      if (!callback) {
        throw new Error("Expected native-copyfiles callback");
      }

      finish = callback;
    });

    const plugin = copyFiles({
      targets: [{ src: "foo", dest: "dist" }],
    });

    let completed = false;

    const promise = runCloseBundle(plugin).then(() => {
      completed = true;
    });

    await Promise.resolve();

    expect(completed).toBe(false);
    expect(finish).toBeTypeOf("function");

    finish();

    await promise;

    expect(completed).toBe(true);
  });

  it("src 缺失时应该抛出错误", async () => {
    const plugin = copyFiles({
      targets: [invalidTarget({ dest: "dist" })],
    });

    await expect(runCloseBundle(plugin)).rejects.toThrow(
      '[rolldown-plugin-copy-files] target requires "src" and "dest"',
    );

    expect(mockedCopyfiles).not.toHaveBeenCalled();
  });

  it("dest 缺失时应该抛出错误", async () => {
    const plugin = copyFiles({
      targets: [invalidTarget({ src: "src/**/*" })],
    });

    await expect(runCloseBundle(plugin)).rejects.toThrow(
      '[rolldown-plugin-copy-files] target requires "src" and "dest"',
    );

    expect(mockedCopyfiles).not.toHaveBeenCalled();
  });

  it("native-copyfiles 同步抛出错误时应该让 Promise reject", async () => {
    const error = new Error("copy failed");

    mockedCopyfiles.mockImplementation(() => {
      throw error;
    });

    const plugin = copyFiles({
      targets: [{ src: "foo", dest: "dist" }],
    });

    await expect(runCloseBundle(plugin)).rejects.toThrow("copy failed");
  });
});
