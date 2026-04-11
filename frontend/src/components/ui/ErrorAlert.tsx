export function ErrorAlert({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="rounded-2xl border border-rose-500/40 bg-rose-950/40 px-4 py-4 text-rose-100"
      role="alert"
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-rose-200/90">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg border border-rose-400/50 bg-rose-900/30 px-4 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-900/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
