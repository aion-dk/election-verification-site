import pluginVue from "eslint-plugin-vue";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import pluginVitest from "@vitest/eslint-plugin";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import vuejsA11y from "eslint-plugin-vuejs-accessibility";

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["src/**/*.{ts,mts,tsx,vue}"],
  },

  {
    name: "app/files-to-ignore",
    ignores: [
      "**/dist/**",
      "**/dist-ssr/**",
      "**/coverage/**",
      "**/storybook-static/**",
    ],
  },

  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  vuejsA11y.configs["flat/recommended"],

  {
    ...pluginVitest.configs.recommended,
    files: ["src/**/*.test.ts"],
  },

  skipFormatting,

  {
    files: ["**/*.{ts,mts,tsx,vue}"],
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "vue/multi-word-component-names": "off",
      "vitest/valid-expect": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "vuejs-accessibility/alt-text": "warn",
      "vuejs-accessibility/anchor-has-content": "warn",
      "vuejs-accessibility/aria-props": "warn",
      "vuejs-accessibility/aria-role": "warn",
      "vuejs-accessibility/aria-unsupported-elements": "warn",
      "vuejs-accessibility/click-events-have-key-events": "warn",
      "vuejs-accessibility/form-control-has-label": "warn",
      "vuejs-accessibility/heading-has-content": "warn",
      "vuejs-accessibility/iframe-has-title": "warn",
      "vuejs-accessibility/interactive-supports-focus": "warn",
      "vuejs-accessibility/label-has-for": ["warn", { required: { some: ["nesting", "id"] }, allowChildren: true }],
      "vuejs-accessibility/media-has-caption": "warn",
      "vuejs-accessibility/mouse-events-have-key-events": "warn",
      "vuejs-accessibility/no-access-key": "warn",
      "vuejs-accessibility/no-autofocus": "warn",
      "vuejs-accessibility/no-distracting-elements": "warn",
      "vuejs-accessibility/no-redundant-roles": "warn",
      "vuejs-accessibility/no-static-element-interactions": "warn",
      "vuejs-accessibility/role-has-required-aria-props": "warn",
      "vuejs-accessibility/tabindex-no-positive": "warn",
    },
  },
);
