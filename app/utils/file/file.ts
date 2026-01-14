export type Item = {
  name: string;
  type: "dir" | "file";
  size: number;
};

export async function fetchData(link: string) {
  try {
    await $fetch(`/api/files/exists?path=${encodeURIComponent(link)}`);

    window.location.href = `/api/files?path=${encodeURIComponent(link)}`;
    return true;
  } catch {
    return false;
  }
}
