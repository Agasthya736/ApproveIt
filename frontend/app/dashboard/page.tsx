"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategories, submitExpense, getMyExpenses } from "../lib/api";

type Category = { id: number; name: string };
type Expense = {
  id: number;
  employeeName: string;
  category: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  submittedAt: string;
};

const statusColor: Record<string, string> = {
  PENDING: "text-[var(--brass)]",
  APPROVED: "text-[var(--sage)]",
  REJECTED: "text-[var(--stamp)]",
  CANCELLED: "text-white/40",
};

export default function DashboardPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    categoryId: "",
    amount: "",
    currency: "INR",
    description: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }
    setName(localStorage.getItem("userName") || "");
    loadData();
  }, [router]);

  async function loadData() {
    try {
      const [cats, exps] = await Promise.all([getCategories(), getMyExpenses()]);
      setCategories(cats);
      setExpenses(exps.content || exps);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await submitExpense({
        categoryId: Number(form.categoryId),
        amount: Number(form.amount),
        currency: form.currency,
        description: form.description,
      });
      setSuccess("Claim submitted.");
      setForm({ categoryId: "", amount: "", currency: "INR", description: "" });
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function logout() {
    localStorage.clear();
    router.push("/");
  }
  
  if (loading) {
    return <main className="min-h-screen flex items-center justify-center text-white/60">Loading...</main>;
  }

  return (
    <main className="min-h-screen px-8 md:px-16 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--brass)] mb-1">Employee</p>
            <h1 className="font-display text-3xl font-bold">Welcome, {name}</h1>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-sm border border-white/20 hover:border-white/40 text-sm transition-colors"
          >
            Log out
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Submit form */}
          <div className="bg-[var(--paper)] text-[var(--ink-deep)] rounded-sm shadow-2xl p-8 h-fit">
            <h2 className="font-display text-xl font-semibold mb-6">New claim</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Category</label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full px-4 py-3 rounded-sm border border-black/15 bg-white focus:outline-none focus:border-[var(--stamp)]"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full px-4 py-3 rounded-sm border border-black/15 bg-white focus:outline-none focus:border-[var(--stamp)]"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-sm border border-black/15 bg-white focus:outline-none focus:border-[var(--stamp)]"
                  rows={3}
                />
              </div>

              {error && <p className="text-[var(--stamp)] text-sm">{error}</p>}
              {success && <p className="text-[var(--sage)] text-sm">{success}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-sm bg-[var(--stamp)] text-white font-medium hover:brightness-110 transition-all disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit claim"}
              </button>
            </form>
          </div>

          {/* Expense history */}
          <div>
            <h2 className="font-display text-xl font-semibold mb-6">Your claims</h2>
            {expenses.length === 0 ? (
              <p className="text-white/50 text-sm">No claims yet.</p>
            ) : (
              <div className="space-y-0">
                {expenses.map((exp) => (
                  <div key={exp.id} className="ledger-line border-white/10 py-4 flex justify-between items-start">
                    <div>
                      <p className="font-medium">{exp.category}</p>
                      <p className="text-white/50 text-sm">{exp.description || "No description"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono">{exp.currency} {exp.amount.toFixed(2)}</p>
                      <p className={`text-xs font-mono uppercase ${statusColor[exp.status]}`}>{exp.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}