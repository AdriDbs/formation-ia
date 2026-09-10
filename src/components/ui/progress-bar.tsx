export function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="w-full">
      <div className="h-2 w-full border border-border bg-surface-muted">
        <div
          className="h-full bg-accent transition-[width]"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
