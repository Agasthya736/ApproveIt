"use client";
import { useInView } from "./hooks/useInView";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={inView ? "reveal" : "opacity-0"}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between px-8 md:px-16 py-6 ledger-line border-white/10">
        <span className="font-display text-xl font-semibold tracking-tight">ApproveIt</span>
        <div className="flex items-center gap-8 text-sm">
          <a href="#how-it-works" className="hidden md:inline hover:text-[var(--brass)] transition-colors">How it works</a>
          <a href="#roles" className="hidden md:inline hover:text-[var(--brass)] transition-colors">For your team</a>
          <a href="/login" className="hover:text-[var(--brass)] transition-colors">Log in</a>
          <a
            href="/register"
            className="px-4 py-2 rounded-sm bg-[var(--stamp)] text-white text-sm font-medium hover:brightness-110 transition-all"
          >
            Get started
          </a>
        </div>
      </nav>

      <section className="px-8 md:px-16 pt-16 md:pt-24 pb-24 grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        <div>
          <p className="font-mono text-xs tracking-widest text-[var(--brass)] uppercase mb-4">
            Expense approvals, done right
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-black leading-[1.05] mb-6">
            Every expense.
            <br />
            Approved with confidence.
          </h1>
          <p className="text-white/70 text-lg max-w-md mb-8">
            Claims route to the right manager automatically. No expense gets approved
            twice. Every decision is on the record, permanently.
          </p>
          <div className="flex gap-4">
            <a
              href="/register"
              className="px-6 py-3 rounded-sm bg-[var(--stamp)] text-white font-medium hover:brightness-110 transition-all"
            >
              Start free
            </a>
            <a
              href="#how-it-works"
              className="px-6 py-3 rounded-sm border border-white/20 hover:border-white/40 transition-colors"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="bg-[var(--paper)] text-[var(--ink-deep)] rounded-sm shadow-2xl w-full max-w-sm p-8 -rotate-2">
            <p className="font-mono text-xs uppercase tracking-widest text-black/50 mb-1">Expense Claim #4471</p>
            <div className="ledger-line pb-3 mb-3 border-black/10">
              <p className="font-display text-lg font-semibold">Client dinner — Travel</p>
              <p className="font-mono text-2xl mt-1">₹1,500.00</p>
            </div>
            <div className="text-sm text-black/60 space-y-1 font-mono">
              <p>Submitted — Agasthya S.</p>
              <p>Routed to — R. Mehta (Manager)</p>
            </div>
          </div>

          <div className="stamp-animate absolute -right-2 md:right-8 top-1/2 -translate-y-1/2">
            <div className="w-32 h-32 rounded-full border-4 border-[var(--stamp)] flex items-center justify-center rotate-[-9deg]"
                 style={{ boxShadow: "0 0 0 3px rgba(193,68,58,0.15)" }}>
              <span className="font-display font-black text-[var(--stamp)] text-sm tracking-widest text-center leading-tight">
                APPROVED
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 md:px-16 py-10 border-y border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Claims submitted", value: "12,480" },
            { label: "Approved this month", value: "3,214" },
            { label: "Avg. approval time", value: "6.2 hrs" },
          ].map((stat) => (
            <div key={stat.label} className="ledger-line border-white/10 pb-4">
              <p className="font-mono text-3xl text-[var(--brass)]">{stat.value}</p>
              <p className="text-white/60 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="px-8 md:px-16 py-24 max-w-7xl mx-auto">
        <Reveal>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-16">How a claim moves</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { n: "01", title: "Submit", body: "An employee files a claim with an amount, category, and receipt. It's locked to editing the moment it's sent." },
            { n: "02", title: "Review", body: "It routes straight to their actual manager — no manual assignment, no wrong inbox." },
            { n: "03", title: "Approve", body: "One decision, permanently. A manager can't approve their own claim, and no claim gets approved twice." },
          ].map((step, i) => (
            <Reveal key={step.n} delay={i * 120}>
              <p className="font-mono text-[var(--brass)] text-sm mb-3">{step.n}</p>
              <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{step.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="roles" className="px-8 md:px-16 py-24 bg-black/20 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-16">Built for how your team actually works</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { role: "Employee", body: "Submit a claim in seconds. Track every status change without asking anyone." },
              { role: "Manager", body: "See your team's pending claims in one place. Approve, reject, or leave a note." },
              { role: "Admin", body: "Full visibility across the company, with a permanent record of every decision made." },
            ].map((r, i) => (
              <Reveal key={r.role} delay={i * 120}>
                <div className="p-8 rounded-sm border border-white/10 hover:border-[var(--brass)]/50 transition-colors h-full">
                  <p className="font-mono text-xs uppercase tracking-widest text-[var(--sage)] mb-3">{r.role}</p>
                  <p className="text-white/70 text-sm leading-relaxed">{r.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 md:px-16 py-24 text-center">
        <Reveal>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Stop chasing approvals in email.</h2>
          <a
            href="/register"
            className="inline-block px-8 py-4 rounded-sm bg-[var(--stamp)] text-white font-medium hover:brightness-110 transition-all"
          >
            Get started free
          </a>
        </Reveal>
      </section>

      <footer className="px-8 md:px-16 py-8 border-t border-white/10 text-white/40 text-sm flex justify-between">
        <span>ApproveIt</span>
        <span className="font-mono">© 2026</span>
      </footer>
    </main>
  );
}
