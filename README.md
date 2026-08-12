# rolldown-plugin-copy-files

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://www.lujiahao.com/sponsor)
[![Node](https://img.shields.io/node/v/rolldown-plugin-copy-files.svg)](https://nodejs.org/en/about/previous-releases)
[![Test](https://img.shields.io/github/actions/workflow/status/ajiho/rolldown-plugin-copy-files/tests.yml?label=Test&logo=github&style=flat-square&branch=main)](https://github.com/ajiho/rolldown-plugin-copy-files/actions/workflows/tests.yml)
[![codecov](https://codecov.io/github/ajiho/rolldown-plugin-copy-files/graph/badge.svg?token=YR846BMB6Y)](https://codecov.io/github/ajiho/rolldown-plugin-copy-files)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/ajiho/rolldown-plugin-copy-files/blob/main/LICENSE)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/rolldown-plugin-copy-files)

---

简体中文 | [English](./README.en.md)

基于 [`native-copyfiles`](https://github.com/ghiscoding/native-copyfiles) 的 Rolldown 文件复制插件。

> [!NOTE]
> 当前内置的 `native-copyfiles` 版本为 [2.0.3](https://github.com/ghiscoding/native-copyfiles/releases/tag/v2.0.3)。

## ✨ 特性

- ✅ 轻量、零依赖、体积小
- ✅ 享受 `native-copyfiles` 的复制能力

## 📦 安装

在项目中安装此依赖：

```sh
# npm
npm i rolldown-plugin-copy-files

# pnpm
pnpm add rolldown-plugin-copy-files
```

## 🚀 使用

将插件添加到 Rolldown 配置中：

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

每个 `target` 表示一次 `native-copyfiles` 复制任务。

| 参数       | 类型                 | 说明                             |
| ---------- | -------------------- | -------------------------------- |
| `src`      | `string \| string[]` | 源文件或文件匹配规则             |
| `dest`     | `string`             | 目标路径                         |
| `options`  | `object`             | 传递给 `native-copyfiles` 的配置 |
| `callback` | `Function`           | 复制完成后的回调函数             |

> [!TIP]
> `options` 支持的具体配置以及复制规则，请参考 `native-copyfiles` [文档](https://github.com/ghiscoding/native-copyfiles#javascript-api) 。

## 🙏 鸣谢

- [native-copyfiles](https://www.npmjs.com/package/native-copyfiles)
