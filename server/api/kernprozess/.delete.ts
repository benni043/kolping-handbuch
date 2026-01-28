import { readdir, readFile, writeFile, unlink } from "fs/promises";

type KernprozessFile = {
  schrittCount: number;
  [key: string]: unknown;
};

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin" && user.role !== "editor")
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });

  const body: {
    path: string;
    subPath: string;
    kernprozessNumber: number;
  } = await readBody(event);

  if (!Number.isFinite(body.kernprozessNumber))
    throw createError({
      statusCode: 406,
      statusMessage: "kernprozessNumber must be a number",
    });

  const dirPath = safeJoin(
    CONTENT_ROOT,
    `${body.path}/${body.subPath}/kernprozesse`,
  );

  const files = await readdir(dirPath);

  const kernprozesse: {
    file: string;
    data: KernprozessFile;
  }[] = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const fullPath = safeJoin(dirPath, file);
    const data = JSON.parse(
      await readFile(fullPath, "utf-8"),
    ) as KernprozessFile;

    kernprozesse.push({ file, data });
  }

  const toDelete = kernprozesse.find(
    (k) => k.data.schrittCount === body.kernprozessNumber,
  );

  if (!toDelete)
    throw createError({
      statusCode: 409,
      statusMessage: `kernprozess with number ${body.kernprozessNumber} does not exist`,
    });

  await unlink(safeJoin(dirPath, toDelete.file));

  const toShift = kernprozesse
    .filter((k) => k.data.schrittCount > body.kernprozessNumber)
    .sort((a, b) => a.data.schrittCount - b.data.schrittCount);

  for (const kp of toShift) {
    kp.data.schrittCount--;

    await writeFile(
      safeJoin(dirPath, kp.file),
      JSON.stringify(kp.data, null, 2),
      "utf-8",
    );
  }

  return { success: true };
});
