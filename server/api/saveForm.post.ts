import { writeFile } from "fs/promises";
import { join } from "path";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const filePath = join(process.cwd(), "data/test", `form_${Date.now()}.json`);

  await writeFile(filePath, JSON.stringify(body, null, 2), "utf-8");

  return { success: true, path: filePath };
});
