export async function fetchData(link: string) {
  const res = await fetch(`/api/files?path=${link}`);

  if (res.status !== 200) return false;

  const blob = await res.blob();
  const fileName = link.split("/").pop();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName!;
  a.click();
  URL.revokeObjectURL(url);

  return true;
}
