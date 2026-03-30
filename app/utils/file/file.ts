export type Item = {
  name: string;
  type: "dir" | "file";
  size: number;
};

export async function fetchData(link: string) {
  try {
    await $fetch(`/api/files/exists?path=${encodeURIComponent(link)}`);

    // window.open(`/api/files?path=${encodeURIComponent(link)}`, "_blank");

    const a = document.createElement("a");
    a.href = `/api/files?path=${encodeURIComponent(link)}`;
    a.target = "_blank";
    a.click();

    return true;
  } catch {
    return false;
  }
}
