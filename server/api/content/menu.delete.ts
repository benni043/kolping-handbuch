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

  let data = JSON.parse(await readFile(metadataPath, "utf-8"));

  data = removeKeysWithPrefix(data, body.menuId);

  await writeFile(metadataPath, JSON.stringify(data, null, 2), "utf-8");

  return { success: true };
});
