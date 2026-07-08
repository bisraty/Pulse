import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function TeamSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading team">
      <Card className="flex items-center gap-4 p-4">
        <Skeleton className="h-9 w-40" />
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="flex items-center gap-3 p-4">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <Skeleton className="h-72 w-full" />
      </Card>
    </div>
  );
}
