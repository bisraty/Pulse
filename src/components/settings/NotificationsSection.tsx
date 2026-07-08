"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";

const NOTIFICATION_OPTIONS = [
  {
    id: "email-alerts",
    label: "Email alerts",
    description: "Get emailed when a payment fails or a plan changes.",
    defaultChecked: true,
  },
  {
    id: "push-notifications",
    label: "Push notifications",
    description: "Real-time alerts on your desktop and mobile.",
    defaultChecked: false,
  },
  {
    id: "weekly-digest",
    label: "Weekly digest",
    description: "A Monday morning summary of the past week's activity.",
    defaultChecked: true,
  },
  {
    id: "product-updates",
    label: "Product updates",
    description: "Occasional emails about new Pulse features.",
    defaultChecked: false,
  },
] as const;

export function NotificationsSection() {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTIFICATION_OPTIONS.map((o) => [o.id, o.defaultChecked]))
  );

  return (
    <Card className="flex flex-col gap-1 p-5">
      <div className="mb-2">
        <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
        <p className="text-xs text-muted-foreground">Choose what Pulse should notify you about.</p>
      </div>
      <div className="flex flex-col divide-y divide-border">
        {NOTIFICATION_OPTIONS.map((option) => (
          <Switch
            key={option.id}
            id={option.id}
            label={option.label}
            description={option.description}
            checked={checkedMap[option.id]}
            onChange={(checked) => setCheckedMap((prev) => ({ ...prev, [option.id]: checked }))}
          />
        ))}
      </div>
    </Card>
  );
}
