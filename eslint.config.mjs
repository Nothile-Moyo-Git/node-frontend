/* eslint-disable prettier/prettier */
/**
 *
 * Date created: 21/02/2024
 *
 * Author : Nothile Moyo
 *
 * Description: Our eslint config for the frontend. It uses eslint v9 as well as prettier
 *
 */
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  // For regular files
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintPluginPrettierRecommended,
  // For test files
  {
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/__tests__/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: globals.jest,
    },
  },
  {
    files: ["**/setup*.ts", "**/jest.setup.ts"],
    languageOptions: {
      globals: globals.jest,
    },
  },
  {
    languageOptions: {
      globals: {
        global: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
      }
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "prettier/prettier": ["error", { "endOfLine": "auto" }],
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      "no-undef": "error",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];
