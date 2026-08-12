import { copyfiles } from "native-copyfiles";
import type { CopyFileOptions } from "native-copyfiles";
import type { Plugin } from "rolldown";

import pkg from "../package.json" with { type: "json" };

const PLUGIN_NAME = pkg.name;

/**
 * 单个文件复制任务。
 */
export interface CopyTarget {
  /**
   * Source file or glob pattern.
   */
  src: string | string[];

  /**
   * Destination directory.
   */
  dest: string;

  /**
   * Options passed to native-copyfiles.
   */
  options?: CopyFileOptions;

  /**
   * Callback invoked after the copy operation completes.
   */
  callback?: CopyFileOptions["callback"];
}

/**
 * 插件配置选项。
 */
export interface CopyFilesOptions {
  /**
   * Files copy targets.
   */
  targets?: CopyTarget[];
}

/**
 * 创建一个用于复制文件的 Rolldown 插件。
 */
export function copyFiles(options: CopyFilesOptions = {}): Plugin {
  const { targets = [] } = options;

  return {
    name: PLUGIN_NAME,

    /**
     * 在 bundle 输出完成后执行复制任务。
     */
    async closeBundle() {
      for (const target of targets) {
        const { src, dest, options: copyOptions = {}, callback } = target;

        if (!src || !dest) {
          throw new Error(`[${PLUGIN_NAME}] target requires "src" and "dest"`);
        }

        await copy(src, dest, copyOptions, callback);
      }
    },
  };
}

/**
 * 执行一次 native-copyfiles 复制任务。
 */
function copy(
  src: string | string[],
  dest: string,
  options: CopyFileOptions,
  callback: CopyFileOptions["callback"],
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      copyfiles(src, dest, options, (...args) => {
        callback?.(...args);
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
