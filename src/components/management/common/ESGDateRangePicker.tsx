/* oxlint-disable react/only-export-components */
import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  ChevronDown,
  Clock,
  Filter,
  Check,
  RotateCcw,
} from 'lucide-react';

export type DateFilterPreset =
  | 'all'
  | 'last_3_years'
  | 'current_fy'
  | 'all_quarters'
  | 'fy26_quarters'
  | 'q1_fy26'
  | 'q2_fy26'
  | 'q3_fy26'
  | 'q4_fy26'
  | 'custom';

export interface DateFilterState {
  preset: DateFilterPreset;
  label: string;
  isQuarterly: boolean;
  startYear?: string;
  endYear?: string;
  customStartDate?: string;
  customEndDate?: string;
}

interface ESGDateRangePickerProps {
  value: DateFilterState;
  onChange: (filter: DateFilterState) => void;
}

export const PRESET_OPTIONS: { id: DateFilterPreset; label: string; description: string; isQuarterly: boolean }[] = [
  {
    id: 'all',
    label: 'All Historical (FY22 – FY26)',
    description: '5-year audited ESG baseline to current',
    isQuarterly: false,
  },
  {
    id: 'last_3_years',
    label: 'Last 3 Fiscal Years (FY24 – FY26)',
    description: 'Medium-term SEBI BRSR compliance trajectory',
    isQuarterly: false,
  },
  {
    id: 'current_fy',
    label: 'Current FY 2025-26',
    description: 'Present reporting cycle annual metrics',
    isQuarterly: false,
  },
  {
    id: 'fy26_quarters',
    label: 'FY26 Quarters (Q1 – Q4)',
    description: 'Quarterly breakdown of current fiscal year',
    isQuarterly: true,
  },
  {
    id: 'all_quarters',
    label: '8-Quarter View (FY25 – FY26)',
    description: 'Granular 2-year quarterly progression',
    isQuarterly: true,
  },
  {
    id: 'q3_fy26',
    label: 'Q3 FY26 (Oct – Dec 2025)',
    description: 'Most recently closed audited quarter',
    isQuarterly: true,
  },
  {
    id: 'q4_fy26',
    label: 'Q4 FY26 Projected',
    description: 'Current active quarter forecast',
    isQuarterly: true,
  },
];

const AVAILABLE_YEARS = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

