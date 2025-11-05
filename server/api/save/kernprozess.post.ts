import { writeFile, access } from "fs/promises";
import { join } from "path";
import { constants } from "fs";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const body = await readBody<{
    path: string;
    subPath: string;
    kernprozessNumber: number;
    data: string;
  }>(event);

  const filePath = join(
    process.cwd(),
    `data/content/${body.path}/${body.subPath}/kernprozesse/kernprozess_${body.kernprozessNumber}.json`,
  );

  try {
    await access(filePath, constants.F_OK);

    throw createError({
      statusCode: 400,
      statusMessage: `File with name kernprozess_${body.kernprozessNumber}.json already exists.`,
    });
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;
  }

  await writeFile(filePath, body.data, "utf-8");
  return { success: true, path: filePath };
});
