import { writeFile, stat } from "fs/promises";
import { CONTENT_ROOT, safeJoin } from "~~/server/utils/traversal";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin" && user.role! !== "editor") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const body = await readBody<{
    path: string;
    subPath: string;
    kernprozessNumber: number;
    data: string;
  }>(event);

  const filePath = safeJoin(
    CONTENT_ROOT,
    `${body.path}/${body.subPath}/kernprozesse/kernprozess_${body.kernprozessNumber}.json`,
  );

  try {
    await stat(filePath);

    await writeFile(filePath, body.data, "utf-8");
    return { success: true, path: filePath };
  } catch (err: any) {
    throw createError({
      statusCode: 409,
      statusMessage: `kernprozess with number ${body.kernprozessNumber} already exists`,
    });
  }
});
