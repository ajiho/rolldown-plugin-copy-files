import { describe, expect, it, vi } from "vitest";
import { copyfiles } from "native-copyfiles";
import { copyFiles } from "../src/index.js";

vi.mock("native-copyfiles", () => ({ copyfiles: vi.fn() }));

describe("copyFiles", () => {
  it("应该创建正确的 Rolldown 插件", () => {
    const plugin = copyFiles();

    expect(plugin.name).toBe("rolldown-plugin-copy-files");
    expect(plugin.closeBundle).toBeTypeOf("function");
  });

  it("应该调用 native-copyfiles 复制文件", async () => {
    copyfiles.mockImplementation((_src, _dest, _options, callback) => {
      callback();
    });

    const plugin = copyFiles({
      targets: [
        {
          src: "src/**/*.js",
          dest: "dist",
        },
      ],
    });

    await plugin.closeBundle();

    expect(copyfiles).toHaveBeenCalledWith("src/**/*.js", "dist", {}, expect.any(Function));
  });

  it("应该将 options 原样传递给 native-copyfiles", async () => {
    copyfiles.mockImplementation((_src, _dest, _options, callback) => {
      callback();
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

    await plugin.closeBundle();

    expect(copyfiles).toHaveBeenCalledWith("src/**/*", "dist", options, expect.any(Function));
  });

  it("应该支持多个源路径", async () => {
    copyfiles.mockImplementation((_src, _dest, _options, callback) => {
      callback();
    });

    const src = ["foo", "bar"];

    const plugin = copyFiles({
      targets: [
        {
          src,
          dest: "dist",
        },
      ],
    });

    await plugin.closeBundle();

    expect(copyfiles).toHaveBeenCalledWith(src, "dist", {}, expect.any(Function));
  });

  it("应该依次执行多个复制任务", async () => {
    copyfiles.mockImplementation((_src, _dest, _options, callback) => {
      callback();
    });

    const plugin = copyFiles({
      targets: [
        {
          src: "foo",
          dest: "dist/foo",
        },
        {
          src: "bar",
          dest: "dist/bar",
        },
      ],
    });

    await plugin.closeBundle();

    expect(copyfiles).toHaveBeenCalledTimes(2);

    expect(copyfiles).toHaveBeenNthCalledWith(1, "foo", "dist/foo", {}, expect.any(Function));

    expect(copyfiles).toHaveBeenNthCalledWith(2, "bar", "dist/bar", {}, expect.any(Function));
  });

  it("应该在复制完成后调用用户 callback", async () => {
    const callback = vi.fn();

    copyfiles.mockImplementation((_src, _dest, _options, nativeCallback) => {
      nativeCallback("done");
    });

    const plugin = copyFiles({
      targets: [
        {
          src: "foo",
          dest: "dist",
          callback,
        },
      ],
    });

    await plugin.closeBundle();

    expect(callback).toHaveBeenCalledWith("done");
  });

  it("应该等待复制任务完成后 closeBundle 才结束", async () => {
    let finish;

    copyfiles.mockImplementation((_src, _dest, _options, callback) => {
      finish = callback;
    });

    const plugin = copyFiles({
      targets: [
        {
          src: "foo",
          dest: "dist",
        },
      ],
    });

    let completed = false;

    const promise = plugin.closeBundle().then(() => {
      completed = true;
    });

    // native-copyfiles 还没有执行完成
    await Promise.resolve();

    expect(completed).toBe(false);

    // 模拟 native-copyfiles 完成复制
    finish();

    await promise;

    expect(completed).toBe(true);
  });

  it("src 缺失时应该抛出错误", async () => {
    const plugin = copyFiles({
      targets: [
        {
          dest: "dist",
        },
      ],
    });

    await expect(plugin.closeBundle()).rejects.toThrow(
      '[rolldown-plugin-copy-files] target requires "src" and "dest"',
    );

    expect(copyfiles).not.toHaveBeenCalled();
  });

  it("dest 缺失时应该抛出错误", async () => {
    const plugin = copyFiles({
      targets: [
        {
          src: "src/**/*",
        },
      ],
    });

    await expect(plugin.closeBundle()).rejects.toThrow(
      '[rolldown-plugin-copy-files] target requires "src" and "dest"',
    );

    expect(copyfiles).not.toHaveBeenCalled();
  });

  it("native-copyfiles 同步抛出错误时应该让 Promise reject", async () => {
    const error = new Error("copy failed");

    copyfiles.mockImplementation(() => {
      throw error;
    });

    const plugin = copyFiles({
      targets: [
        {
          src: "foo",
          dest: "dist",
        },
      ],
    });

    await expect(plugin.closeBundle()).rejects.toThrow("copy failed");
  });
});
