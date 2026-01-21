import { writeFile, readFile } from "fs/promises";
import { join } from "path";
import { MAPPINGS_PATH } from "~~/server/utils/types";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin" && user.role !== "editor") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const body = await readBody<{
    uuid: string;
    name: string;
  }>(event);

  const metadataPath = join(process.cwd(), MAPPINGS_PATH);

  const raw = await readFile(metadataPath, "utf-8");
  const data = JSON.parse(raw);

  if (!data[body.uuid]) {
    throw createError({
      statusCode: 404,
      statusMessage: "Mapping not found",
    });
  }

  data[body.uuid].name = body.name;

  await writeFile(metadataPath, JSON.stringify(data, null, 2), "utf-8");
});
