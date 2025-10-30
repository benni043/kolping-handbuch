import { writeFile } from "fs/promises";
import { join } from "path";

export default defineEventHandler(async (event) => {
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
