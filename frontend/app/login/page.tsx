"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(form);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("userName", res.name);
      localStorage.setItem("userRoles", JSON.stringify(res.roles));

      if (res.roles.includes("ADMIN")) {
        router.push("/admin");
      } else if (res.roles.includes("MANAGER")) {
        router.push("/manager");
      } else {
        router.push("/dashboard");
      }
    }catch (err: any){
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-[var(--paper)] text-[var(--ink-deep)] rounded-sm shadow-2xl w-full max-w-md p-10">
        <p className="font-mono text-xs uppercase tracking-widest text-black/50 mb-2">Welcome back</p>
        <h1 className="font-display text-3xl font-bold mb-8">Log in</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-sm border border-black/15 bg-white focus:outline-none focus:border-[var(--stamp)]"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 rounded-sm border border-black/15 bg-white focus:outline-none focus:border-[var(--stamp)]"
            />
          </div>

          {error && <p className="text-[var(--stamp)] text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-sm bg-[var(--stamp)] text-white font-medium hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-sm text-black/60 mt-6 text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-[var(--stamp)] font-medium">Sign up</a>
        </p>
      </div>
    </main>
  );
}