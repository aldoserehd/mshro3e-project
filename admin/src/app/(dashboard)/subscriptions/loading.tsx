import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeaderSkeleton, CardGridSkeleton, TableSkeleton } from '@/components/domain/loading-skeletons';

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeaderSkeleton withAction={false} />
      <CardGridSkeleton />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-5 flex flex-col gap-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>
      <TableSkeleton rows={6} cols={6} />
    </div>
  );
}
