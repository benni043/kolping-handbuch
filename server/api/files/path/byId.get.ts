import { join } from "path";
import { readFile } from "fs/promises";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const query = getQuery(event);

  const uuid = query.uuid as string;

  const fileMappingsPath = join(
    process.cwd(),
    "data/metadata/file_mappings.json",
  );

  const data = JSON.parse(await readFile(fileMappingsPath, "utf-8"));

  if (!uuid || !data[uuid]) {
    throw createError({
      statusCode: 404,
      statusMessage: "File not found",
    });
  }

  return data[uuid];
});
