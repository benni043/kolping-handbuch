import { readFile } from "fs/promises";
import { join } from "path";
import { transformToNestedStructure } from "../utils/types";

const basePath = join(process.cwd(), "data");

export default defineEventHandler(async () => {
  const json = JSON.parse(
    await readFile(`${basePath}/metadata/mappings.json`, "utf-8"),
  );

  return transformToNestedStructure(json);
});
