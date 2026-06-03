import { PageHeaderSkeleton, FilterBarSkeleton, TableSkeleton } from '@/components/domain/loading-skeletons';

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeaderSkeleton withAction={false} />
      <FilterBarSkeleton />
      <TableSkeleton rows={7} cols={5} />
    </div>
  );
}
