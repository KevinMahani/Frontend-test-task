export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const endpoint = searchParams.get("endpoint"); 
  if (!endpoint) {
    return Response.json({ message: "Missing endpoint" }, { status: 400 });
  }

  const params = new URLSearchParams(searchParams);
  params.delete("endpoint");

  const key = process.env.RAWG_API_KEY;
  if (!key) {
    return Response.json({ message: "RAWG_API_KEY is not set" }, { status: 500 });
  }

  params.set("key", key);

  const url = `https://api.rawg.io/api/${endpoint}?${params.toString()}`;

  const res = await fetch(url, { method: "GET" });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return Response.json(
      { message: data?.detail || data?.message || "RAWG request failed" },
      { status: res.status }
    );
  }

  return Response.json(data, { status: 200 });
}