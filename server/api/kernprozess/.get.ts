import { existsSync, readFileSync } from "fs";
import { CONTENT_ROOT, safeJoin } from "~~/server/utils/traversal";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const query = getQuery(event);

  const path = query.path as string;
  const subPath = query.subPath as string;
  const kernprozessNum = query.kernprozessNum as string;

  if (!path || !subPath || !kernprozessNum)
    throw createError({
      statusCode: 403,
      statusMessage:
        "Missing required fields: path, subpath and/or kernprozessNum",
    });

  const baseDir = safeJoin(
    CONTENT_ROOT,
    `${path}/${subPath}/kernprozesse/kernprozess_${kernprozessNum}.json`,
  );

  if (!existsSync(baseDir))
    throw createError({
      statusCode: 404,
      statusMessage: "File not found",
    });

  const content = readFileSync(baseDir, "utf-8");
  return JSON.parse(content);
});
