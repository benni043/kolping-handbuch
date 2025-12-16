export async function fetchData(link: string) {
  const check = await fetch(
    `/api/files/exists?path=${encodeURIComponent(link)}`,
  );

  if (!check.ok) return false;

  window.location.href = `/api/files?path=${encodeURIComponent(link)}`;
  return true;
}
