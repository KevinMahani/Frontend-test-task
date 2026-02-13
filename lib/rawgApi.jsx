export async function rawgGet(endpoint, query = {}) {
  const params = new URLSearchParams({ endpoint });

  Object.entries(query).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    params.set(k, String(v));
  });

  const res = await fetch(`/api/rawg?${params.toString()}`);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "RAWG error");
  }

  return data;
}