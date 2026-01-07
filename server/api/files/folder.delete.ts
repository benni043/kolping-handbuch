import { unlink, rm, stat } from "fs/promises";
import { join } from "path";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin" && user.role !== "editor")
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });

  const body = await readBody<{
    path: string;
    item: string;
  }>(event);

  if (!body.path)
    throw createError({ statusCode: 400, statusMessage: "Invalid request" });

  const filePath = join(process.cwd(), `data/files/${body.path}/${body.item}`);

  const s = await stat(filePath);

  if (s.isDirectory()) await rm(filePath, { recursive: true, force: true });
  else await unlink(filePath);
});
