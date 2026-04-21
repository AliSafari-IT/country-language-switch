import { defineConfig } from "tsup";
import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2020",
  treeshake: true,
  external: ["react", "react-dom"],
  // Keep "use client" directives for Next.js App Router consumers
  banner: { js: '"use client";' },
  injectStyle: false,
  outExtension: ({ format }) => ({ js: format === "esm" ? ".js" : ".cjs" }),
  // Copy the stylesheet next to the bundles so
  // `@asafarim/country-language-selector/styles.css` resolves against dist/.
  async onSuccess() {
    mkdirSync(resolve("dist"), { recursive: true });
    copyFileSync(
      resolve("src/styles/styles.css"),
      resolve("dist/styles.css")
    );
  },
});
