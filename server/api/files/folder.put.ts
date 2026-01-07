import { rename, stat } from "fs/promises";
import { join } from "path";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin" && user.role !== "editor")
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });

  const body = await readBody<{
    path: string;
    oldName: string;
    newName: string;
  }>(event);

  if (!body.path || !body.oldName || !body.newName)
    throw createError({ statusCode: 400, statusMessage: "Invalid request" });

  const base = join(process.cwd(), "data/files");
  const oldPath = join(base, body.path, body.oldName);
  const newPath = join(base, body.path, body.newName);

  try {
    await stat(newPath);

    throw createError({
      statusCode: 409,
      statusMessage: "File already exists",
    });
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;
  }

  await rename(oldPath, newPath);
});
