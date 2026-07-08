"use client";

import { useLiveData } from "@/hooks/useLiveData";
import { TeamGrid } from "@/components/team/TeamGrid";
import { ActivityTimeline } from "@/components/team/ActivityTimeline";
import { TeamSkeleton } from "@/components/team/TeamSkeleton";

export default function TeamPage() {
  const data = useLiveData();

  if (!data) {
    return <TeamSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Team</h1>
        <p className="text-sm text-muted-foreground">Presence and activity across the team.</p>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: "60ms" }}>
        <TeamGrid team={data.team} />
      </div>

      <div className="animate-fade-in" style={{ animationDelay: "120ms" }}>
        <ActivityTimeline events={data.activityFeed} />
      </div>
    </div>
  );
}
