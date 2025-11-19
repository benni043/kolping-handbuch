import { writeFile, readFile, rm } from "fs/promises";
import { join } from "path";
import { MAPPINGS_PATH } from "~~/server/utils/types";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (user.role !== "admin") throw createError({ statusCode: 403 });

  const body = await readBody<{
    menuUuid: string;
    subMenuUuid: string;
  }>(event);

  const metadataPath = join(process.cwd(), MAPPINGS_PATH);
  const data: Record<string, RawEntry> = JSON.parse(
    await readFile(metadataPath, "utf-8"),
  );

  const removed = data[body.subMenuUuid];
  if (!removed) return { success: true };

  const [prefix, removedIndexStr] = removed.id.split("-");
  const removedIndex = parseInt(removedIndexStr);

  delete data[body.subMenuUuid];

  Object.entries(data).forEach(([_id, item]) => {
    if (!item.id.startsWith(prefix + "-")) return;

    const [_p, idxStr] = item.id.split("-");
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
