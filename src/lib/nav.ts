import { LayoutDashboard, BarChart3, Users, Settings } from "lucide-react";
import type { NavItem } from "@/types/nav";

export const navItems: NavItem[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];
