import { stat, writeFile, readFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

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

  const uuid = uuidv4();

  const metadataPath = join(process.cwd(), "data/metadata/file_mappings.json");

  const data = JSON.parse(await readFile(metadataPath, "utf-8"));

  data[uuid] = relPath ? `${relPath}/${file.filename!}` : file.filename!;

  await writeFile(metadataPath, JSON.stringify(data, null, 2), "utf-8");

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
