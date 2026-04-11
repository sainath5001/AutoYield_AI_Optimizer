import type { Vault } from "@shared/vault";

const styles: Record<Vault["riskLevel"], string> = {
  low: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  medium: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  high: "border-rose-500/40 bg-rose-500/10 text-rose-400",
};

const labels: Record<Vault["riskLevel"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function RiskBadge({ level }: { level: Vault["riskLevel"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[level]}`}
    >
      {labels[level]} risk
    </span>
  );
}
