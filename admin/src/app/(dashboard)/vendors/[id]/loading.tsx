import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CardGridSkeleton } from '@/components/domain/loading-skeletons';

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-4 w-40" />
      <Card className="p-0 overflow-hidden">
        <Skeleton className="h-40 w-full rounded-none" />
        <div className="px-6 pb-5 -mt-10 flex items-end gap-4">
          <Skeleton className="h-20 w-20 rounded-full ring-4 ring-white" />
          <div className="flex flex-col gap-2 pb-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </Card>
      <CardGridSkeleton count={3} />
    </div>
  );
}
