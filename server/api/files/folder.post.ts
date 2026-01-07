import { mkdir } from "fs/promises";
import { validateFolder } from "~~/shared/utils/checks";
import { FILE_ROOT, safeJoin } from "~~/server/utils/traversal";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin" && user.role !== "editor")
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });

  const body = await readBody<{
    path: string;
    folder: string;
  }>(event);

  if (!body.folder)
    throw createError({ statusCode: 400, statusMessage: "Invalid upload" });

  if (!validateFolder(body.folder))
    throw createError({ statusCode: 400, statusMessage: "Invalid upload" });

  const targetPath = safeJoin(FILE_ROOT, `${body.path}/${body.folder}`);

  await mkdir(targetPath, { recursive: true });
});
