import { join } from "path";
import { readdir, stat } from "fs/promises";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin" && user.role !== "editor")
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });

  const query = getQuery(event);
  const relativePath = (query.path || "").toString();

  const targetPath = safeJoin(FILE_ROOT, relativePath);

  const entries = await readdir(targetPath, { withFileTypes: true });

  return await Promise.all(
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
});
