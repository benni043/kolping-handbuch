export interface Structure {
  uuid: string;
  id: string;
  name: string;
  children: ChildStructure[];
}

export interface ChildStructure {
  uuid: string;
  id: string;
  name: string;
}

export type RawEntry = {
  id: string;
  name: string;
};

export const MAPPINGS_PATH = "data/metadata/mappings.json";

export type RawData = Record<string, RawEntry>;

export function transformToNestedStructure(rawData: RawData): Structure[] {
  // 1. Alle Einträge mit ihrer UUID in ein Array packen
  const entries = Object.entries(rawData).map(([uuid, entry]) => ({
    uuid,
    id: entry.id,
    name: entry.name,
  }));

  // 2. Map: id → kompletter Eintrag (für schnellen Parent-Zugriff)
  const byId = new Map<string, (typeof entries)[0]>();
  entries.forEach((e) => byId.set(e.id, e));

  // 3. Ergebnis-Array für Root-Ebene
  const root: Structure[] = [];

  entries.forEach((entry) => {
    const { uuid, id, name } = entry;

    // Hauptpunkt (kein "-" in der ID)
    if (!id.includes("-")) {
      root.push({
        uuid,
        id,
        name,
        children: [],
      });
      return;
    }

    // Unterpunkt → Parent-ID ist alles vor dem ersten "-"
    const parentId = id.split("-")[0];

    // Parent im root-Array suchen
    let parent = root.find((p) => p.id === parentId);

    // Falls noch nicht vorhanden → anlegen (auch wenn er später im JSON steht)
    if (!parent) {
      const parentEntry = byId.get(parentId);
      if (!parentEntry) {
        console.warn(
          `Elternknoten mit ID "${parentId}" für "${id}" nicht gefunden!`,
        );
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

    // Kind mit UUID hinzufügen
    parent.children.push({
      uuid,
      id,
      name,
    });
  });

  // Sortierung nach ID (optional, aber empfohlen)
  root.sort((a, b) => a.id.localeCompare(b.id));
  root.forEach((parent) => {
    parent.children.sort((a, b) => a.id.localeCompare(b.id));
  });

  return root;
}
