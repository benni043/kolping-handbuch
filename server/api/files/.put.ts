import { rename, stat } from "fs/promises";
import { FILE_ROOT, safeJoin } from "~~/server/utils/traversal";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin" && user.role !== "editor")
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });

  const body = await readBody<{
    path: string;
    newName: string;
    oldName: string;
  }>(event);

  if (!body.oldName || !body.newName)
    throw createError({ statusCode: 400, statusMessage: "Invalid request" });

  if (!validateFolder(body.newName))
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid folder name",
    });

  let oldPath = "";
  let newPath = "";

  if (body.path === "") {
    oldPath = safeJoin(FILE_ROOT, `${body.oldName}`);
    newPath = safeJoin(FILE_ROOT, `${body.newName}`);
  } else {
    oldPath = safeJoin(FILE_ROOT, `${body.path}/${body.oldName}`);
    newPath = safeJoin(FILE_ROOT, `${body.path}/${body.newName}`);
  }

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
