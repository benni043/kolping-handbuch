import { unlink } from "fs/promises";
import { join } from "path";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin" && user.role !== "editor")
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });

  const body = await readBody<{
    path: string;
  }>(event);

  if (!body.path)
    throw createError({ statusCode: 400, statusMessage: "Invalid request" });

  const filePath = join(process.cwd(), `data/files/${body.path}`);

  await unlink(filePath);
});
