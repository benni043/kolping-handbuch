import { defineStore } from "pinia";
import type { Structure } from "~/types/structure";

export const useStructureStore = defineStore("structure", {
  state: () => ({
    structure: [] as Structure[],
  }),
  actions: {
    setStructure(data: Structure[]) {
      this.structure = data;
    },
    clearStructure() {
      this.structure = [];
    },
  },
});
