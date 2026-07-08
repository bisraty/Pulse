import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import type { TeamMember } from "@/types/data";

export function TeamGrid({ team }: { team: TeamMember[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Team members">
      {team.map((member) => (
        <li key={member.id}>
          <TeamMemberCard member={member} />
        </li>
      ))}
    </ul>
  );
}
