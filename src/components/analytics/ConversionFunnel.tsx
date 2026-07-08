import { Card } from "@/components/ui/Card";
import type { FunnelStage } from "@/types/data";

export function ConversionFunnel({ funnel }: { funnel: FunnelStage[] }) {
  const maxCount = funnel[0]?.count ?? 1;

  return (
    <Card className="flex flex-col gap-4 p-5">
      <h2 className="text-sm font-semibold text-foreground">Conversion funnel</h2>
      <ul className="flex flex-col gap-3">
        {funnel.map((stage, i) => {
          const prev = funnel[i - 1];
          const widthPct = Math.max(6, (stage.count / maxCount) * 100);
          const overallPct = (stage.count / maxCount) * 100;
          const stepPct = prev ? (stage.count / prev.count) * 100 : 100;

          return (
            <li key={stage.id} className="flex flex-col gap-1.5">
              <div className="flex flex-col gap-0.5 text-sm sm:flex-row sm:items-baseline sm:justify-between">
                <span className="font-medium text-foreground">{stage.label}</span>
                <span className="text-muted-foreground">
                  {stage.count.toLocaleString("en-US")}
                  {prev && (
                    <span className="ml-2 text-xs">
                      ({stepPct.toFixed(1)}% of {prev.label.toLowerCase()})
                    </span>
                  )}
                </span>
              </div>
              <div
                className="h-8 w-full overflow-hidden rounded-md bg-muted"
                role="img"
                aria-label={`${stage.label}: ${stage.count.toLocaleString("en-US")}, ${overallPct.toFixed(1)}% of visitors`}
              >
                <div
                  className="h-full rounded-md bg-accent transition-[width] duration-500"
                  style={{ width: `${widthPct}%`, opacity: 1 - i * 0.15 }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
