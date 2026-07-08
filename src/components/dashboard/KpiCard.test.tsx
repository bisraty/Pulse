import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KpiCard } from "./KpiCard";
import type { KpiState } from "@/types/data";

function makeKpi(overrides: Partial<KpiState>): KpiState {
  return {
    id: "mrr",
    label: "Revenue (MRR)",
    unit: "currency",
    value: 42500,
    changePct: 0,
    history: Array.from({ length: 10 }, (_, i) => ({ time: i, value: 42000 + i * 10 })),
    ...overrides,
  };
}

describe("KpiCard", () => {
  it("renders the label and formatted value", () => {
    render(<KpiCard kpi={makeKpi({ value: 42500, unit: "currency" })} />);

    expect(screen.getByText("Revenue (MRR)")).toBeInTheDocument();
    expect(screen.getByText("$42,500")).toBeInTheDocument();
  });

  it("shows an upward, positive trend when change is positive", () => {
    render(<KpiCard kpi={makeKpi({ changePct: 4.2 })} />);

    const trend = screen.getByText(/\+4\.2% vs yesterday/);
    expect(trend).toBeInTheDocument();
    expect(trend.parentElement).toHaveClass("text-success");
  });

  it("shows a downward, negative trend when change is negative", () => {
    render(<KpiCard kpi={makeKpi({ changePct: -3.1 })} />);

    const trend = screen.getByText(/-3\.1% vs yesterday/);
    expect(trend).toBeInTheDocument();
    expect(trend.parentElement).toHaveClass("text-danger");
  });

  it("inverts good/bad color semantics for error rate, where a rise is bad", () => {
    render(<KpiCard kpi={makeKpi({ id: "errorRate", unit: "percent", changePct: 2.5 })} />);

    // Percent-unit KPIs show a percentage-point delta ("pp"), not a relative "%",
    // since relative change is misleading near zero (e.g. 0.3% -> 2.7% isn't "+800%").
    const trend = screen.getByText(/\+2\.5pp vs yesterday/);
    expect(trend.parentElement).toHaveClass("text-danger");
  });
});
