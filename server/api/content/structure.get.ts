import { readFile } from "fs/promises";
import { existsSync } from "fs";

export default defineEventHandler(async () => {
  const baseDir = safeJoin(METADATA_ROOT, "mappings.json");

  if (!existsSync(baseDir))
    throw createError({
      statusCode: 404,
      statusMessage: "File not found",
    });

  const json = JSON.parse(await readFile(baseDir, "utf-8"));

  return transformToNestedStructure(json);
});
