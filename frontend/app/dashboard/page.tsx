"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }
    setName(localStorage.getItem("userName") || "");
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--brass)] mb-2">Signed in</p>
        <h1 className="font-display text-3xl font-bold">Welcome, {name}</h1>
        <p className="text-white/60 mt-2">Real dashboard coming next.</p>
      </div>
    </main>
  );
}