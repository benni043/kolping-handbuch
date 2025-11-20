import { writeFile, readFile, rm } from "fs/promises";
import { join } from "path";
import { MAPPINGS_PATH } from "~~/server/utils/types";

function removeKeysWithPrefix(obj: Record<string, RawEntry>, prefix: string) {
  for (const [key, entry] of Object.entries(obj)) {
    if (entry.id.startsWith(prefix)) {
      delete obj[key];
    }
  }

  return obj;
}

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const body = await readBody<{
    menuUuid: string;
    menuId: string;
  }>(event);

  const dirPath = join(process.cwd(), `data/content/${body.menuUuid}`);

  await rm(dirPath, { recursive: true, force: true });

  const metadataPath = join(process.cwd(), MAPPINGS_PATH);

  let data: Record<string, RawEntry> = JSON.parse(
    await readFile(metadataPath, "utf-8"),
  );

  data = removeKeysWithPrefix(data, body.menuId);

  const removedIndex = parseInt(body.menuId);

  Object.entries(data).forEach(([_id, item]) => {
    if (!item.id.includes("-")) {
      const num = parseInt(item.id);

      if (num > removedIndex) {
        const newId = `${(num - 1).toString().padStart(2, "0")}`;
        item.id = newId;
      }
    } else {
      const [p, idxStr] = item.id.split("-");
      const num = parseInt(p);

      if (num > removedIndex) {
        const newId = `${(num - 1).toString().padStart(2, "0")}-${idxStr}`;
        item.id = newId;
      }
    }
  });

  await writeFile(metadataPath, JSON.stringify(data, null, 2), "utf-8");

  return { success: true };
});
