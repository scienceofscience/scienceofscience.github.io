import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Leftover Jekyll source, on its way out once the Next.js site is
    // verified live (see the migration plan) — not part of this app.
    "assets/**",
    "_scripts/**",
    "_plugins/**",
    "_site/**",
    "bin/**",
  ]),
]);

export default eslintConfig;
