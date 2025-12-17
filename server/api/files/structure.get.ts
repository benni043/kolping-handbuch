import { join } from "path";
import { readdir, stat } from "fs/promises";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!["admin", "editor"].includes(user.role))
    throw createError({ statusCode: 403 });

  const query = getQuery(event);
  const relativePath = (query.path || "/").toString();

  if (relativePath.includes(".."))
    throw createError({ statusCode: 400, statusMessage: "Invalid path" });

  const basePath = join(process.cwd(), "data/files");
  const targetPath = join(basePath, relativePath);

  if (!targetPath.startsWith(basePath))
    throw createError({ statusCode: 400, statusMessage: "Invalid path" });

  const entries = await readdir(targetPath, { withFileTypes: true });

  const items = await Promise.all(
    entries.map(async (e) => {
      const full = join(targetPath, e.name);
      const s = await stat(full);

      return {
        name: e.name,
        type: e.isDirectory() ? "dir" : "file",
        size: s.size,
      };
    }),
  );

  return items;
});
