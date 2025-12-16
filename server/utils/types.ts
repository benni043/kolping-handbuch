export type RawEntry = {
  id: string;
  name: string;
};

export type RawData = Record<string, RawEntry>;

export const MAPPINGS_PATH = "data/metadata/mappings.json";

export function transformToNestedStructure(rawData: RawData): Structure[] {
  const entries = Object.entries(rawData).map(([uuid, entry]) => ({
    uuid,
    id: entry.id,
    name: entry.name,
  }));

  const byId = new Map<string, (typeof entries)[0]>();
  entries.forEach((e) => byId.set(e.id, e));

  const root: Structure[] = [];

  entries.forEach((entry) => {
    const { uuid, id, name } = entry;

    if (!id.includes("-")) {
      root.push({
        uuid,
        id,
        name,
        children: [],
      });
      return;
    }

    const parentId = id.split("-")[0];

    let parent: Structure = root.find((p) => p.id === parentId);

    if (!parent) {
      const parentEntry = byId.get(parentId);
      if (!parentEntry) {
        console.error(`id not found`);
        return;
      }

      parent = {
        uuid: parentEntry.uuid,
        id: parentEntry.id,
        name: parentEntry.name,
        children: [],
      };

      root.push(parent);
    }

    parent.children.push({
      uuid,
      id,
      name,
    } as ChildStructure);
  });

  root.sort((a, b) => a.id.localeCompare(b.id));

  root.forEach((parent) => {
    parent.children.sort((a, b) => a.id.localeCompare(b.id));
  });

  return root;
}