export const ESGDateRangePicker: React.FC<ESGDateRangePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>(value.preset === 'custom' ? 'custom' : 'presets');
  const [customStart, setCustomStart] = useState(value.startYear || 'FY23');
  const [customEnd, setCustomEnd] = useState(value.endYear || 'FY26');
  const [customDateFrom, setCustomDateFrom] = useState(value.customStartDate || '2023-04-01');
  const [customDateTo, setCustomDateTo] = useState(value.customEndDate || '2026-03-31');

  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
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

  const handleSelectPreset = (preset: typeof PRESET_OPTIONS[number]) => {
    onChange({
      preset: preset.id,
      label: preset.label,
      isQuarterly: preset.isQuarterly,
    });
    setIsOpen(false);
  };

  const handleApplyCustomYears = () => {
    const startIndex = AVAILABLE_YEARS.indexOf(customStart);
    const endIndex = AVAILABLE_YEARS.indexOf(customEnd);
    if (startIndex > endIndex) {
      // swap if inverted
      const temp = customStart;
      setCustomStart(customEnd);
      setCustomEnd(temp);
    }

    onChange({
      preset: 'custom',
      label: `Custom: ${customStart} – ${customEnd}`,
      isQuarterly: false,
      startYear: customStart <= customEnd ? customStart : customEnd,
      endYear: customStart <= customEnd ? customEnd : customStart,
    });
    setIsOpen(false);
  };

  const handleApplyCustomDates = () => {
    onChange({
      preset: 'custom',
      label: `Date Range: ${customDateFrom} to ${customDateTo}`,
      isQuarterly: false,
      customStartDate: customDateFrom,
      customEndDate: customDateTo,
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    onChange({
      preset: 'all',
      label: 'All Historical (FY22 – FY26)',
      isQuarterly: false,
    });
    setIsOpen(false);
  };

  const isFiltered = value.preset !== 'all';

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
            isFiltered
              ? 'bg-sky-50/80 border-sky-300 text-sky-900 shadow-xs ring-1 ring-sky-400/40'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs hover:border-slate-300'
          }`}
          title="Filter ESG trend data by fiscal quarter or custom period"
        >
          <Calendar className={`w-3.5 h-3.5 ${isFiltered ? 'text-sky-600' : 'text-slate-500'}`} />
          <div className="flex items-center gap-1.5 text-left">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold hidden md:inline">
              Period:
            </span>
            <span className="font-bold text-slate-800 text-xs truncate max-w-[170px] sm:max-w-[220px]">
              {value.label}
            </span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform text-slate-400 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Reset period filter to All Historical (FY22-FY26)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[340px] sm:w-[420px] bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Popover Header */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#003B73]" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                ESG Trend Period Filter
              </span>
            </div>
            <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  activeTab === 'presets'
                    ? 'bg-white text-[#003B73] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Presets & Quarters
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  activeTab === 'custom'
                    ? 'bg-white text-[#003B73] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Custom Range
              </button>
            </div>
          </div>

          {/* Tab 1: Presets & Quarters */}
          {activeTab === 'presets' && (
            <div className="p-3 max-h-[380px] overflow-y-auto space-y-1.5">
              <div className="px-2 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Annual &amp; Multi-Year Presets
              </div>
              {PRESET_OPTIONS.slice(0, 3).map((opt) => {
                const isSelected = value.preset === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectPreset(opt)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 border border-sky-200 text-sky-950 font-semibold'
                        : 'hover:bg-slate-50 border border-transparent text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-1.5">
                        <span>{opt.label}</span>
                        {!opt.isQuarterly && (
                          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            Annual
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{opt.description}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-sky-600 shrink-0 ml-2" />}
                  </button>
                );
              })}

              <div className="px-2 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-100">
                Fiscal Quarters Breakdown
              </div>
              {PRESET_OPTIONS.slice(3).map((opt) => {
                const isSelected = value.preset === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectPreset(opt)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-950 font-semibold'
                        : 'hover:bg-slate-50 border border-transparent text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-1.5">
                        <span>{opt.label}</span>
                        <span className="text-[10px] font-medium text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded">
                          Quarterly
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{opt.description}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 2: Custom Range */}
          {activeTab === 'custom' && (
            <div className="p-4 space-y-4">
              {/* Option A: Select Fiscal Years */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                  A. Fiscal Year Span
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">
                      From Year
                    </label>
                    <select
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-sky-500 outline-none"
                    >
                      {AVAILABLE_YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">
                      To Year
                    </label>
                    <select
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-sky-500 outline-none"
                    >
                      {AVAILABLE_YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleApplyCustomYears}
                  className="w-full py-1.5 text-xs font-semibold text-white bg-[#003B73] hover:bg-[#002b54] rounded-lg transition-colors cursor-pointer mt-1"
                >
                  Apply Fiscal Year Span
                </button>
              </div>

              {/* Option B: Exact Calendar Dates */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                  B. Custom Calendar Dates
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customDateFrom}
                      onChange={(e) => setCustomDateFrom(e.target.value)}
                      className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg p-1.5 focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customDateTo}
                      onChange={(e) => setCustomDateTo(e.target.value)}
                      className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg p-1.5 focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleApplyCustomDates}
                  className="w-full py-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors cursor-pointer mt-1"
                >
                  Apply Custom Dates
                </button>
              </div>
            </div>
          )}

          {/* Popover Footer */}
          <div className="p-3 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Real-time trend recalculation</span>
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] font-semibold text-sky-700 hover:text-sky-900 cursor-pointer"
            >
              Reset to All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
