import { stat, writeFile } from "fs/promises";
import { FILE_ROOT, safeJoin } from "~~/server/utils/traversal";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin" && user.role !== "editor")
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });

  const parts = await readMultipartFormData(event);
  if (!parts) throw createError({ statusCode: 400, statusMessage: "No data" });

  const file = parts.find((p) => p.name === "file");
  const pathPart = parts.find((p) => p.name === "path");

  if (!file || !file.data || !pathPart?.data)
    throw createError({ statusCode: 400, statusMessage: "Invalid upload" });

  const relPath = pathPart.data.toString();

  const targetDir = safeJoin(FILE_ROOT, relPath);
  const targetFile = safeJoin(targetDir, file.filename!);

  try {
    await stat(targetFile);

    throw createError({
      statusCode: 409,
      statusMessage: "File already exists",
    });
  } catch (err) {
    const error = err as NodeJS.ErrnoException;

    if (error.code !== "ENOENT") throw err;
  }

  await writeFile(targetFile, file.data);
});
