"use client";

import type { UserPreference } from "@shared/recommendation";

const OPTIONS: { id: UserPreference; label: string; hint: string }[] = [
  { id: "safe", label: "Safe", hint: "Stable, lower APY" },
  { id: "balanced", label: "Balanced", hint: "Mix of risk & yield" },
  { id: "high_yield", label: "High Yield", hint: "Max APY, higher risk" },
];

type Props = {
  value: UserPreference;
  onChange: (p: UserPreference) => void;
};

export function UserPreferenceSelector({ value, onChange }: Props) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 className="text-lg font-semibold text-white">Your preference</h2>
      <p className="mt-1 text-sm text-zinc-400">
        How should the AI prioritize opportunities? (UI only for now.)
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`rounded-xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
                active
                  ? "border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-900/20"
                  : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
              }`}
            >
              <span className="block font-semibold text-white">{opt.label}</span>
              <span className="mt-0.5 block text-xs text-zinc-500">{opt.hint}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
