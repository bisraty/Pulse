import { Card } from "@/components/ui/Card";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { TeamMember } from "@/types/data";

export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className="relative shrink-0">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
          {member.initials}
        </span>
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
            member.online ? "bg-success" : "bg-muted-foreground"
          )}
          aria-hidden="true"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{member.name}</p>
        <p className="truncate text-xs text-muted-foreground">{member.role}</p>
        <p className="mt-0.5 text-xs">
          {member.online ? (
            <span className="text-success">Online now</span>
          ) : (
            <span className="text-muted-foreground">Active {formatRelativeTime(member.lastActiveTime)}</span>
          )}
        </p>
      </div>
    </Card>
  );
}
