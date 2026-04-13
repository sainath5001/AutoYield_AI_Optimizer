import Link from "next/link";

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

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Built for demos, designed like a real app
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            A modern DeFi yield dashboard — end to end
          </h2>
          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            Discover Earn vaults, visualize APY horizons, get an AI suggestion,
            and execute deposits via Composer — all in one flow.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-lg ring-1 ring-zinc-800/80">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400/90">
              Earn discovery
            </p>
            <p className="mt-2 text-base font-semibold text-white">
              Real vaults, real APY
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Vault lists and analytics come from the LI.FI Earn Data API.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-lg ring-1 ring-zinc-800/80">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-400/90">
              APY trend
            </p>
            <p className="mt-2 text-base font-semibold text-white">
              Today / 7D / 30D
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Horizon chart based on LI.FI rolling averages (apy1d/7d/30d) vs
              current.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-lg ring-1 ring-zinc-800/80">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-400/90">
              AI insight
            </p>
            <p className="mt-2 text-base font-semibold text-white">
              Explainable recommendation
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              The assistant picks a vault based on your preference and explains
              why.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-lg ring-1 ring-zinc-800/80">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-400/90">
              Demo mode
            </p>
            <p className="mt-2 text-base font-semibold text-white">
              One-click storyline
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Run a guided simulation on the dashboard — no funds required.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Docs",
              href: "https://docs.li.fi",
              desc: "Earn, Composer, API reference, recipes.",
            },
            {
              title: "Earn overview",
              href: "https://docs.li.fi/earn/overview",
              desc: "Vault schema, analytics, portfolio.",
            },
            {
              title: "Composer overview",
              href: "https://docs.li.fi/composer/overview",
              desc: "One-click deposits and zaps.",
            },
            {
              title: "Support",
              href: "https://support.li.fi",
              desc: "Help center and troubleshooting.",
            },
          ].map((l) => (
            <a
              key={l.title}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-lg ring-1 ring-zinc-800/80 transition hover:border-emerald-500/30 hover:bg-zinc-900/60"
            >
              <p className="text-base font-semibold text-white">{l.title}</p>
              <p className="mt-2 text-sm text-zinc-400">{l.desc}</p>
              <p className="mt-3 text-xs font-semibold text-emerald-400/90 group-hover:text-emerald-300">
                Open ↗
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
