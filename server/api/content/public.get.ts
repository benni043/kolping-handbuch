import { join } from "path";
import { existsSync, readFileSync } from "fs";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const file = query.file as string;

  if (!file)
    throw createError({
      statusCode: 403,
      statusMessage: "Missing required field: file",
    });

  const baseDir = join(process.cwd(), `data/${file}.md`);

  if (!existsSync(baseDir))
    throw createError({
      statusCode: 404,
      statusMessage: "File not found",
    });

  return readFileSync(baseDir, "utf-8");
});
