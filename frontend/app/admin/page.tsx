"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers, updateUserRole, updateUserManager, getAllExpensesAdmin } from "../lib/api";
import { useRoleGuard } from "../hooks/useRoleGuard";

type UserRow = {
  id: number;
  name: string;
  email: string;
  department: string | null;
  managerId: number | null;
  managerName: string | null;
  roles: string[];
};

type ExpenseRow = {
  id: number;
  employeeName: string;
  category: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  submittedAt: string;
};

const ROLES = ["EMPLOYEE", "MANAGER", "ADMIN"];

export default function AdminPage() {
  const { authorized, checking } = useRoleGuard(["ADMIN"]);
  const router = useRouter();
  const [name, setName] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    if (!authorized) return;
    setName(localStorage.getItem("userName") || "");
    loadUsers();
    loadExpenses();
  }, [authorized]);

  async function loadUsers() {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadExpenses() {
    try {
      const data = await getAllExpensesAdmin();
      setExpenses(data.content || data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleRoleChange(userId: number, role: string) {
    setSavingId(userId);
    setError("");
    try {
      await updateUserRole(userId, role);
      loadUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  async function handleManagerChange(userId: number, managerIdStr: string) {
    setSavingId(userId);
    setError("");
    try {
      const managerId = managerIdStr === "" ? null : Number(managerIdStr);
      await updateUserManager(userId, managerId);
      loadUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  function logout() {
    localStorage.clear();
    router.push("/");
  }

  if (checking) {
    return <main className="min-h-screen flex items-center justify-center text-white/60">Checking access...</main>;
  }
  if (!authorized) {
    return null;
  }
  if (loading) {
    return <main className="min-h-screen flex items-center justify-center text-white/60">Loading...</main>;
  }

  const managers = users.filter((u) => u.roles.includes("MANAGER") || u.roles.includes("ADMIN"));

  return (
    <main className="min-h-screen px-8 md:px-16 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--brass)] mb-1">Admin</p>
            <h1 className="font-display text-3xl font-bold">Welcome, {name}</h1>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-sm border border-white/20 hover:border-white/40 text-sm transition-colors"
          >
            Log out
          </button>
        </div>

        <h2 className="font-display text-xl font-semibold mb-6">All users</h2>
        {error && <p className="text-[var(--stamp)] text-sm mb-4">{error}</p>}

        <div className="bg-[var(--paper)] text-[var(--ink-deep)] rounded-sm shadow-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Manager</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-black/5 last:border-0">
                  <td className="px-6 py-4 font-medium">{u.name}</td>
                  <td className="px-6 py-4 text-black/60">{u.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={u.roles[0] || "EMPLOYEE"}
                      disabled={savingId === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="px-3 py-2 rounded-sm border border-black/15 bg-white text-sm"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={u.managerId ?? ""}
                      disabled={savingId === u.id}
                      onChange={(e) => handleManagerChange(u.id, e.target.value)}
                      className="px-3 py-2 rounded-sm border border-black/15 bg-white text-sm"
                    >
                      <option value="">No manager</option>
                      {managers.filter((m) => m.id !== u.id).map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-display text-xl font-semibold mb-6 mt-12">All expenses</h2>
        <div className="bg-[var(--paper)] text-[var(--ink-deep)] rounded-sm shadow-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left">
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-black/50 text-center">No expenses yet.</td>
                </tr>
              ) : (
                expenses.map((e) => (
                  <tr key={e.id} className="border-b border-black/5 last:border-0">
                    <td className="px-6 py-4 font-medium">{e.employeeName}</td>
                    <td className="px-6 py-4">{e.category}</td>
                    <td className="px-6 py-4 font-mono">{e.currency} {e.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 font-mono text-xs uppercase">{e.status}</td>
                    <td className="px-6 py-4 text-black/60 text-xs">
                      {new Date(e.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}