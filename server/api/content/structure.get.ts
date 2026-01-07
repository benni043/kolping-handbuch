import { readFile } from "fs/promises";
import { join } from "path";

export default defineEventHandler(async () => {
  const basePath = join(process.cwd(), "data");

  const json = JSON.parse(
    await readFile(`${basePath}/metadata/mappings.json`, "utf-8"),
  );

  return transformToNestedStructure(json);
});
