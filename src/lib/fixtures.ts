import type { PlanTier, TeamMember } from "@/types/data";

export const FAKE_NAMES = [
  "Abebe K.",
  "Sara M.",
  "Liam O.",
  "Noa B.",
  "Kenji T.",
  "Priya R.",
  "Diego F.",
  "Amara N.",
  "Elif Y.",
  "Marcus V.",
  "Hana S.",
  "Omar A.",
] as const;

export const FAKE_COUNTRIES = [
  "Germany",
  "Ethiopia",
  "Brazil",
  "India",
  "United States",
  "United Kingdom",
  "Nigeria",
  "Japan",
  "Canada",
  "France",
] as const;

export const PLAN_LABELS: Record<PlanTier, string> = {
  free: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
};

export const TEAM_ROSTER: Array<Omit<TeamMember, "online" | "lastActiveTime">> = [
  { id: "u1", name: "Abebe Kebede", role: "Founder", initials: "AK" },
  { id: "u2", name: "Sara Mekonnen", role: "Engineering Lead", initials: "SM" },
  { id: "u3", name: "Liam O'Connor", role: "Product Designer", initials: "LO" },
  { id: "u4", name: "Priya Rao", role: "Backend Engineer", initials: "PR" },
  { id: "u5", name: "Kenji Tanaka", role: "Growth", initials: "KT" },
  { id: "u6", name: "Hana Solomon", role: "Customer Success", initials: "HS" },
];

export const TRAFFIC_SOURCE_NAMES = [
  "Organic Search",
  "Direct",
  "Referral",
  "Social",
  "Paid Ads",
  "Email",
] as const;

export const GEO_COUNTRIES = [
  "United States",
  "Germany",
  "United Kingdom",
  "India",
  "Brazil",
  "Ethiopia",
  "Japan",
  "Canada",
] as const;
