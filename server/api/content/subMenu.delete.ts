import { writeFile, readFile, rm } from "fs/promises";
import { join } from "path";

function removeKey(obj: Record<string, string>, key: string) {
  const { [key]: _, ...rest } = obj;
  return rest;
}

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (user.role !== "admin") throw createError({ statusCode: 403 });

  const body = await readBody<{
    menuUuid: string;
    subMenuUuid: string;
  }>(event);

  const metadataPath = join(process.cwd(), "data/metadata/mappings.json");
  const data = JSON.parse(await readFile(metadataPath, "utf-8"));

  const removed = data[body.subMenuUuid];
  if (!removed) return { success: true };

  const [prefix, removedIndexStr] = removed.id.split("-");
  const removedIndex = parseInt(removedIndexStr);

  // 1️⃣ zuerst löschen
  delete data[body.subMenuUuid];

  // 2️⃣ alle sub-einträge updaten die > removedIndex
  Object.entries(data).forEach(([uuid, item]: any) => {
    if (!item.id.startsWith(prefix + "-")) return;

    const [p, idxStr] = item.id.split("-");
    const idx = parseInt(idxStr);
    if (idx > removedIndex) {
      const newId = `${prefix}-${idx - 1}`;
      item.id = newId;
    }
  });

  await writeFile(metadataPath, JSON.stringify(data, null, 2), "utf-8");

  const dirPath = join(
    process.cwd(),
    `data/content/${body.menuUuid}/${body.subMenuUuid}`,
  );
  await rm(dirPath, { recursive: true, force: true });

  return { success: true };
});
