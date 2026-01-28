import { existsSync } from "fs";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const query = getQuery(event);

  const path = query.path as string;

  if (!path)
    throw createError({
      statusCode: 403,
      statusMessage: "Missing required fields: path, subpath and/or page",
    });

  const baseDir = safeJoin(FILE_ROOT, path);

  if (!existsSync(baseDir))
    throw createError({
      statusCode: 404,
      statusMessage: "File not found",
    });
});
