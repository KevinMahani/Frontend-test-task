const BASE_URL = "https://dummyjson.com";

export async function fetchUsers({ q = "", limit = 10, skip = 0 }) {
  const url = q
    ? `${BASE_URL}/users/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
    : `${BASE_URL}/users?limit=${limit}&skip=${skip}`;

  const res = await fetch(url, { method: "GET" });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch users");
  }

  // DummyJSON shape: { users: [], total, skip, limit }
  return data;
}

export async function fetchUserById(id) {
  const res = await fetch(`https://dummyjson.com/users/${id}`, {
    method: "GET",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch user");
  }

  return data;
}