export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-16"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500"
        aria-hidden
      />
      <span className="text-sm text-zinc-400">{label}</span>
    </div>
  );
}
