import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { TeamMember } from "@/types/data";

export function TeamPresenceStrip({ team }: { team: TeamMember[] }) {
  const onlineCount = team.filter((m) => m.online).length;

  return (
    <Card className="flex items-center gap-4 p-4">
      <h2 className="sr-only">Online team members</h2>
      <ul className="flex -space-x-2">
        {team.map((member) => (
          <li key={member.id} className="relative">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-semibold text-foreground">
              {member.initials}
            </span>
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
                member.online ? "bg-success" : "bg-muted-foreground"
              )}
              aria-hidden="true"
            />
            <span className="sr-only">
              {member.name}, {member.role}, {member.online ? "online" : "offline"}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{onlineCount}</span> of {team.length} online
      </p>
    </Card>
  );
}
