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
    getTitleById(id: string) {
      const s = this.structure.find((item) => item.id === id);
      return s ? s.title : null;
    },
    getChildTitleById(parentId: string, childId: string) {
      const parent = this.structure.find((item) => item.id === parentId);
      if (!parent) return null;
      const child = parent.children.find((c) => c.id === childId);
      return child ? child.title : null;
    },
  },
});
