import { join } from "path";
import { existsSync, readFileSync, readdirSync } from "fs";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const query = getQuery(event);

  const path = query.path as string;
  const subPath = query.subPath as string;

  if (!path || !subPath)
    return sendError(
      event,
      createError({
        statusCode: 403,
        statusMessage: "Missing required fields: path and/or subPath",
      }),
    );

  const dirPath = join(
    process.cwd(),
    `data/content/${path}/${subPath}/kernprozesse`,
  );

  if (!existsSync(dirPath))
    return sendError(
      event,
      createError({
        statusCode: 404,
        statusMessage: "Kernprozesse folder not found",
      }),
    );

  const files = readdirSync(dirPath).filter((f) => f.endsWith(".json"));

  const data = files.map((file) => {
    const content = readFileSync(join(dirPath, file), "utf-8");
    return JSON.parse(content);
  });

  return data;
});
