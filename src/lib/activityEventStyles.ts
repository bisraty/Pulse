import {
  AlertTriangle,
  ArrowUpCircle,
  CheckCircle2,
  Sparkles,
  UserMinus,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import type { ActivityEventType } from "@/types/data";

export const EVENT_ICON: Record<ActivityEventType, LucideIcon> = {
  upgrade: ArrowUpCircle,
  signup: UserPlus,
  trial_started: Sparkles,
  payment_succeeded: CheckCircle2,
  payment_failed: AlertTriangle,
  churn: UserMinus,
};

export const EVENT_COLOR: Record<ActivityEventType, string> = {
  upgrade: "text-accent",
  signup: "text-accent",
  trial_started: "text-muted-foreground",
  payment_succeeded: "text-success",
  payment_failed: "text-danger",
  churn: "text-danger",
};
