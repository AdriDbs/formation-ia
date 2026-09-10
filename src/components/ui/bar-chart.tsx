export function BarChart({
  data,
}: {
  data: { label: string; percent: number }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-40 shrink-0 truncate text-xs font-semibold uppercase tracking-wide text-muted">
            {d.label}
          </span>
          <div className="h-3 flex-1 bg-surface-muted">
            <div
              className="h-full bg-accent transition-[width]"
              style={{ width: `${Math.min(100, Math.max(0, d.percent))}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-xs font-bold">{d.percent}%</span>
        </div>
      ))}
    </div>
  );
}
