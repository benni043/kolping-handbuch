import { writeFile } from "fs/promises";
import { join } from "path";
import { PUBLIC_ROOT, safeJoin } from "~~/server/utils/traversal";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role! !== "admin" && user.role! !== "editor")
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });

  const body: { paths: string[]; fileName: string; data: string } =
    await readBody(event);

  let path = "";

  if (body.paths.length !== 0) path += "content/";

  body.paths.forEach((elem) => {
    path += elem;
    path += "/";
  });

  path += body.fileName;
  path += ".md";

  const filePath = safeJoin(PUBLIC_ROOT, path);

  console.log(filePath);

  try {
    await writeFile(filePath, body.data, "utf-8");
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: `the file ${body.fileName} does not exist`,
    });
  }
});
