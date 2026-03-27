export type Item = {
  name: string;
  type: "dir" | "file";
  size: number;
};

export async function fetchData(link: string) {
  try {
    await $fetch(`/api/files/exists?path=${encodeURIComponent(link)}`);

    window.open(`/api/files?path=${encodeURIComponent(link)}`, "_blank");
    return true;
  } catch {
    return false;
  }
}
