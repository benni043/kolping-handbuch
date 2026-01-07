import { mkdir, writeFile, readdir, readFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { CONTENT_ROOT, safeJoin } from "~~/server/utils/traversal";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin" && user.role !== "editor")
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });

  const body = await readBody<{
    menuUuid: string;
    menuId: string;
    subMenuName: string;
  }>(event);

  const basePath = safeJoin(CONTENT_ROOT, body.menuUuid);

  const entries = await readdir(basePath, { withFileTypes: true });
  const folders = entries.filter((entry) => entry.isDirectory());

  const subMenuId = `${body.menuId}-${folders.length + 1}`;

  const uuid = uuidv4();

  const dirPathOuter = safeJoin(CONTENT_ROOT, `${body.menuUuid}/${uuid}`);

  const dirPath = join(dirPathOuter, "kernprozesse");

  await mkdir(dirPath, { recursive: true });

  await writeFile(join(dirPathOuter, "arbeitshilfen.md"), "", "utf-8");
  await writeFile(join(dirPathOuter, "best-practise.md"), "", "utf-8");
  await writeFile(join(dirPathOuter, "checkliste.md"), "", "utf-8");
  await writeFile(join(dirPathOuter, "hinfuehrung.md"), "", "utf-8");
  await writeFile(join(dirPathOuter, "inhalt-und-zweck.md"), "", "utf-8");

  const metadataPath = join(process.cwd(), "data/metadata/mappings.json");

  const data = JSON.parse(await readFile(metadataPath, "utf-8"));
  data[uuid] = {
    id: subMenuId,
    name: body.subMenuName,
  };

  await writeFile(metadataPath, JSON.stringify(data, null, 2), "utf-8");
});
