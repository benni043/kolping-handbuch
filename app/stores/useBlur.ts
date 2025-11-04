import { defineStore } from "pinia";

export const useBlurStore = defineStore("blur", {
  state: () => ({
    blur: false,
  }),
});
