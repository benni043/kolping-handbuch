import { mkdir, stat } from "fs/promises";
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

  if (!body.folder || !validateFolder(body.folder))
    throw createError({ statusCode: 400, statusMessage: "Invalid upload" });

  let targetPath = "";

  if (body.path === "") targetPath = safeJoin(FILE_ROOT, `${body.folder}`);
  else targetPath = safeJoin(FILE_ROOT, `${body.path}/${body.folder}`);

  try {
    await stat(targetPath);

    throw createError({
      statusCode: 409,
      statusMessage: "File already exists",
    });
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;
  }

  await mkdir(targetPath, { recursive: true });
});
