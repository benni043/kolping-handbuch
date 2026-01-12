import { readFile, rename, stat, writeFile } from "fs/promises";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin" && user.role! !== "editor")
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });

  const body = await readBody<{
    path: string;
    subPath: string;
    kernprozessNumberOld: number;
    kernprozessNumberNew: number;
  }>(event);

  if (!Number.isFinite(body.kernprozessNumberOld))
    throw createError({
      statusCode: 406,
      statusMessage: `expected number but got ${body.kernprozessNumberOld}`,
    });

  if (!Number.isFinite(body.kernprozessNumberNew))
    throw createError({
      statusCode: 406,
      statusMessage: `expected number but got ${body.kernprozessNumberNew}`,
    });

  const filePathOld = safeJoin(
    CONTENT_ROOT,
    `${body.path}/${body.subPath}/kernprozesse/kernprozess_${body.kernprozessNumberOld}.json`,
  );

  const filePathNew = safeJoin(
    CONTENT_ROOT,
    `${body.path}/${body.subPath}/kernprozesse/kernprozess_${body.kernprozessNumberNew}.json`,
  );

  try {
    await stat(filePathNew);

    throw createError({
      statusCode: 409,
      statusMessage: `kernprozess with number ${body.kernprozessNumberNew} already exists`,
    });
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;
  }

  const raw = await readFile(filePathOld, "utf8");
  const json = JSON.parse(raw);

  json.schrittCount = body.kernprozessNumberNew;

  await writeFile(filePathOld, JSON.stringify(json, null, 2), "utf8");
  await rename(filePathOld, filePathNew);
  return { success: true };
});
