interface ProgressBarProps {
  value: number;
  max: number;
  /** Tailwind background color class for the filled portion. */
  colorClass?: string;
}

export default function ProgressBar({ value, max, colorClass = "bg-brand-500" }: ProgressBarProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-line"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div className={`h-full rounded-full transition-all ${colorClass}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
