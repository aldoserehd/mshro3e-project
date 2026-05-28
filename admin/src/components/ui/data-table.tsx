'use client';

import * as React from 'react';
import { ChevronEnd } from './_icons';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';
import { EmptyState } from './empty-state';
import { Table, THead, TBody, TRow, TH, TCell } from './table';

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  /** Tailwind class added to the th/td. Used for width/alignment. */
  className?: string;
  /** Optional alignment helper. */
  align?: 'start' | 'center' | 'end';
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string | number;
  loading?: boolean;
  emptyTitle?: string;
  emptyBody?: string;
  emptyIcon?: React.ReactNode;
  emptyAction?: React.ReactNode;
  pageSize?: number;
  /** Optional row click handler; renders the row as interactive. */
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  emptyTitle = 'لا توجد بيانات',
  emptyBody,
  emptyIcon,
  emptyAction,
  pageSize = 10,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [page, setPage] = React.useState(0);
  React.useEffect(() => setPage(0), [rows.length]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const start = page * pageSize;
  const visible = rows.slice(start, start + pageSize);
  const showPager = rows.length > pageSize;

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="overflow-hidden rounded-[16px] border border-ink-200 bg-white shadow-[var(--shadow-elev1)]">
        <Table>
          <THead>
            <TRow>
              {columns.map((col) => (
                <TH
                  key={col.key}
                  className={cn(
                    col.align === 'end' && 'text-end',
                    col.align === 'center' && 'text-center',
                    col.className,
                  )}
                >
                  {col.header}
                </TH>
              ))}
            </TRow>
          </THead>
          <TBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TRow key={`sk-${i}`}>
                    {columns.map((col) => (
                      <TCell key={col.key} className={col.className}>
                        <Skeleton className="h-4 w-3/4" />
                      </TCell>
                    ))}
                  </TRow>
                ))
              : visible.length === 0
              ? null
              : visible.map((row, i) => (
                  <TRow
                    key={rowKey(row, i)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={onRowClick ? 'cursor-pointer' : ''}
                  >
                    {columns.map((col) => (
                      <TCell
                        key={col.key}
                        className={cn(
                          col.align === 'end' && 'text-end',
                          col.align === 'center' && 'text-center',
                          col.className,
                        )}
                      >
                        {col.cell(row, start + i)}
                      </TCell>
                    ))}
                  </TRow>
                ))}
          </TBody>
        </Table>
        {!loading && rows.length === 0 ? (
          <EmptyState title={emptyTitle} body={emptyBody} icon={emptyIcon} action={emptyAction} />
        ) : null}
      </div>

      {showPager ? (
        <div className="flex items-center justify-between gap-4 mt-3 px-1">
          <span className="text-[12px] text-ink-500">
            {start + 1}–{Math.min(start + pageSize, rows.length)} / {rows.length}
          </span>
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-navy-200 text-ink-900 hover:bg-navy-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="السابق"
            >
              <ChevronRight className="size-4 hidden rtl:block" />
              <ChevronLeft className="size-4 block rtl:hidden" />
            </button>
            <span className="px-2 text-[13px] font-medium text-ink-900 tabular-nums">
              {page + 1} / {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page >= pageCount - 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-navy-200 text-ink-900 hover:bg-navy-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="التالي"
            >
              <ChevronEnd className="size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
