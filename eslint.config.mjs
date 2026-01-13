// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  ignores: ["dist/**", "node_modules/**"],

  rules: {
    "vue/html-self-closing": "off",
    "@typescript-eslint/no-dynamic-delete": "off",
  },
});
