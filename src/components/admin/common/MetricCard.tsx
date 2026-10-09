import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Info, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

export interface MetricCardTrend {
  value: string;
  isNegative?: boolean;
  label?: string;
  direction?: 'up' | 'down' | 'neutral';
}

interface MetricCardProps {
  title: string;
  value?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  note?: string;
  accentBorder?: string;
  trend?: MetricCardTrend;
  statusIndicator?: 'negative' | 'positive' | 'warning' | 'neutral';
  statusBadge?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value = '--',
  icon: Icon,
  iconColor = 'text-[#003B73]',
  iconBg = 'bg-sky-50',
  note,
  accentBorder,
  trend,
  statusIndicator,
  statusBadge,
  onClick,
}) => {
  const isAdverse = trend?.isNegative || statusIndicator === 'negative';

  return (
    <div
      onClick={onClick}
      className={`relative group bg-white rounded-xl p-5 border transition-all ${
        isAdverse
          ? 'border-rose-300 ring-1 ring-rose-200/70 shadow-xs hover:border-rose-400 bg-gradient-to-b from-rose-50/20 to-white'
          : 'border-slate-200/90 shadow-xs hover:border-slate-300'
      } ${accentBorder ? `border-l-4 ${accentBorder}` : ''} ${onClick ? 'cursor-pointer' : ''}`}
      title={isAdverse ? 'Metric trending negatively compared to previous period' : 'Executive Metric'}
    >
      {/* Top right status/trend indicator */}
      {trend && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {isAdverse ? (
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 shadow-2xs"
              title="Negative trend compared to previous reporting period"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-600"></span>
              </span>
              <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
              <span>{trend.value}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {trend.direction === 'up' ? (
                <TrendingUp className="w-2.5 h-2.5 text-emerald-600" />
              ) : trend.direction === 'down' ? (
                <TrendingDown className="w-2.5 h-2.5 text-emerald-600" />
              ) : null}
              <span>{trend.value}</span>
            </span>
          )}
        </div>
      )}

      {statusBadge && !trend && (
        <div className="absolute top-3 right-3">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isAdverse
                ? 'text-rose-700 bg-rose-50 border-rose-200'
                : 'text-slate-600 bg-slate-100 border-slate-200'
            }`}
          >
            {statusBadge}
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3 pt-1">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            {title}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-700 select-none">
              {value}
            </span>
          </div>
        </div>

        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-slate-400">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>{note || 'Available after backend integration.'}</span>
        </span>
        {trend?.label && (
          <span
            className={`text-[10px] font-medium ${
              isAdverse ? 'text-rose-600 font-semibold' : 'text-slate-400'
            }`}
          >
            {trend.label}
          </span>
        )}
      </div>
    </div>
  );
};
