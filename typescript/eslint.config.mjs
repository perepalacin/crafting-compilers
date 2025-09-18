import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.strict, {
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
        "@typescript-eslint/explicit-module-boundary-types": "error",
    },
});
