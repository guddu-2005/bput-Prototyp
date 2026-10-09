import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  ChevronDown,
  Clock,
  RotateCcw,
  Check,
  CalendarRange,
  X,
  SlidersHorizontal,
} from 'lucide-react';

export type PeriodType =
  | 'all'
  | 'last3y'
  | 'fy26'
  | 'fy26_q1'
  | 'fy26_q2'
  | 'fy26_q3'
  | 'fy26_q4'
  | 'fy25'
  | 'fy25_q1'
  | 'fy25_q2'
  | 'fy25_q3'
  | 'fy25_q4'
  | 'rolling4q'
  | 'custom';

export interface SelectedPeriod {
  type: PeriodType;
  label: string;
  sublabel: string;
  startDate?: string;
  endDate?: string;
  isQuarterly?: boolean;
}

interface DateRangePickerProps {
  value: SelectedPeriod;
  onChange: (period: SelectedPeriod) => void;
  className?: string;
}

const PRESET_OPTIONS: {
  category: 'Fiscal Years' | 'Fiscal Quarters (FY26)' | 'Prior Quarters (FY25)';
  items: {
    type: PeriodType;
    label: string;
    sublabel: string;
    startDate?: string;
    endDate?: string;
    isQuarterly?: boolean;
  }[];
}[] = [
  {
    category: 'Fiscal Years',
    items: [
      {
        type: 'all',
        label: 'All Historical (FY22 – FY26)',
        sublabel: 'Full 5-year multi-period trend',
        startDate: '2021-04-01',
        endDate: '2026-03-31',
        isQuarterly: false,
      },
      {
        type: 'last3y',
        label: 'Last 3 Fiscal Years (FY24 – FY26)',
        sublabel: 'SEBI BRSR Core statutory window',
        startDate: '2023-04-01',
        endDate: '2026-03-31',
        isQuarterly: false,
      },
      {
        type: 'fy26',
        label: 'Current Year (FY26 All Quarters)',
        sublabel: 'Q1 to Q4 FY 2025-26',
        startDate: '2025-04-01',
        endDate: '2026-03-31',
        isQuarterly: true,
      },
      {
        type: 'fy25',
        label: 'Prior Baseline (FY25 All Quarters)',
        sublabel: 'Q1 to Q4 FY 2024-25',
        startDate: '2024-04-01',
        endDate: '2025-03-31',
        isQuarterly: true,
      },
    ],
  },
  {
    category: 'Fiscal Quarters (FY26)',
    items: [
      {
        type: 'fy26_q1',
        label: 'FY26 Q1 (Apr – Jun 2025)',
        sublabel: 'Q1 Closed & Audited',
        startDate: '2025-04-01',
        endDate: '2025-06-30',
        isQuarterly: true,
      },
      {
        type: 'fy26_q2',
        label: 'FY26 Q2 (Jul – Sep 2025)',
        sublabel: 'Q2 Closed & Verified',
        startDate: '2025-07-01',
        endDate: '2025-09-30',
        isQuarterly: true,
      },
      {
        type: 'fy26_q3',
        label: 'FY26 Q3 (Oct – Dec 2025)',
        sublabel: 'Q3 Under Review',
        startDate: '2025-10-01',
        endDate: '2025-12-31',
        isQuarterly: true,
      },
      {
        type: 'fy26_q4',
        label: 'FY26 Q4 (Jan – Mar 2026)',
        sublabel: 'Q4 Projected Baseline',
        startDate: '2026-01-01',
        endDate: '2026-03-31',
        isQuarterly: true,
      },
    ],
  },
  {
    category: 'Prior Quarters (FY25)',
    items: [
      {
        type: 'rolling4q',
        label: 'Trailing 4 Quarters (LTM)',
        sublabel: 'Rolling 12-month performance',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        isQuarterly: true,
      },
      {
        type: 'fy25_q1',
        label: 'FY25 Q1 (Apr – Jun 2024)',
        sublabel: 'Audited baseline Q1',
        startDate: '2024-04-01',
        endDate: '2024-06-30',
        isQuarterly: true,
      },
      {
        type: 'fy25_q2',
        label: 'FY25 Q2 (Jul – Sep 2024)',
        sublabel: 'Audited baseline Q2',
        startDate: '2024-07-01',
        endDate: '2024-09-30',
        isQuarterly: true,
      },
      {
        type: 'fy25_q4',
        label: 'FY25 Q4 (Jan – Mar 2025)',
        sublabel: 'Audited statutory end',
        startDate: '2025-01-01',
        endDate: '2025-03-31',
        isQuarterly: true,
      },
    ],
  },
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [customStart, setCustomStart] = useState(value.startDate || '2024-04-01');
  const [customEnd, setCustomEnd] = useState(value.endDate || '2026-03-31');
  const [customError, setCustomError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectPreset = (item: {
    type: PeriodType;
    label: string;
    sublabel: string;
    startDate?: string;
    endDate?: string;
    isQuarterly?: boolean;
  }) => {
    onChange({
      type: item.type,
      label: item.label,
      sublabel: item.sublabel,
      startDate: item.startDate,
      endDate: item.endDate,
      isQuarterly: item.isQuarterly,
    });
    setIsOpen(false);
  };

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) {
      setCustomError('Please select both start and end dates.');
      return;
    }
    if (new Date(customStart) > new Date(customEnd)) {
      setCustomError('Start date must be before end date.');
      return;
    }
    setCustomError(null);

    const formattedStart = new Date(customStart).toLocaleDateString('en-IN', {
      month: 'short',
      year: 'numeric',
    });
    const formattedEnd = new Date(customEnd).toLocaleDateString('en-IN', {
      month: 'short',
      year: 'numeric',
    });

    onChange({
      type: 'custom',
      label: `Custom: ${formattedStart} – ${formattedEnd}`,
      sublabel: `${customStart} to ${customEnd}`,
      startDate: customStart,
      endDate: customEnd,
      isQuarterly: false,
    });
    setIsOpen(false);
  };

  const handleResetToAll = () => {
    onChange({
      type: 'all',
      label: 'All Historical (FY22 – FY26)',
      sublabel: 'Full 5-year multi-period trend',
      startDate: '2021-04-01',
      endDate: '2026-03-31',
      isQuarterly: false,
    });
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#003B73] focus:ring-offset-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Filter historical trend data by fiscal quarter or custom period"
      >
        <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
          <Calendar className="w-3.5 h-3.5" />
        </div>

        <div className="text-left min-w-0 pr-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider leading-none">
            Period Filter
          </span>
          <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
            {value.label}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-sky-700' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[420px] bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150">
          {/* Popover Header */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarRange className="w-4 h-4 text-sky-700" />
              <span className="text-xs font-bold text-slate-900">Filter Reporting Period</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/50 flex gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Fiscal Quarters &amp; Years</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'custom'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Custom Date Range</span>
            </button>
          </div>

          {/* Preset Options Tab */}
          {activeTab === 'presets' ? (
            <div className="p-3 max-h-[380px] overflow-y-auto custom-scrollbar space-y-4">
              {PRESET_OPTIONS.map((group) => (
                <div key={group.category} className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
                    {group.category}
                  </span>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isSelected = value.type === item.type;
                      return (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => handleSelectPreset(item)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-sky-50 text-sky-950 font-semibold border border-sky-200'
                              : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <span className={`block ${isSelected ? 'font-bold text-sky-900' : 'font-medium'}`}>
                              {item.label}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                              {item.sublabel}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Custom Date Range Tab */
            <div className="p-4 space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                <span className="font-bold block">Custom Period Notice:</span>
                <span>
                  Select specific calendar bounds. Historical ESG metrics and sensor telemetry will be filtered to periods intersecting your dates.
                </span>
              </div>

              {customError && (
                <div className="p-2.5 bg-rose-50 text-rose-800 rounded-lg text-xs font-semibold border border-rose-200">
                  {customError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => {
                      setCustomStart(e.target.value);
                      setCustomError(null);
                    }}
                    min="2021-04-01"
                    max="2026-03-31"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-600 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => {
                      setCustomEnd(e.target.value);
                      setCustomError(null);
                    }}
                    min="2021-04-01"
                    max="2026-03-31"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-600 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleApplyCustom}
                  className="flex-1 py-2 px-3 text-xs font-bold text-white bg-[#003B73] hover:bg-[#002e5c] rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Apply Custom Range
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomStart('2024-04-01');
                    setCustomEnd('2026-03-31');
                    setCustomError(null);
                  }}
                  className="p-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  title="Reset dates"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Popover Footer with Reset Button */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500 font-medium truncate max-w-[220px]">
              Active: {value.label}
            </span>
            <button
              type="button"
              onClick={handleResetToAll}
              className="text-[11px] font-bold text-sky-700 hover:text-sky-900 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to All</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
