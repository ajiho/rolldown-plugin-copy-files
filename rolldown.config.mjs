import { defineConfig } from "rolldown";
import { copyFiles } from "./src/index.js";

export default defineConfig({
  input: "src/index.js",
  platform: "node",
  output: [
    {
      file: "dist/index.js",
      format: "es",
    },
  ],
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
