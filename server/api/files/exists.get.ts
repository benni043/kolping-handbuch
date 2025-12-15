import { join } from "path";
import { existsSync } from "fs";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin" && user.role !== "editor") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const query = getQuery(event);

  const path = query.path as string;

  if (!path)
    return sendError(
      event,
      createError({
        statusCode: 403,
        statusMessage: "Missing required fields: path, subpath and/or page",
      }),
    );

  const baseDir = join(process.cwd(), `data/files/${path}`);

  if (!existsSync(baseDir))
    return sendError(
      event,
      createError({
        statusCode: 404,
        statusMessage: "File not found",
      }),
    );

  return {};
});
