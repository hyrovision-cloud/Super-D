import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TableEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const TableEmptyState: React.FC<TableEmptyStateProps> = ({
  title = 'No records found',
  description = 'There are no items matching the selected filters or search query.',
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h4 className="text-base font-semibold text-text-main mb-1">{title}</h4>
      <p className="text-sm text-text-secondary max-w-sm mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
