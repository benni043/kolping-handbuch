import { readdir, readFile, writeFile } from "fs/promises";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin" && user.role !== "editor") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const body = await readBody<{
    path: string;
    subPath: string;
    kernprozessNumber: number;
    data: string;
  }>(event);

  const target = body.kernprozessNumber;

  if (!Number.isInteger(target) || target < 1) {
    throw createError({
      statusCode: 406,
      statusMessage: `invalid schrittCount ${target}`,
    });
  }

  const dir = safeJoin(
    CONTENT_ROOT,
    `${body.path}/${body.subPath}/kernprozesse`,
  );

  const files = (await readdir(dir)).filter((f) => f.endsWith(".json"));

  const items = await Promise.all(
    files.map(async (file) => {
      const fullPath = path.join(dir, file);
      const json = JSON.parse(await readFile(fullPath, "utf-8"));
      return { fullPath, json };
    }),
  );

  items.sort((a, b) => a.json.schrittCount - b.json.schrittCount);

  for (let i = 0; i < items.length; i++) {
    if (items[i]!.json.schrittCount !== i + 1) {
      throw createError({
        statusCode: 500,
        statusMessage: "invalid schrittCount sequence on disk",
      });
    }
  }

  const n = items.length;

  if (target > n + 1) {
    throw createError({
      statusCode: 409,
      statusMessage: `schrittCount ${target} would create a gap (max ${n + 1})`,
    });
  }

  for (const item of items) {
    if (item.json.schrittCount >= target) {
      item.json.schrittCount += 1;

      await writeFile(
        item.fullPath,
        JSON.stringify(item.json, null, 2),
        "utf-8",
      );
    }
  }

  const uuid = uuidv4();
  const newPath = path.join(dir, `${uuid}.json`);

  const data = JSON.parse(body.data);
  data.schrittCount = target;

  await writeFile(newPath, JSON.stringify(data, null, 2), "utf-8");

  return { success: true, uuid, schrittCount: target };
});
