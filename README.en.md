# rolldown-plugin-copy-files

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://www.lujiahao.com/sponsor)
[![npm version](https://img.shields.io/npm/v/rolldown-plugin-copy-files)](https://www.npmjs.com/package/rolldown-plugin-copy-files)
[![Node](https://img.shields.io/node/v/rolldown-plugin-copy-files.svg)](https://nodejs.org/en/about/previous-releases)
[![Test](https://img.shields.io/github/actions/workflow/status/ajiho/rolldown-plugin-copy-files/tests.yml?label=Test&logo=github&style=flat-square&branch=main)](https://github.com/ajiho/rolldown-plugin-copy-files/actions/workflows/tests.yml)
[![codecov](https://codecov.io/github/ajiho/rolldown-plugin-copy-files/graph/badge.svg?token=YR846BMB6Y)](https://codecov.io/github/ajiho/rolldown-plugin-copy-files)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/ajiho/rolldown-plugin-copy-files/blob/main/LICENSE)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/rolldown-plugin-copy-files)

---

English | [简体中文](./README.md)

A Rolldown plugin for copying files, based on [`native-copyfiles`](https://github.com/ghiscoding/native-copyfiles).

> [!NOTE]
> The currently built-in `native-copyfiles` version is [2.0.3](https://github.com/ghiscoding/native-copyfiles/releases/tag/v2.0.3).

## ✨ Features

- ✅ Lightweight, zero dependencies, small size
- ✅ Leverages the copying capabilities of `native-copyfiles`

## 📦 Installation

Install the dependency in your project:

```sh
# npm
npm i rolldown-plugin-copy-files

# pnpm
pnpm add rolldown-plugin-copy-files
```

## 🚀 Usage

Add the plugin to your Rolldown configuration:

```js
import { defineConfig } from "rolldown";
import { copyFiles } from "rolldown-plugin-copy-files";

export default defineConfig({
  plugins: [
    copyFiles({
      targets: [
        {
          src: "src/*.d.ts",
          dest: "dist",
          options: { up: 1 },
        },
      ],
    }),
  ],
});
```

Each `target` represents a single `native-copyfiles` copy task.

| Parameter  | Type                 | Description                                     |
| ---------- | -------------------- | ----------------------------------------------- |
| `src`      | `string \| string[]` | Source file(s) or glob pattern(s)               |
| `dest`     | `string`             | Destination path                                |
| `options`  | `object`             | Configuration passed to `native-copyfiles`      |
| `callback` | `Function`           | Callback function invoked after copying is done |

> [!TIP]
> For the specific configuration options supported by `options` and the copying rules, please refer to the `native-copyfiles` [documentation](https://github.com/ghiscoding/native-copyfiles#javascript-api).

## 🙏 Credits

- [native-copyfiles](https://www.npmjs.com/package/native-copyfiles)
