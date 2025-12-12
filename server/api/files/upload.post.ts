import { join } from "path";
import { writeFile } from "fs/promises";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!["admin", "editor"].includes(user.role))
    throw createError({ statusCode: 403 });

  const q = getQuery(event);
  const path = q.path || "/";
  const base = join(process.cwd(), "data/files");
  const dir = join(base, path.toString());

  const form = await readMultipartFormData(event);
  const file = form?.find((f) => f.name === "file");

  if (!file) throw createError({ statusCode: 400 });

  const dest = join(dir, file.filename!);
  await writeFile(dest, file.data);

  return { ok: true };
});
