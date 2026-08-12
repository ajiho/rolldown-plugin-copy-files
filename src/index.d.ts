import type { Plugin } from "rolldown";
import type { CopyFileOptions } from "native-copyfiles";

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

export interface CopyFilesOptions {
  /**
   * Files copy targets.
   */
  targets?: CopyTarget[];
}

export declare function copyFiles(options?: CopyFilesOptions): Plugin;
