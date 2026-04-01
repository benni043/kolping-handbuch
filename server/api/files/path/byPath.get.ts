import { join } from "path";
import { readFile } from "fs/promises";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const query = getQuery(event);

  const path = query.path as string;

  const fileMappingsPath = join(
    process.cwd(),
    "data/metadata/file_mappings.json",
  );

  const data = JSON.parse(await readFile(fileMappingsPath, "utf-8"));

  const entry = Object.entries(data).find(([key, value]) => value === path);

  if (!entry) {
    throw createError({ statusCode: 404 });
  }

  const [uuid] = entry;
  return uuid;
});
