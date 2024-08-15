import noNull from "eslint-plugin-no-null";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["projects/**/*", "**/package-lock.json","node_modules/**","build/**","dist/**","res/**","coverage/**"],
}, ...compat.extends(
    "plugin:@angular-eslint/template/process-inline-templates",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
).map(config => ({
    ...config,
    files: ["**/*.ts"],
})), {
    files: ["**/*.ts"],

    plugins: {
        "no-null": noNull,
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: ["tsconfig.json", "e2e/tsconfig.e2e.json"],
            createDefaultProgram: true,
        },
    },

    rules: {
        "import/newline-after-import": "off",
        "import/no-named-as-default": "off",
        "import/no-named-as-default-member": "off",
        "@angular-eslint/directive-selector": "off",
        "@angular-eslint/no-forward-ref": "off",
        "no-return-await": "off",
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/ban-types": "off",
        camelcase: "off",
        "class-methods-use-this": "off",
        "dot-notation": "off",
        eqeqeq: "error",
        "lines-between-class-members": "off",
        "padded-blocks": "off",

        "max-len": ["error", {
            code: 200,
            ignoreComments: true,
            ignoreUrls: true,
            ignoreTemplateLiterals: true,
            ignoreRegExpLiterals: true,
        }],

        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "warn",
        "guard-for-in": "off",
        "jsdoc/newline-after-description": "off",
        "jsdoc/no-types": "off",
        "@typescript-eslint/consistent-type-assertions": "warn",
        "@typescript-eslint/no-unsafe-enum-comparison": "off",

        "@typescript-eslint/array-type": ["error", {
            default: "array",
        }],

        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/consistent-type-definitions": "error",
        "@typescript-eslint/dot-notation": "off",

        "@typescript-eslint/explicit-member-accessibility": ["off", {
            accessibility: "explicit",
        }],

        "@typescript-eslint/member-delimiter-style": ["off", {
            multiline: {
                delimiter: "none",
                requireLast: true,
            },

            singleline: {
                delimiter: "semi",
                requireLast: false,
            },
        }],

        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error"],
        "@typescript-eslint/member-ordering": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-for-in-array": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-require-imports": "error",
        "@typescript-eslint/no-unnecessary-qualifier": "error",
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/no-explicit-any": "off",
        " @typescript-eslint/no-empty-function": "off",
        "@angular-eslint/component-selector": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "no-console": "off",

        "@typescript-eslint/ban-ts-comment": ["off", {
            "ts-ignore": "allow-with-description",
        }],

        "@typescript-eslint/no-implied-eval": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/require-await": "off",
        "no-empty": "off",
        "no-unused-expressions": "off",
        "@typescript-eslint/no-unsafe-argument": "off",

        "@typescript-eslint/unbound-method": ["off", {
            ignoreStatic: true,
        }],

        "@typescript-eslint/promise-function-async": "error",
        "@typescript-eslint/restrict-plus-operands": "error",
        "@typescript-eslint/semi": ["off", null],
        "@typescript-eslint/strict-boolean-expressions": "off",
        "arrow-parens": ["off", "always"],
        "brace-style": ["error", "1tbs"],
        "comma-dangle": "error",
        "default-case": "warn",
        "default-param-last": "off",
        "id-blacklist": "off",
        "id-match": "off",
        "import/no-default-export": "off",
        "import/prefer-default-export": "off",
        "import/no-unassigned-import": "off",
        "import/no-unresolved": "off",
        "import/no-mutable-exports": "off",
        "import/extensions": "off",
        "import/no-amd": "off",
        "import/no-extraneous-dependencies": "off",

        indent: ["error", "tab", {
            SwitchCase: 1,
        }],

        "linebreak-style": "error",
        "max-lines": "off",
        "no-continue": "off",
        "no-constant-condition": "error",
        "no-control-regex": "warn",
        "no-else-return": "off",
        "no-invalid-regexp": "error",
        "no-invalid-this": "off",
        "no-irregular-whitespace": "error",
        "no-multiple-empty-lines": "error",
        "@angular-eslint/no-empty-lifecycle-method": "off",
        "no-empty-function": "off",
        "no-null/no-null": "off",
        "no-nested-ternary": "off",
        "no-param-reassign": "off",
        "no-redeclare": "error",
        "no-regex-spaces": "error",
        "no-restricted-syntax": ["off", "ForInStatement"],
        "no-sparse-arrays": "error",
        "no-tabs": "off",
        "no-template-curly-in-string": "error",
        "no-underscore-dangle": "off",
        "no-use-before-define": "off",
        "no-useless-constructor": "off",
        "no-void": "off",
        "@typescript-eslint/no-useless-constructor": ["error"],
        "no-mixed-spaces-and-tabs": [2, "smart-tabs"],

        "padding-line-between-statements": ["error", {
            blankLine: "always",
            prev: "*",
            next: "return",
        }],

        "prefer-arrow/prefer-arrow-functions": "off",
        "prefer-template": "error",
        "prefer-destructuring": "off",
    },
}, ...compat.extends("plugin:@angular-eslint/template/recommended").map(config => ({
    ...config,
    files: ["**/*.html"],
})), {
    files: ["**/*.html"],
    rules: {},
}];