import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './Card';
import { cn } from '@/lib/utils';

export interface KPICardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: 'blue' | 'teal' | 'navy' | 'amber' | 'green' | 'red';
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  subtitle,
  change,
  accentColor = 'blue',
  className,
}) => {
  const iconBgStyles = {
    blue: 'bg-blue-50 text-brand-blue border-blue-100',
    teal: 'bg-teal-50 text-brand-teal border-teal-100',
    navy: 'bg-navy-50 text-navy border-navy-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    red: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <Card className={cn('p-5 flex flex-col justify-between hoverEffect', className)}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wider truncate mb-1">
            {title}
          </p>
          <h4 className="text-2xl font-bold text-text-main tracking-tight truncate">
            {value}
          </h4>
        </div>
        {icon && (
          <div
            className={cn(
              'p-2.5 rounded-xl border shrink-0 transition-transform duration-200 group-hover:scale-105',
              iconBgStyles[accentColor]
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {(subtitle || change) && (
        <div className="flex items-center gap-2 text-xs pt-1 border-t border-gray-100">
          {change && (
            <span
              className={cn(
                'inline-flex items-center font-semibold gap-0.5',
                change.isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {change.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {change.value}
            </span>
          )}
          {subtitle && <span className="text-text-secondary truncate">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
};
