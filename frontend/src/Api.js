const BASE = "http://localhost:5000/api";

export const api = async (path, method = "GET", body = null, token = null) => {
  const headers = { "Content-Type": "application/json" };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {  // ✅ FIXED (no space)
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Request failed");

  return data;
};