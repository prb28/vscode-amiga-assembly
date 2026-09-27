import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import mochaNoOnly from "eslint-plugin-mocha-no-only";
import globals from "globals";

export default [
    {
        ignores: ["out/**", "dist/**"]
    },
    js.configs.recommended,
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2019,
                sourceType: "module"
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node
            }
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            "mocha-no-only": mochaNoOnly
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            "mocha-no-only/mocha-no-only": "error"
        }
    }
];