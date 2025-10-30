import { log } from "console";
import { writeFile } from "fs/promises";
import { join } from "path";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role! !== "admin") {
    return sendError(
      event,
      createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      }),
    );
  }

  const body: { paths: string[]; fileName: string; data: string } =
    await readBody(event);

  let path = "data/content/";

  body.paths.forEach((elem) => {
    path += elem;
    path += "/";
  });

  path += body.fileName;
  path += ".md";

  const filePath = join(process.cwd(), path);

  try {
    await writeFile(filePath, body.data, "utf-8");

    return { success: true, path: filePath };
  } catch {
    return sendError(
      event,
      createError({
        statusCode: 404,
        statusMessage: "Datei existiert nicht",
      }),
    );
  }
});
