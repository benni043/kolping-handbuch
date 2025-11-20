import { unlink } from "fs/promises";
import { join } from "path";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin" && user.role! !== "editor") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const body: {
    path: string;
    subPath: string;
    kernprozessNumber: number;
  } = await readBody(event);

  const filePath = join(
    process.cwd(),
    `data/content/${body.path}/${body.subPath}/kernprozesse/kernprozess_${body.kernprozessNumber}.json`,
  );

  await unlink(filePath);

  return { success: true, deleted: filePath };
});
