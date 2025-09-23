import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.strict, {
    settings: {
        "import/resolver": {
            typescript: true,
        },
    },
    plugins: {
        import: importPlugin,
    },
    files: ["src/**/*.{ts,js}"],
    linterOptions: {
        reportUnusedDisableDirectives: "error",
    },
    rules: {
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "no-console": "off",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/consistent-type-exports": "error",
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/explicit-module-boundary-types": "error",
        "import/no-relative-parent-imports": [
            "error",
            {
                "allow-uncles": false,
                "ignore-patterns": ["@/"],
            },
        ],
    },
});
