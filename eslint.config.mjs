import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import mochaNoOnly from "eslint-plugin-mocha-no-only";
import globals from "globals";

export default [
    {
        ignores: ["out/**", "dist/**", "src/mathcalc.js"]
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
                ...globals.node,
                ...globals.mocha
            }
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            "mocha-no-only": mochaNoOnly
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            "mocha-no-only/mocha-no-only": "error",
            // TypeScript already checks undefined names (and no-undef misses types like Thenable/NodeJS)
            "no-undef": "off",
            "@typescript-eslint/no-unused-vars": ["error", { args: "none", caughtErrors: "none" }],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-require-imports": "off"
        }
    },
    {
        // chai assertions such as `expect(x).to.be.true;` are expressions
        files: ["src/test/**/*.ts"],
        rules: {
            "@typescript-eslint/no-unused-expressions": "off",
            "no-useless-assignment": "off"
        }
    }
];