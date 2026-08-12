import { copyfiles } from "native-copyfiles";

const PLUGIN_NAME = "rolldown-plugin-copy-files";

/**
 * 创建一个用于复制文件的 Rolldown 插件。
 *
 * @param {Object} options
 * @param {Array<{
 *   src: string|string[],
 *   dest: string,
 *   options?: Object,
 *   callback?: Function
 * }>} options.targets
 * @returns {Object}
 */
export function copyFiles(options = {}) {
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
 *
 * @param {string|string[]} src
 * @param {string} dest
 * @param {Object} options
 * @param {Function} callback
 * @returns {Promise<void>}
 */
function copy(src, dest, options, callback) {
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
