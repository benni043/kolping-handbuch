import { defineStore } from "pinia";
import type { Structure } from "~/utils/type/structure";

export const useStructureStore = defineStore("structure", {
  state: () => ({
    structure: [] as Structure[],
  }),
  actions: {
    setStructure(data: Structure[]) {
      this.structure = data;
    },
    getIdByUuid(uuid: string) {
      const s = this.structure.find((item) => item.uuid === uuid);
      return s ? s.id : null;
    },
    getChildIdByUuid(parentUuid: string, childUuid: string) {
      const parent = this.structure.find((item) => item.uuid === parentUuid);
      if (!parent) return null;
      const child = parent.children.find((c) => c.uuid === childUuid);
      return child ? child.id : null;
    },
    getTitleById(id: string) {
      const s = this.structure.find((item) => item.uuid === id);
      return s ? s.name : null;
    },
    getChildTitleById(parentId: string, childId: string) {
      const parent = this.structure.find((item) => item.uuid === parentId);
      if (!parent) return null;
      const child = parent.children.find((c) => c.uuid === childId);
      return child ? child.name : null;
    },
    getOuterCount() {
      let count = 0;

      this.structure.forEach(() => {
        count++;
      });

      return count;
    },
  },
});
