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
export async function getPendingApprovals() {
  const res = await fetch(`${API_BASE}/api/approvals/pending?size=50`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load pending approvals");
  return res.json();
}

export async function approveExpense(expenseId: number) {
  const res = await fetch(`${API_BASE}/api/approvals/${expenseId}/approve`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to approve");
  }
  return res.json();
}

export async function rejectExpense(expenseId: number, comment: string) {
  const res = await fetch(`${API_BASE}/api/approvals/${expenseId}/reject`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ comment }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to reject");
  }
  return res.json();
}
export async function getAllUsers() {
  const res = await fetch(`${API_BASE}/api/users`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load users");
  return res.json();
}

export async function updateUserRole(userId: number, role: string) {
  const res = await fetch(`${API_BASE}/api/users/${userId}/role`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ role }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update role");
  }
  return res.json();
}

export async function updateUserManager(userId: number, managerId: number | null) {
  const res = await fetch(`${API_BASE}/api/users/${userId}/manager`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ managerId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update manager");
  }
  return res.json();
}