const BASE_URL = "https://dummyjson.com";

export async function fetchProducts({ q = "", limit = 10, skip = 0 }) {
  const url = q
    ? `${BASE_URL}/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
    : `${BASE_URL}/products?limit=${limit}&skip=${skip}`;

  const res = await fetch(url, { method: "GET" });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch products");
  }

  // shape: { products: [], total, skip, limit }
  return data;
}

export async function fetchProductById(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`, { method: "GET" });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch product");
  }

  return data;
}