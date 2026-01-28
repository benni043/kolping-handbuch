import { existsSync, readFileSync } from "fs";
import { extname, basename } from "path";
import mime from "mime-types";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const query = getQuery(event);
  const path = query.path as string;

  if (!path)
    throw createError({ statusCode: 400, statusMessage: "Missing path" });

  const filePath = safeJoin(FILE_ROOT, path);

  if (!existsSync(filePath))
    throw createError({ statusCode: 404, statusMessage: "File not found" });

  const buffer = readFileSync(filePath);
  const fileName = basename(path);

  const mimeType = mime.lookup(extname(fileName)) || "application/octet-stream";

  setHeader(event, "Content-Type", mimeType);
  setHeader(
    event,
    "Content-Disposition",
    `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
  );

  return buffer;
});
