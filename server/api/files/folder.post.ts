import { join, normalize } from "path";
import { mkdir } from "fs/promises";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin" && user.role !== "editor")
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });

  const body = await readBody<{
    folder: string;
  }>(event);

  if (!body.folder)
    throw createError({ statusCode: 400, statusMessage: "Invalid upload" });

  const basePath = join(process.cwd(), "data/files");
  const targetPath = join(basePath, normalize(body.folder));

  await mkdir(targetPath, { recursive: true });
});
