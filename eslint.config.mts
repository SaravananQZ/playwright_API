import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    // This replaces .eslintignore
    // ignores: ["tests/api/api_aaa.spec.ts"],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "no-console": "off",
      semi: ["warn", "always"],
      quotes: ["warn", "double"],
      "prettier/prettier": "warn",
      "prefer-const": "error",
    },
  },
]);

// import js from "@eslint/js";
// import globals from "globals";
// import tseslint from "typescript-eslint";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   {
//     files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
//     plugins: { js }, extends: ["js/recommended"],
//     languageOptions: { globals: globals.browser } },
//     tseslint.configs.recommended

// ]);
