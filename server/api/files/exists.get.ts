import { existsSync } from "fs";
import { FILE_ROOT, safeJoin } from "~~/server/utils/traversal";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin" && user.role !== "editor")
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });

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
