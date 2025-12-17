export type Item = {
  name: string;
  type: "dir" | "file";
  size: number;
};

export async function fetchData(link: string) {
  try {
    const check = await fetch(
      `/api/files/exists?path=${encodeURIComponent(link)}`,
    );

    if (!check.ok) return false;

    window.location.href = `/api/files?path=${encodeURIComponent(link)}`;
    return true;
  } catch (e: unknown) {
    return false;
  }
}
