import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function AnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading analytics">
      <Card className="flex items-center gap-4 p-4">
        <Skeleton className="h-9 w-40" />
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="p-5">
          <Skeleton className="h-64 w-full" />
        </Card>
        <Card className="p-5">
          <Skeleton className="h-64 w-full" />
        </Card>
      </div>

      <Card className="p-5">
        <Skeleton className="h-56 w-full" />
      </Card>
    </div>
  );
}
