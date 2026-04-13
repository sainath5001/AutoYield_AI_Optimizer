type Props = {
  className?: string;
};

export function Skeleton({ className = "" }: Props) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-zinc-800/60 ${className}`}
      aria-hidden
    />
  );
}

