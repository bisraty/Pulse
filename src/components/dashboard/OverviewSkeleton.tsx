import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading dashboard">
      <Card className="flex items-center gap-4 p-4">
        <Skeleton className="h-9 w-40" />
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="flex flex-col gap-3 p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-3 w-32" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:grid-rows-2">
        <Card className="p-5 xl:col-span-2">
          <Skeleton className="h-72 w-full" />
        </Card>
        <Card className="p-5 xl:row-span-2">
          <Skeleton className="h-full min-h-[420px] w-full" />
        </Card>
        <Card className="p-5">
          <Skeleton className="h-56 w-full" />
        </Card>
        <Card className="p-5">
          <Skeleton className="h-40 w-full" />
        </Card>
      </div>
    </div>
  );
}
