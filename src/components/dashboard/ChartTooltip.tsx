import type { TooltipContentProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

export function ChartTooltip({
  active,
  payload,
  label,
}: Partial<TooltipContentProps<ValueType, NameType>>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg">
      {label !== undefined && <p className="mb-1 font-medium text-muted-foreground">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className="font-semibold text-foreground">
          {typeof entry.value === "number" ? entry.value.toLocaleString("en-US") : entry.value}
        </p>
      ))}
    </div>
  );
}
