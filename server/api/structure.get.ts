import { readdir, stat } from "fs/promises";
import { join } from "path";

const basePath = join(process.cwd(), "data"); // Wurzelordner

async function countFiles(dir: string): Promise<number> {
  const entries = await readdir(dir, { withFileTypes: true });
  let count = 0;
  for (const e of entries) {
    if (e.isDirectory()) count += await countFiles(join(dir, e.name));
    else count++;
  }
  return count;
}

async function buildStructure() {
  const entries = await readdir(basePath, { withFileTypes: true });
  const result: Record<string, any> = {};

  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const name = e.name;
    if (/^\d{2}-/.test(name)) continue; // Unterordner werden später behandelt

    const id = name;
    // const title = mapping[id] || id;
    const title = id;

    // passende Unterordner finden (z. B. 01-1, 01-2 …)
    const subdirs = (await readdir(basePath, { withFileTypes: true })).filter(
      (x) => x.isDirectory() && x.name.startsWith(`${id}-`),
    );

    const children = [];
    for (const sub of subdirs) {
      const subId = sub.name;
      // const subTitle = mapping[subId] || subId;
      const subTitle = subId;

      const kernPath = join(basePath, subId, "kernprozesse");
      let kernCount = 0;
      try {
        const s = await stat(kernPath);
        if (s.isDirectory()) {
          const files = await readdir(kernPath);
          kernCount = files.length;
        }
      } catch {
        // kein kernprozesse-Ordner
      }

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
  const structure = await buildStructure();

  console.log(structure);

  return structure;
});
