import { PageHeaderSkeleton, TableSkeleton } from '@/components/domain/loading-skeletons';

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeaderSkeleton withAction={false} />
      <TableSkeleton rows={6} cols={7} />
    </div>
  );
}
