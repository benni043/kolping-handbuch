import { writeFile, readFile, rm } from "fs/promises";
import { join } from "path";

function removeKeysWithPrefix(obj: Record<string, string>, prefix: string) {
  const result: Record<string, string> = {};
  for (const key in obj) {
    if (!key.startsWith(prefix)) {
      result[key] = obj[key];
    }
  }
  return result;
}

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const body = await readBody<{
    menuId: string;
  }>(event);

  const dirPath = join(process.cwd(), `data/content/${body.menuId}`);

  await rm(dirPath, { recursive: true, force: true });

  // Mapping entfernen
  const metadataPath = join(process.cwd(), "data/metadata/mappings.json");
  let data = JSON.parse(await readFile(metadataPath, "utf-8"));

  data = removeKeysWithPrefix(data, body.menuId);

  await writeFile(metadataPath, JSON.stringify(data, null, 2), "utf-8");

  return { success: true };
});
