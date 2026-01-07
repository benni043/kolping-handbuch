import { existsSync, readFileSync } from "fs";
import { PUBLIC_ROOT, safeJoin } from "~~/server/utils/traversal";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const file = query.file as string;

  if (!file)
    throw createError({
      statusCode: 403,
      statusMessage: "Missing required field: file",
    });

  const baseDir = safeJoin(PUBLIC_ROOT, `${file}.md`);

  if (!existsSync(baseDir))
    throw createError({
      statusCode: 404,
      statusMessage: "File not found",
    });

  return readFileSync(baseDir, "utf-8");
});
