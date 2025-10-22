import { join } from "path";
import { existsSync, readFileSync } from "fs";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const path = query.path as string;
  const subPath = query.subPath as string;
  const page = query.page as string;

  if (!path || !subPath || !page)
    return sendError(
      event,
      createError({
        statusCode: 403,
        statusMessage: "Missing required fields: path, subpath and/or page",
      }),
    );

  const baseDir = join(
    process.cwd(),
    `data/content/${path}/${subPath}/${page}.md`,
  );

  if (!existsSync(baseDir))
    return sendError(
      event,
      createError({
        statusCode: 404,
        statusMessage: "File not found",
      }),
    );

  return readFileSync(baseDir, "utf-8");
});
