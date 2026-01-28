import { existsSync, readFileSync, readdirSync } from "fs";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const query = getQuery(event);

  const path = query.path as string;
  const subPath = query.subPath as string;

  if (!path || !subPath)
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields: path and/or subPath",
    });

  const dirPath = safeJoin(CONTENT_ROOT, `${path}/${subPath}/kernprozesse`);

  if (!existsSync(dirPath))
    throw createError({
      statusCode: 404,
      statusMessage: "Kernprozesse folder not found",
    });

  const files = readdirSync(dirPath).filter((f) => f.endsWith(".json"));

  const data = files.map((file) => {
    const content = readFileSync(safeJoin(dirPath, file), "utf-8");
    return JSON.parse(content);
  });

  return data;
});
