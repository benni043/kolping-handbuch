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

  const body: {
    path: string;
    subPath: string;
    kernprozessNumber: number;
    data: string;
  } = await readBody(event);

  const path = `data/content/${body.path}/${body.subPath}/kernprozesse/kernprozess_${body.kernprozessNumber}.json`;
  const filePath = join(process.cwd(), path);

  await writeFile(filePath, body.data, "utf-8");

  return { success: true, path: filePath };
});
