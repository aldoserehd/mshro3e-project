import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeaderSkeleton } from '@/components/domain/loading-skeletons';

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeaderSkeleton withAction={false} />

      <div className="grid grid-cols-12 auto-rows-[140px] gap-4">
        {/* Hero */}
        <Card className="col-span-12 lg:col-span-6 row-span-2 p-6 flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-11 w-24" />
            <Skeleton className="h-6 w-48 rounded-full" />
          </div>
          <Skeleton className="h-20 w-full" />
        </Card>

        {/* Two mid KPIs */}
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={`mid-${i}`} className="col-span-12 sm:col-span-6 lg:col-span-3 row-span-1 p-5 flex flex-col gap-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-16" />
          </Card>
        ))}

        {/* Three small KPIs */}
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={`kpi-${i}`} className="col-span-12 sm:col-span-4 lg:col-span-2 row-span-1 p-5 flex flex-col gap-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-12" />
          </Card>
        ))}

        {/* Charts */}
        <Card className="col-span-12 lg:col-span-7 row-span-2 p-5 flex flex-col gap-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-[200px] w-full" />
        </Card>
        <Card className="col-span-12 lg:col-span-5 row-span-2 p-5 flex flex-col gap-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-[200px] w-full rounded-full" />
        </Card>
      </div>
    </div>
  );
}
