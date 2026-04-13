import Link from "next/link";
import { DemoSimulation } from "@/components/demo/DemoSimulation";

export default function HomePage() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-30%,rgba(16,185,129,0.18),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_0%,rgba(6,182,212,0.12),transparent)]"
      />
      <section className="relative mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:py-32">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/90">
          LI.FI Earn · AI × Yield
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          AutoYield AI Optimizer
        </h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-400 sm:text-xl">
          Smart DeFi yield optimization powered by AI
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex min-w-[200px] items-center justify-center rounded-xl bg-linear-to-r from-emerald-500 to-cyan-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-emerald-900/40 transition hover:from-emerald-400 hover:to-cyan-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            Start earning
          </Link>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-2xl px-4 pb-24 sm:px-6">
        <DemoSimulation />
      </section>
    </div>
  );
}
