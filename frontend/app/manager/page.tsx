"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPendingApprovals, approveExpense, rejectExpense } from "../lib/api";

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

export default function ManagerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

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
      const res = await getPendingApprovals();
      setExpenses(res.content || res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: number) {
    setActionLoading(true);
    setError("");
    try {
      await approveExpense(id);
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject(id: number) {
    if (!comment.trim()) {
      setError("A comment is required to reject a claim.");
      return;
    }
    setActionLoading(true);
    setError("");
    try {
      await rejectExpense(id, comment);
      setRejectingId(null);
      setComment("");
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--brass)] mb-1">Manager</p>
            <h1 className="font-display text-3xl font-bold">Welcome, {name}</h1>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-sm border border-white/20 hover:border-white/40 text-sm transition-colors"
          >
            Log out
          </button>
        </div>

        <h2 className="font-display text-xl font-semibold mb-6">Pending approvals</h2>

        {error && <p className="text-[var(--stamp)] text-sm mb-4">{error}</p>}

        {expenses.length === 0 ? (
          <p className="text-white/50 text-sm">Nothing waiting on you right now.</p>
        ) : (
          <div className="space-y-4">
            {expenses.map((exp) => (
              <div key={exp.id} className="bg-[var(--paper)] text-[var(--ink-deep)] rounded-sm shadow-xl p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-display text-lg font-semibold">{exp.category}</p>
                    <p className="text-sm text-black/60">{exp.employeeName}</p>
                  </div>
                  <p className="font-mono text-xl">{exp.currency} {exp.amount.toFixed(2)}</p>
                </div>
                {exp.description && <p className="text-sm text-black/70 mb-4">{exp.description}</p>}

                {rejectingId === exp.id ? (
                  <div className="space-y-2">
                    <textarea
                      placeholder="Reason for rejection..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-3 py-2 rounded-sm border border-black/15 text-sm"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReject(exp.id)}
                        disabled={actionLoading}
                        className="px-4 py-2 rounded-sm bg-[var(--stamp)] text-white text-sm font-medium disabled:opacity-50"
                      >
                        Confirm reject
                      </button>
                      <button
                        onClick={() => { setRejectingId(null); setComment(""); }}
                        className="px-4 py-2 rounded-sm border border-black/20 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(exp.id)}
                      disabled={actionLoading}
                      className="px-4 py-2 rounded-sm bg-[var(--sage)] text-white text-sm font-medium hover:brightness-110 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setRejectingId(exp.id)}
                      className="px-4 py-2 rounded-sm border border-black/20 text-sm hover:border-black/40"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}