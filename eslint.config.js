import globals from "globals";
import { defineConfig } from "eslint/config";
import ui5Config from "eslint-config-mlauffer-ui5";
import { configs as wdioConfigs } from "eslint-plugin-wdio";

export default defineConfig([
  {
    name: "local-ignores",
    ignores: [
      "**/coverage/",
      "**/dist/",
      "**/gen/",
      "**/resources/",
      "**/thirdparty/"
    ],
  },
  {
    files: ["src/**/*.js", "test/**/*.js", "demo/**/*.js"],
    extends: [ui5Config],
  },
  {
    files: ["test/**/*.js"],
    extends: [wdioConfigs["flat/recommended"]],
    languageOptions: {
      globals: {
        ...globals.qunit,
        ...globals.mocha,
      },
    },
    rules: {
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
    },
  },
]);
