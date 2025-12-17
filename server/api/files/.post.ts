import { join, normalize } from "path";
import { writeFile } from "fs/promises";

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

  const relPath = normalize(pathPart.data.toString()).replace(
    /^(\.\.(\/|\\|$))+/,
    "",
  );

  const basePath = join(process.cwd(), "data/files/");

  const targetDir = join(basePath, relPath);
  const targetFile = join(targetDir, file.filename!);

  await writeFile(targetFile, file.data);
});
