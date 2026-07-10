const API_BASE = "http://localhost:8080";

export async function registerUser(data: { name: string; email: string; password: string }) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Registration failed");
  }
  return res.json();
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Login failed");
  }
  return res.json();
}
function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/api/categories`);
  if (!res.ok) throw new Error("Failed to load categories");
  return res.json();
}

export async function submitExpense(data: {
  categoryId: number;
  amount: number;
  currency: string;
  description: string;
}) {
  const res = await fetch(`${API_BASE}/api/expenses`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to submit expense");
  }
  return res.json();
}

export async function getMyExpenses() {
  const res = await fetch(`${API_BASE}/api/expenses/me?size=50`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load expenses");
  return res.json();
}