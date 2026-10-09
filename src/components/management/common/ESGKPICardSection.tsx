import React, { useState } from 'react';
import {
  Flame,
  Trash2,
  Zap,
  Droplet,
  Fuel,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  TrendingUp,
  Filter,
  X,
  ShieldAlert,
  ChevronRight,
  Leaf,
  Clock,
  Download,
} from 'lucide-react';
import type { DateFilterState } from './ESGDateRangePicker';

export interface ESGKPIMetric {
  id: string;
  title: string;
  category: 'Environment' | 'Energy' | 'Water' | 'Circularity' | 'Emissions';
  currentValue: string;
  unit: string;
  previousValue: string;
  percentageChange: number; // e.g., +8.8 or -4.2
  trendDirection: 'up' | 'down';
  isNegativeTrend: boolean; // TRUE if metric worsened compared to previous reporting period
  benchmark: string;
  subLabel: string;
  summary: string;
  breakdown: { label: string; value: string; percent?: number }[];
  previousPeriodLabel: string;
  currentPeriodLabel: string;
  rootCause?: string;
  mitigationPlan?: string;
  responsibleLead?: string;
  targetDeadline?: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

interface ESGKPICardSectionProps {
  dateFilter: DateFilterState;
  onExportClick?: () => void;
}

export const ESGKPICardSection: React.FC<ESGKPICardSectionProps> = ({ dateFilter, onExportClick }) => {
  const [filterMode, setFilterMode] = useState<'all' | 'flagged' | 'on_track'>('all');
  const [selectedMetricForModal, setSelectedMetricForModal] = useState<ESGKPIMetric | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  // Determine reporting period label and comparison period label based on dateFilter
  const isQuarterly = dateFilter.isQuarterly;
  const currentPeriod = isQuarterly
    ? dateFilter.preset === 'q1_fy26'
      ? 'Q1 FY26'
      : dateFilter.preset === 'q2_fy26'
      ? 'Q2 FY26'
      : dateFilter.preset === 'q3_fy26'
      ? 'Q3 FY26'
      : 'Q3 FY26 (Current)'
    : 'FY 2025-26';

  const previousPeriod = isQuarterly
    ? dateFilter.preset === 'q1_fy26'
      ? 'Q4 FY25'
      : dateFilter.preset === 'q2_fy26'
      ? 'Q1 FY26'
      : dateFilter.preset === 'q3_fy26'
      ? 'Q2 FY26'
      : 'Q2 FY26 (Prior Quarter)'
    : 'FY 2024-25 (Prior Fiscal)';

  // Consolidated ESG KPI metrics with explicit previous reporting period comparison
  const metrics: ESGKPIMetric[] = [
    {
      id: 'carbon_footprint',
      title: 'Total Carbon Footprint (Scope 1 & 2)',
      category: 'Emissions',
      currentValue: '42,850',
      unit: 'tCO2e',
      previousValue: '44,730',
      percentageChange: -4.2,
      trendDirection: 'down',
      isNegativeTrend: false, // Decreasing emissions is POSITIVE
      benchmark: 'Target: ≤ 45,000 tCO2e',
      subLabel: 'Intensity: 18.2 tCO2e / ₹ Cr turnover',
      summary: 'Net emissions down across EPC operations due to solar hybrid captive arrays and fleet route optimization.',
      breakdown: [
        { label: 'Scope 1 (Direct)', value: '28,450 tCO2e', percent: 66.4 },
        { label: 'Scope 2 (Indirect)', value: '14,400 tCO2e', percent: 33.6 },
      ],
      currentPeriodLabel: currentPeriod,
      previousPeriodLabel: previousPeriod,
      icon: Flame,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
    },
    {
      id: 'waste_circularity',
      title: 'Waste Reduction & Circularity',
      category: 'Circularity',
      currentValue: '92.0%',
      unit: 'Recycled / Diverted',
      previousValue: '88.6%',
      percentageChange: +3.4,
      trendDirection: 'up',
      isNegativeTrend: false, // Increasing circularity is POSITIVE
      benchmark: 'SEBI BRSR Target: ≥ 90%',
      subLabel: 'Debris Diverted: 184,200 MT',
      summary: 'Concrete, fly-ash, and steel scrap salvaged and redirected into road sub-base compaction.',
      breakdown: [
        { label: 'Concrete & Slag Reused', value: '142,000 MT', percent: 77.1 },
        { label: 'Steel Scrap Recycled', value: '42,200 MT', percent: 22.9 },
      ],
      currentPeriodLabel: currentPeriod,
      previousPeriodLabel: previousPeriod,
      icon: Trash2,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      id: 'freshwater_intensity',
      title: 'Freshwater Withdrawal Intensity',
      category: 'Water',
      currentValue: '542',
      unit: 'kL / ₹ Cr',
      previousValue: '498',
      percentageChange: +8.8,
      trendDirection: 'up',
      isNegativeTrend: true, // FLAGGED: INCREASE IN WITHDRAWAL IS NEGATIVE!
      benchmark: 'Internal Cap: ≤ 480 kL / ₹ Cr',
      subLabel: 'Total Withdrawn: 1,240,000 kL',
      summary: 'Adverse variance: Specific water consumption rose by +8.8% vs previous period due to summer curing at 3 lift irrigation projects.',
      breakdown: [
        { label: 'Surface Water (River/Canal)', value: '890,000 kL', percent: 71.8 },
        { label: 'Groundwater Borewells', value: '350,000 kL', percent: 28.2 },
      ],
      currentPeriodLabel: currentPeriod,
      previousPeriodLabel: previousPeriod,
      rootCause:
        'Intensive high-temperature concrete curing without enclosed canvas curing jackets at the Godavari Lift Irrigation Phase-II and Polavaram Right Canal sites. Borewell extraction increased during dry spells.',
      mitigationPlan:
        'Immediate deployment of curing compound sprays (reducing water requirement by 65%), installation of closed-loop water recirculation sumps, and weekly telemetry auditing.',
      responsibleLead: 'Er. K. Venkat Rao (Chief Site Engineer - Irrigation)',
      targetDeadline: 'Within 30 Days (Pre-Audit Sign-Off)',
      icon: Droplet,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
    },
    {
      id: 'diesel_equipment_burn',
      title: 'Equipment Diesel Intensity (Scope 1)',
      category: 'Energy',
      currentValue: '19.4',
      unit: 'kL / km constructed',
      previousValue: '18.3',
      percentageChange: +6.2,
      trendDirection: 'up',
      isNegativeTrend: true, // FLAGGED: INCREASE IN DIESEL BURN IS NEGATIVE!
      benchmark: 'Target: ≤ 17.5 kL / km',
      subLabel: 'Total Fuel Burn: 6,850 kL',
      summary: 'Adverse variance: Diesel consumption per linear km increased by +6.2% due to extended heavy equipment idling and delayed grid tie-ins.',
      breakdown: [
        { label: 'Excavators & Earthmovers', value: '4,450 kL', percent: 65.0 },
        { label: 'Diesel GenSets (DG Sets)', value: '2,400 kL', percent: 35.0 },
      ],
      currentPeriodLabel: currentPeriod,
      previousPeriodLabel: previousPeriod,
      rootCause:
        'Heavy hydraulic excavators operating on uncalibrated idling cycles on Himalayan highway rock cuts, plus temporary DG set usage awaiting 33kV dedicated grid substation line commissioning.',
      mitigationPlan:
        'Enforce automated IoT idle-stop telematics on all CAT and Komatsu heavy excavators (> 5 min idle alert). Commission 33kV temporary grid substation within 15 days.',
      responsibleLead: 'P. Rajesh Kumar (Head of Heavy Plant & Machinery)',
      targetDeadline: '15 Days / Immediate Enforcement',
      icon: Fuel,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-700',
    },
    {
      id: 'renewable_energy_mix',
      title: 'Renewable Energy Mix',
      category: 'Energy',
      currentValue: '32.1%',
      unit: 'Clean Power',
      previousValue: '28.5%',
      percentageChange: +3.6,
      trendDirection: 'up',
      isNegativeTrend: false, // Increasing renewables is POSITIVE
      benchmark: 'FY26 MEIL Target: 35.0%',
      subLabel: 'Generated: 142,500 MWh',
      summary: 'Clean power share expanded via 500MW Pavagada solar farm captive wheeling and on-site rooftop panels.',
      breakdown: [
        { label: 'Captive Solar Wheeling', value: '118,000 MWh', percent: 82.8 },
        { label: 'BESS / Microgrid Rooftop', value: '24,500 MWh', percent: 17.2 },
      ],
      currentPeriodLabel: currentPeriod,
      previousPeriodLabel: previousPeriod,
      icon: Zap,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      id: 'water_recycled_ratio',
      title: 'Water Recycled & Circular Ratio',
      category: 'Water',
      currentValue: '42.4%',
      unit: 'Circular Ratio',
      previousValue: '38.8%',
      percentageChange: +3.6,
      trendDirection: 'up',
      isNegativeTrend: false, // Increasing recycled ratio is POSITIVE
      benchmark: 'ZLD Policy Target: 40.0%',
      subLabel: 'Volume Reused: 525,800 kL',
      summary: 'Effluent treatment plants and zero-liquid-discharge (ZLD) curing systems prevented virgin water draw.',
      breakdown: [
        { label: 'ETP Treated Reuse', value: '380,000 kL', percent: 72.3 },
        { label: 'Rainwater Harvesting Catchment', value: '145,800 kL', percent: 27.7 },
      ],
      currentPeriodLabel: currentPeriod,
      previousPeriodLabel: previousPeriod,
      icon: Droplet,
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-600',
    },
  ];

  const flaggedMetrics = metrics.filter((m) => m.isNegativeTrend);
  const onTrackMetrics = metrics.filter((m) => !m.isNegativeTrend);

  const displayedMetrics =
    filterMode === 'flagged'
      ? flaggedMetrics
      : filterMode === 'on_track'
      ? onTrackMetrics
      : metrics;

  return (
    <div className="space-y-4">
      {/* SECTION HEADER WITH PERIOD COMPARISON BADGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Key ESG Performance &amp; Footprint Highlights</span>
            </h2>
            {flaggedMetrics.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                {flaggedMetrics.length} Flagged
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidated metrics tracking carbon, water, waste, clean energy, and diesel intensity against previous reporting period benchmarks.
          </p>
        </div>

        {/* Filter controls & comparison label */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({metrics.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('flagged')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                filterMode === 'flagged'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-rose-700 hover:text-rose-900 hover:bg-rose-50'
              }`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
              </span>
              <span>Negative Trends ({flaggedMetrics.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('on_track')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                filterMode === 'on_track'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              On Track ({onTrackMetrics.length})
            </button>
          </div>

          <span className="text-[11px] font-semibold text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Comparing: <strong className="text-slate-900">{currentPeriod}</strong> vs <strong className="text-slate-600">{previousPeriod}</strong></span>
          </span>

          {onExportClick && (
            <button
              type="button"
              onClick={onExportClick}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-indigo-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
              title="Export ESG KPI summary report"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Export KPI Report</span>
            </button>
          )}
        </div>
      </div>

      {/* VISUAL NOTIFICATION BANNER FOR NEGATIVE TRENDS */}
      {!bannerDismissed && flaggedMetrics.length > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-50 via-amber-50/50 to-white rounded-xl border border-rose-200/90 shadow-xs p-4 transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                    </span>
                    Executive Alert: Negative Trend Flagged in {flaggedMetrics.length} Metrics
                  </span>
                  <span className="text-[11px] text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-full border border-rose-200 font-medium">
                    Compared to {previousPeriod}
                  </span>
                </div>
                <p className="text-xs text-rose-900/90 mt-1 max-w-3xl leading-relaxed">
                  <strong>{flaggedMetrics.map((m) => `${m.title} (${m.percentageChange > 0 ? '+' : ''}${m.percentageChange}%)`).join(' and ')}</strong>{' '}
                  exceeded negative variance thresholds. Site-level root cause reviews are required prior to final BRSR board sign-off.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => setFilterMode(filterMode === 'flagged' ? 'all' : 'flagged')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-800 bg-white hover:bg-rose-100/60 border border-rose-300 rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                <Filter className="w-3.5 h-3.5 text-rose-600" />
                <span>{filterMode === 'flagged' ? 'Show All Metrics' : 'Isolate Flagged (2)'}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMetricForModal(flaggedMetrics[0])}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-white" />
                <span>Inspect Remedial Plans</span>
              </button>
              <button
                type="button"
                onClick={() => setBannerDismissed(true)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                title="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedMetrics.map((metric) => {
          const Icon = metric.icon;
          const isNegative = metric.isNegativeTrend;

          return (
            <div
              key={metric.id}
              onClick={() => isNegative && setSelectedMetricForModal(metric)}
              className={`relative bg-white p-5 rounded-2xl border transition-all flex flex-col justify-between group ${
                isNegative
                  ? 'border-rose-300 ring-1 ring-rose-200/80 bg-gradient-to-b from-rose-50/25 via-white to-white shadow-xs hover:border-rose-400 hover:shadow-md cursor-pointer'
                  : 'border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* TOP HEADER: ICON, CATEGORY, STATUS INDICATOR BADGE */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-xl ${metric.iconBg} ${metric.iconColor} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {metric.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 line-clamp-1">
                        {metric.title}
                      </span>
                    </div>
                  </div>

                  {/* VISUAL NOTIFICATION / STATUS INDICATOR BADGE */}
                  {isNegative ? (
                    <div className="flex flex-col items-end">
                      <span
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-300 ring-2 ring-rose-500/15 animate-pulse shadow-2xs"
                        title="Metric trending negatively compared to previous reporting period"
                      >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                        </span>
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Adverse ({metric.percentageChange > 0 ? '+' : ''}{metric.percentageChange}% vs Prev)</span>
                      </span>
                      <span className="text-[9px] font-bold text-rose-600 mt-1 uppercase tracking-tight flex items-center gap-0.5">
                        <span>Negative Trend</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {metric.trendDirection === 'down' ? (
                          <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span>{metric.percentageChange > 0 ? '+' : ''}{metric.percentageChange}% YoY</span>
                      </span>
                      <span className="text-[9px] font-bold text-emerald-600 mt-1 uppercase tracking-tight">
                        ✓ On Track
                      </span>
                    </div>
                  )}
                </div>

                {/* CURRENT VALUE & UNIT */}
                <div className="mt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                      {metric.currentValue}
                    </span>
                    <span className={`text-xs font-bold ${isNegative ? 'text-rose-700' : 'text-slate-500'}`}>
                      {metric.unit}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">
                    {metric.subLabel}
                  </p>
                </div>

                {/* VISUAL COMPARISON STAT STRIP: CURRENT VS PREVIOUS */}
                <div
                  className={`mt-3 p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                    isNegative
                      ? 'bg-rose-50/60 border-rose-200 text-rose-900'
                      : 'bg-slate-50 border-slate-100 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-slate-500 block">Prev. Period ({metric.previousPeriodLabel})</span>
                    <strong className="font-semibold text-slate-800">{metric.previousValue} {metric.unit}</strong>
                  </div>
                  <div className="flex items-center gap-1 font-bold">
                    {isNegative ? (
                      <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md text-[11px] border border-rose-200">
                        <TrendingUp className="w-3 h-3 text-rose-600" />
                        <span>Adverse Variance</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[11px] border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Favorable</span>
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Current ({metric.currentPeriodLabel})</span>
                    <strong className={isNegative ? 'font-bold text-rose-700' : 'font-semibold text-slate-800'}>
                      {metric.currentValue} {metric.unit}
                    </strong>
                  </div>
                </div>
              </div>

              {/* CARD FOOTER & BREAKDOWN BAR */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>{metric.breakdown[0]?.label || 'Primary'}</span>
                  <span className="font-semibold text-slate-700">{metric.breakdown[0]?.value}</span>
                </div>

                {/* Progress / Ratio Bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex">
                  {isNegative ? (
                    <>
                      <div className="bg-rose-500 h-1.5" style={{ width: `${metric.breakdown[0]?.percent || 70}%` }} />
                      <div className="bg-amber-400 h-1.5" style={{ width: `${metric.breakdown[1]?.percent || 30}%` }} />
                    </>
                  ) : (
                    <>
                      <div className="bg-emerald-500 h-1.5" style={{ width: `${metric.breakdown[0]?.percent || 75}%` }} />
                      <div className="bg-sky-400 h-1.5" style={{ width: `${metric.breakdown[1]?.percent || 25}%` }} />
                    </>
                  )}
                </div>

                {/* Benchmark or Remedial Hint */}
                {isNegative ? (
                  <div className="flex items-center justify-between text-[10px] text-rose-700 font-semibold pt-0.5">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                      <span>Breached: {metric.benchmark}</span>
                    </span>
                    <span className="underline underline-offset-2 hover:text-rose-900 cursor-pointer">
                      View Action Plan →
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-emerald-700 font-semibold block pt-0.5">
                    ✓ {metric.benchmark}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ROOT CAUSE & REMEDIAL ACTION PLAN MODAL (FOR NEGATIVE TREND METRICS) */}
      {selectedMetricForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-rose-50 p-5 border-b border-rose-200 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-200/60 px-2 py-0.5 rounded-full border border-rose-300">
                      Negative Trend Alert
                    </span>
                    <span className="text-xs font-semibold text-rose-700">
                      {selectedMetricForModal.percentageChange > 0 ? '+' : ''}
                      {selectedMetricForModal.percentageChange}% adverse variance
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedMetricForModal.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Detailed root cause investigation, responsible department, and remedial commitments for SEBI BRSR compliance.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMetricForModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-rose-100/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              {/* Period comparison review */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">Previous Reporting Period ({selectedMetricForModal.previousPeriodLabel})</span>
                  <span className="text-lg font-bold text-slate-800">
                    {selectedMetricForModal.previousValue} {selectedMetricForModal.unit}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-rose-700 font-semibold block">Active Reporting Period ({selectedMetricForModal.currentPeriodLabel})</span>
                  <span className="text-lg font-black text-rose-700">
                    {selectedMetricForModal.currentValue} {selectedMetricForModal.unit}
                  </span>
                </div>
              </div>

              {/* Root Cause Analysis */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Root Cause Analysis &amp; Site Observations</span>
                </h4>
                <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-200 text-xs text-slate-800 leading-relaxed">
                  {selectedMetricForModal.rootCause}
                </div>
              </div>

              {/* Corrective Action Commitment */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Immediate Remedial &amp; Mitigation Action Plan</span>
                </h4>
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 text-xs text-slate-800 leading-relaxed">
                  {selectedMetricForModal.mitigationPlan}
                </div>
              </div>

              {/* Governance & Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Responsible Site Officer</span>
                  <strong className="text-slate-900 block mt-0.5">{selectedMetricForModal.responsibleLead}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Mitigation Audit Deadline</span>
                  <strong className="text-rose-700 block mt-0.5">{selectedMetricForModal.targetDeadline}</strong>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                SEBI BRSR Principle 6 (Environment &amp; Natural Resource Stewardship)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMetricForModal(null);
                    setDispatchSuccess(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg cursor-pointer transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDispatchSuccess(
                      `Corrective notice issued to ${selectedMetricForModal.responsibleLead}. Target deadline: ${selectedMetricForModal.targetDeadline}.`
                    );
                    setTimeout(() => {
                      setSelectedMetricForModal(null);
                      setDispatchSuccess(null);
                    }, 2200);
                  }}
                  disabled={Boolean(dispatchSuccess)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:bg-emerald-600 rounded-lg cursor-pointer transition-colors shadow-2xs"
                >
                  {dispatchSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Notice Dispatched!</span>
                    </>
                  ) : (
                    <span>Acknowledge &amp; Dispatch Corrective Notice</span>
                  )}
                </button>
              </div>
            </div>
            {dispatchSuccess && (
              <div className="bg-emerald-600 text-white px-5 py-2.5 text-xs font-medium flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-100" />
                  <span>{dispatchSuccess}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
