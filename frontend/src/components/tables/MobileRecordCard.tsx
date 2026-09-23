import React from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export interface RecordField {
  label: string;
  value: React.ReactNode;
}

interface MobileRecordCardProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  fields: RecordField[];
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MobileRecordCard: React.FC<MobileRecordCardProps> = ({
  title,
  subtitle,
  badge,
  fields,
  actions,
  onClick,
  className,
}) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-4 transition-all',
        onClick && 'active:scale-[0.99] cursor-pointer hover:border-brand-blue/40',
        className
      )}
    >
      {/* Top Header with title and badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm text-text-main truncate">{title}</div>
          {subtitle && <div className="text-xs text-text-secondary truncate mt-0.5">{subtitle}</div>}
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>

      {/* Field Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-b border-gray-100 mb-3">
        {fields.map((field, idx) => (
          <div key={idx} className="min-w-0">
            <span className="text-text-muted block text-[11px] mb-0.5">{field.label}</span>
            <span className="font-medium text-text-main truncate block">{field.value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      {actions && <div className="flex items-center justify-end gap-2">{actions}</div>}
    </Card>
  );
};
