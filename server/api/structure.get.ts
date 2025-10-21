import { readdir } from "fs/promises";
import { join } from "path";

const basePath = join(process.cwd(), "data");

async function buildStructure() {
  const entries = await readdir(`${basePath}/content`, { withFileTypes: true });
  const result: Record<string, any> = {};

  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const id = e.name;

    // const title = mapping[id] || id;
    const title = id;

    const subdirs = (
      await readdir(`${basePath}/content/${id}`, { withFileTypes: true })
    ).filter((x) => x.isDirectory() && x.name.startsWith(`${id}-`));

    const children = [];
    for (const sub of subdirs) {
      if (!e.isDirectory()) continue;

      const subId = sub.name;

      // const subTitle = mapping[subId] || subId;
      const subTitle = subId;

      let kernCount = 0;
      const files = await readdir(
        `${basePath}/content/${id}/${subId}/kernprozesse`,
      );
      kernCount = files.length;

      children.push({
        id: subId.replace("-", "."),
        title: subTitle,
        kernprozessCount: kernCount,
      });
    }

    result[id] = {
      id,
      title,
      children,
    };
  }

  return result;
}

export default defineEventHandler(async () => {
  return await buildStructure();
});
