import { readdir, readFile } from "fs/promises";
import { join } from "path";

const basePath = join(process.cwd(), "data");

async function buildStructure() {
  const entries = await readdir(`${basePath}/content`, { withFileTypes: true });
  const result = [];

  const json = JSON.parse(
    await readFile(`${basePath}/metadata/mappings.json`, "utf-8"),
  );

  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const id = e.name;
    const title = json[id] || id;

    const subDir = (
      await readdir(`${basePath}/content/${id}`, { withFileTypes: true })
    ).filter((x) => x.isDirectory() && x.name.startsWith(`${id}-`));

    const children = [];
    for (const sub of subDir) {
      if (!e.isDirectory()) continue;

      const subId = sub.name;
      const subTitle = json[subId] || subId;

      let kernCount = 0;
      const files = await readdir(
        `${basePath}/content/${id}/${subId}/kernprozesse`,
      );
      kernCount = files.length;

      children.push({
        id: subId,
        title: subTitle,
        kernprozessCount: kernCount,
      });
    }

    result.push({
      id,
      title,
      children,
    });
  }

  return result;
}

export default defineEventHandler(async () => {
  return await buildStructure();
});
