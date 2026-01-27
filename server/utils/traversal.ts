import { resolve } from "path";

export const CONTENT_ROOT = resolve(process.cwd(), "data/content");
export const FILE_ROOT = resolve(process.cwd(), "data/files");
export const METADATA_ROOT = resolve(process.cwd(), "data/metadata");
export const PUBLIC_ROOT = resolve(process.cwd(), "data");

export function safeJoin(root: string, unsafePath: string) {
  const targetPath = resolve(root, unsafePath);

  if (!targetPath.startsWith(root + "/") && targetPath !== root) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid path",
    });
  }

  return targetPath;
}
