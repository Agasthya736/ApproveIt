"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers, updateUserRole, updateUserManager } from "../lib/api";

type UserRow = {
  id: number;
  name: string;
  email: string;
  department: string | null;
  managerId: number | null;
  managerName: string | null;
  roles: string[];
};

const ROLES = ["EMPLOYEE", "MANAGER", "ADMIN"];

export default function AdminPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }
    setName(localStorage.getItem("userName") || "");
    loadUsers();
  }, [router]);

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
      </div>
    </main>
  );
}