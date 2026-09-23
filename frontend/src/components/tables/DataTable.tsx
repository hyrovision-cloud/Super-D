import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { TableEmptyState } from './TableEmptyState';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  pageSize = 10,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Sort data if requested
  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a: any, b: any) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      if (typeof valA === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(String(valB))
          : String(valB).localeCompare(valA);
      }
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }, [data, sortKey, sortDirection]);

  // Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  if (data.length === 0) {
    return (
      <TableEmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className={cn('w-full flex flex-col', className)}>
      <div className="overflow-x-auto border border-surface-border rounded-xl bg-white shadow-xs">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-surface-border text-text-secondary text-xs uppercase font-semibold">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'py-3.5 px-4 select-none whitespace-nowrap',
                    col.sortable && 'cursor-pointer hover:bg-slate-100 transition-colors',
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && sortKey === col.key && (
                      <span className="text-brand-blue">
                        {sortDirection === 'asc' ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border text-text-main">
            {paginatedData.map((item) => {
              const key = keyExtractor(item);
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={cn(
                    'hover:bg-slate-50/80 transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn('py-3.5 px-4 align-middle', col.className)}>
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-3.5 text-xs text-text-secondary">
          <div>
            Showing <span className="font-semibold text-text-main">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-text-main">
              {Math.min(startIndex + pageSize, data.length)}
            </span>{' '}
            of <span className="font-semibold text-text-main">{data.length}</span> entries
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-surface-border bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-medium text-text-main">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-surface-border bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
