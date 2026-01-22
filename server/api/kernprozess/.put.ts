// server/api/kernprozess.put.ts
import { readdir, readFile, writeFile } from "fs/promises";
import path from "node:path";
import { CONTENT_ROOT, safeJoin } from "~~/server/utils/traversal";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin" && user.role !== "editor") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const body = await readBody<{
    path: string;
    subPath: string;
    currentNumber: number;
    newNumber: number;
    data: string;
  }>(event);

  const { currentNumber, newNumber } = body;

  if (
    !Number.isInteger(currentNumber) ||
    !Number.isInteger(newNumber) ||
    currentNumber < 1 ||
    newNumber < 1
  ) {
    throw createError({
      statusCode: 406,
      statusMessage: "invalid schrittCount values",
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
      return { file, fullPath, json };
    }),
  );

  items.sort((a, b) => a.json.schrittCount - b.json.schrittCount);

  const n = items.length;

  // Lückenprüfung
  for (let i = 0; i < n; i++) {
    if (items[i]!.json.schrittCount !== i + 1) {
      throw createError({
        statusCode: 500,
        statusMessage: "invalid schrittCount sequence on disk",
      });
    }
  }

  const current = items.find((i) => i.json.schrittCount === currentNumber);

  if (!current) {
    throw createError({
      statusCode: 404,
      statusMessage: `kernprozess ${currentNumber} not found`,
    });
  }

  if (newNumber > n) {
    throw createError({
      statusCode: 409,
      statusMessage: `new schrittCount ${newNumber} would create a gap`,
    });
  }

  // Keine Positionsänderung → nur Inhalt ersetzen
  if (currentNumber === newNumber) {
    const data = JSON.parse(body.data);
    data.schrittCount = currentNumber;

    await writeFile(current.fullPath, JSON.stringify(data, null, 2), "utf-8");

    return { success: true, schrittCount: currentNumber };
  }

  // Entfernen
  const remaining = items.filter((i) => i !== current);

  // Nach oben verschieben (z. B. 4 → 2)
  if (newNumber < currentNumber) {
    for (const item of remaining) {
      if (
        item.json.schrittCount >= newNumber &&
        item.json.schrittCount < currentNumber
      ) {
        item.json.schrittCount += 1;
        await writeFile(
          item.fullPath,
          JSON.stringify(item.json, null, 2),
          "utf-8",
        );
      }
    }
  }

  // Nach unten verschieben (z. B. 2 → 5)
  if (newNumber > currentNumber) {
    for (const item of remaining) {
      if (
        item.json.schrittCount <= newNumber &&
        item.json.schrittCount > currentNumber
      ) {
        item.json.schrittCount -= 1;
        await writeFile(
          item.fullPath,
          JSON.stringify(item.json, null, 2),
          "utf-8",
        );
      }
    }
  }

  const newData = JSON.parse(body.data);
  newData.schrittCount = newNumber;

  await writeFile(current.fullPath, JSON.stringify(newData, null, 2), "utf-8");

  return {
    success: true,
    from: currentNumber,
    to: newNumber,
  };
});
