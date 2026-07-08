"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Sparkline } from "@/components/dashboard/Sparkline";
import type { TrafficSource } from "@/types/data";

type SortKey = "source" | "visitors" | "conversionPct";
type SortDirection = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "source", label: "Source" },
  { key: "visitors", label: "Visitors" },
  { key: "conversionPct", label: "Conversion" },
];

export function TrafficSourcesTable({ sources }: { sources: TrafficSource[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("visitors");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sorted = useMemo(() => {
    const dir = sortDirection === "asc" ? 1 : -1;
    return [...sources].sort((a, b) => {
      if (sortKey === "source") return a.source.localeCompare(b.source) * dir;
      return (a[sortKey] - b[sortKey]) * dir;
    });
  }, [sources, sortKey, sortDirection]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  }

  return (
    <Card className="flex flex-col gap-4 p-5">
      <h2 className="text-sm font-semibold text-foreground">Traffic sources</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">
            Traffic sources with visitor counts, conversion rate, and trend
          </caption>
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              {COLUMNS.map((col) => {
                const isActive = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={isActive ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                    className="whitespace-nowrap pb-2 pr-6 font-medium"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {col.label}
                      {isActive ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3" aria-hidden="true" />
                        ) : (
                          <ArrowDown className="h-3 w-3" aria-hidden="true" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-40" aria-hidden="true" />
                      )}
                    </button>
                  </th>
                );
              })}
              <th scope="col" className="pb-2 font-medium">
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const trendPositive =
                row.history.length > 1 && row.history[row.history.length - 1].value >= row.history[0].value;
              return (
                <tr key={row.source} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 pr-6 text-foreground">{row.source}</td>
                  <td className="py-2.5 pr-6 tabular-nums text-foreground">
                    {row.visitors.toLocaleString("en-US")}
                  </td>
                  <td className="py-2.5 pr-6 tabular-nums text-foreground">{row.conversionPct.toFixed(1)}%</td>
                  <td className="py-2.5">
                    <div className="h-8 w-20" aria-hidden="true">
                      <Sparkline data={row.history} positive={trendPositive} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
