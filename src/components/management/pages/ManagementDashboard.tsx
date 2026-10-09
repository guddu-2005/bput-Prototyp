import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Target,
  FileCheck2,
  TrendingUp,
  Leaf,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  RotateCcw,
  Download,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';
import { PageHeader } from '../../admin/common/PageHeader';
import { MetricCard } from '../../admin/common/MetricCard';
import { useNexusData } from '../../../context/NexusDataContext';
import {
  ESGDateRangePicker,
  type DateFilterState,
} from '../common/ESGDateRangePicker';
import { ESGKPICardSection } from '../common/ESGKPICardSection';
import {
  BusinessUnitBreakdownModal,
  type ESGMetricKey,
  type HistoricalESGData,
} from '../common/BusinessUnitBreakdownModal';
import { ESGReportExportModal } from '../common/ESGReportExportModal';
import {
  buildForecastDataset,
  type ForecastScenario,
  type ExtendedESGData,
  SCENARIO_LABELS,
} from '../../../services/esgForecast.service';

const HISTORICAL_ESG_METRICS: HistoricalESGData[] = [
  {
    fiscalYear: 'FY 2021-22',
    yearLabel: 'FY22',
    esgScore: 62.4,
    environmentalScore: 56.8,
    socialScore: 68.2,
    governanceScore: 71.0,
    ghgIntensity: 26.8,
    renewableRatio: 12.4,
    waterRecycledRatio: 22.0,
    ltifr: 0.28,
    wasteRecycled: 68.5,
  },
  {
    fiscalYear: 'FY 2022-23',
    yearLabel: 'FY23',
    esgScore: 71.8,
    environmentalScore: 67.2,
    socialScore: 75.0,
    governanceScore: 78.5,
    ghgIntensity: 23.9,
    renewableRatio: 18.2,
    waterRecycledRatio: 28.4,
    ltifr: 0.21,
    wasteRecycled: 76.0,
  },
  {
    fiscalYear: 'FY 2023-24',
    yearLabel: 'FY24',
    esgScore: 81.5,
    environmentalScore: 78.4,
    socialScore: 83.1,
    governanceScore: 86.0,
    ghgIntensity: 21.4,
    renewableRatio: 23.6,
    waterRecycledRatio: 34.2,
    ltifr: 0.15,
    wasteRecycled: 83.4,
  },
  {
    fiscalYear: 'FY 2024-25',
    yearLabel: 'FY25',
    esgScore: 89.2,
    environmentalScore: 86.5,
    socialScore: 90.4,
    governanceScore: 92.0,
    ghgIntensity: 19.6,
    renewableRatio: 28.5,
    waterRecycledRatio: 38.8,
    ltifr: 0.11,
    wasteRecycled: 88.6,
  },
  {
    fiscalYear: 'FY 2025-26 (Current)',
    yearLabel: 'FY26',
    esgScore: 95.8,
    environmentalScore: 94.1,
    socialScore: 96.2,
    governanceScore: 97.5,
    ghgIntensity: 18.2,
    renewableRatio: 32.1,
    waterRecycledRatio: 42.4,
    ltifr: 0.08,
    wasteRecycled: 92.0,
  },
];

const QUARTERLY_ESG_METRICS: HistoricalESGData[] = [
  {
    fiscalYear: 'Q1 FY 2024-25 (Apr-Jun)',
    yearLabel: 'Q1 FY25',
    esgScore: 83.2,
    environmentalScore: 80.1,
    socialScore: 84.5,
    governanceScore: 87.2,
    ghgIntensity: 21.0,
    renewableRatio: 24.8,
    waterRecycledRatio: 35.1,
    ltifr: 0.14,
    wasteRecycled: 84.8,
  },
  {
    fiscalYear: 'Q2 FY 2024-25 (Jul-Sep)',
    yearLabel: 'Q2 FY25',
    esgScore: 85.6,
    environmentalScore: 82.5,
    socialScore: 86.8,
    governanceScore: 89.0,
    ghgIntensity: 20.4,
    renewableRatio: 26.2,
    waterRecycledRatio: 36.5,
    ltifr: 0.13,
    wasteRecycled: 86.2,
  },
  {
    fiscalYear: 'Q3 FY 2024-25 (Oct-Dec)',
    yearLabel: 'Q3 FY25',
    esgScore: 87.4,
    environmentalScore: 84.8,
    socialScore: 88.9,
    governanceScore: 90.8,
    ghgIntensity: 19.9,
    renewableRatio: 27.4,
    waterRecycledRatio: 37.8,
    ltifr: 0.12,
    wasteRecycled: 87.5,
  },
  {
    fiscalYear: 'Q4 FY 2024-25 (Jan-Mar)',
    yearLabel: 'Q4 FY25',
    esgScore: 89.2,
    environmentalScore: 86.5,
    socialScore: 90.4,
    governanceScore: 92.0,
    ghgIntensity: 19.6,
    renewableRatio: 28.5,
    waterRecycledRatio: 38.8,
    ltifr: 0.11,
    wasteRecycled: 88.6,
  },
  {
    fiscalYear: 'Q1 FY 2025-26 (Apr-Jun)',
    yearLabel: 'Q1 FY26',
    esgScore: 91.0,
    environmentalScore: 88.4,
    socialScore: 92.1,
    governanceScore: 93.5,
    ghgIntensity: 19.1,
    renewableRatio: 29.6,
    waterRecycledRatio: 39.8,
    ltifr: 0.10,
    wasteRecycled: 89.8,
  },
  {
    fiscalYear: 'Q2 FY 2025-26 (Jul-Sep)',
    yearLabel: 'Q2 FY26',
    esgScore: 92.8,
    environmentalScore: 90.6,
    socialScore: 93.8,
    governanceScore: 95.0,
    ghgIntensity: 18.7,
    renewableRatio: 30.5,
    waterRecycledRatio: 40.9,
    ltifr: 0.09,
    wasteRecycled: 90.7,
  },
  {
    fiscalYear: 'Q3 FY 2025-26 (Oct-Dec)',
    yearLabel: 'Q3 FY26',
    esgScore: 94.4,
    environmentalScore: 92.5,
    socialScore: 95.1,
    governanceScore: 96.2,
    ghgIntensity: 18.4,
    renewableRatio: 31.4,
    waterRecycledRatio: 41.7,
    ltifr: 0.08,
    wasteRecycled: 91.4,
  },
  {
    fiscalYear: 'Q4 FY 2025-26 (Projected)',
    yearLabel: 'Q4 FY26',
    esgScore: 95.8,
    environmentalScore: 94.1,
    socialScore: 96.2,
    governanceScore: 97.5,
    ghgIntensity: 18.2,
    renewableRatio: 32.1,
    waterRecycledRatio: 42.4,
    ltifr: 0.08,
    wasteRecycled: 92.0,
  },
];

const ALL_ESG_LOOKUP = [...HISTORICAL_ESG_METRICS, ...QUARTERLY_ESG_METRICS];

type MetricCategory = 'composite' | 'pillars' | 'decarbonization' | 'circularity' | 'safety';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  metricView?: MetricCategory;
}

const ESGChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, metricView }) => {
  if (active && payload && payload.length) {
    const rawPoint = (payload[0]?.payload as ExtendedESGData) || ALL_ESG_LOOKUP.find((d) => d.yearLabel === label);
    const isForecast = Boolean(rawPoint?.isForecast);
    const isTransition = Boolean(rawPoint?.isTransitionPoint);

    // Filter out undefined/null entries and remove duplicates on transition point
    const validEntries = payload.filter((e) => e.value !== undefined && e.value !== null);
    const seenNames = new Set<string>();
    const displayEntries = validEntries.filter((entry) => {
      const baseName = String(entry.name)
        .replace(' (Forecast)', '')
        .replace(' Forecast', '')
        .replace('YTD Momentum Forecast', 'MEIL ESG Composite Score');
      if (seenNames.has(baseName)) return false;
      seenNames.add(baseName);
      return true;
    });

    return (
      <div className="bg-[#0B1D33] text-white p-3.5 rounded-xl border border-sky-500/30 shadow-xl text-xs space-y-2 min-w-[220px]">
        <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 gap-2">
          <span className="font-bold text-sky-300">{rawPoint?.fiscalYear || label}</span>
          {isForecast ? (
            <span className="text-[10px] text-amber-300 font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 flex items-center gap-1">
              <span>🔮</span> Forecast Model
            </span>
          ) : isTransition ? (
            <span className="text-[10px] text-sky-300 font-semibold px-1.5 py-0.5 rounded bg-sky-500/20 border border-sky-500/40">
              FY26 Baseline
            </span>
          ) : (
            <span className="text-[10px] text-emerald-300 font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40">
              Audited Historical
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          {displayEntries.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-bold font-mono text-white flex items-center gap-1">
                <span>
                  {entry.value}
                  {entry.unit || (metricView === 'decarbonization' ? ' tCO2e/Cr' : metricView === 'safety' ? '' : '%')}
                </span>
                {isForecast && (
                  <span className="text-[9px] text-amber-300 font-normal">proj.</span>
                )}
              </span>
            </div>
          ))}
        </div>
        {isForecast && rawPoint?.modelConfidence && (
          <div className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-1 rounded border border-slate-700/60 flex items-center justify-between">
            <span>Model Confidence:</span>
            <span className="text-amber-300 font-semibold">{rawPoint.modelConfidence}% (YTD Run-Rate)</span>
          </div>
        )}
        <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-[10px] text-sky-400 font-medium">
          <span className="flex items-center gap-1">
            <span>💡</span>
            <span>Click point to view {isForecast ? 'forecasted BU breakdown' : 'Business Unit breakdown'}</span>
          </span>
          <span className="text-sky-300">→</span>
        </div>
      </div>
    );
  }
  return null;
};

export const ManagementDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { assignments, submissions } = useNexusData();
  const [selectedMetricView, setSelectedMetricView] = useState<MetricCategory>('composite');
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    preset: 'all',
    label: 'All Historical (FY22 – FY26)',
    isQuarterly: false,
  });

  // Forecasting & Predictive Modeling State
  const [showForecast, setShowForecast] = useState<boolean>(true);
  const [forecastScenario, setForecastScenario] = useState<ForecastScenario>('ytd_momentum');
  const [forecastHorizon, setForecastHorizon] = useState<number>(2);

  // Business Unit Drill-Down Modal State for Trend Line Points
  const [selectedDrillDownPoint, setSelectedDrillDownPoint] = useState<HistoricalESGData | null>(null);
  const [selectedDrillDownMetric, setSelectedDrillDownMetric] = useState<ESGMetricKey>('esgScore');
  const [isBUModalOpen, setIsBUModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleOpenBUBreakdown = (metricKey: ESGMetricKey, dataPoint?: HistoricalESGData) => {
    if (dataPoint) {
      setSelectedDrillDownMetric(metricKey);
      setSelectedDrillDownPoint(dataPoint);
      setIsBUModalOpen(true);
    }
  };

  const totalAssignments = assignments.length || 1;
  const approvedAssignments = assignments.filter((a) => a.status === 'approved').length;
  const pendingApprovals = assignments.filter(
    (a) => a.status === 'under_review' || a.status === 'correction_requested'
  ).length;

  const openRisks = assignments.filter((a) => a.riskLevel === 'High').length;
  const completionPercentage = Math.round((approvedAssignments / totalAssignments) * 100);
  const pendingReviews = assignments.filter((a) => a.status === 'under_review').length;

  const waterData = submissions
    .filter((s) => s.assignmentId === 'a_2')
    .reduce((acc, cur) => acc + (typeof cur.value === 'number' ? cur.value : parseFloat(String(cur.value)) || 0), 0);
  const energyData = submissions
    .filter((s) => s.assignmentId === 'a_1')
    .reduce((acc, cur) => acc + (typeof cur.value === 'number' ? cur.value : parseFloat(String(cur.value)) || 0), 0);

  // Compute filtered dataset for Recharts based on Date Range / Quarter Filter
  const filteredESGMetrics = useMemo(() => {
    if (dateFilter.isQuarterly) {
      if (dateFilter.preset === 'fy26_quarters') {
        return QUARTERLY_ESG_METRICS.filter((d) => d.yearLabel.includes('FY26'));
      }
      if (dateFilter.preset === 'q3_fy26') {
        return QUARTERLY_ESG_METRICS.filter((d) => ['Q1 FY26', 'Q2 FY26', 'Q3 FY26'].includes(d.yearLabel));
      }
      if (dateFilter.preset === 'q4_fy26') {
        return QUARTERLY_ESG_METRICS.filter((d) => d.yearLabel.includes('FY26'));
      }
      return QUARTERLY_ESG_METRICS;
    }

    if (dateFilter.preset === 'last_3_years') {
      return HISTORICAL_ESG_METRICS.filter((d) => ['FY24', 'FY25', 'FY26'].includes(d.yearLabel));
    }
    if (dateFilter.preset === 'current_fy') {
      return HISTORICAL_ESG_METRICS.filter((d) => ['FY25', 'FY26'].includes(d.yearLabel));
    }
    if (dateFilter.preset === 'custom' && dateFilter.startYear && dateFilter.endYear) {
      const startIndex = HISTORICAL_ESG_METRICS.findIndex((d) => d.yearLabel === dateFilter.startYear);
      const endIndex = HISTORICAL_ESG_METRICS.findIndex((d) => d.yearLabel === dateFilter.endYear);
      if (startIndex !== -1 && endIndex !== -1) {
        const low = Math.min(startIndex, endIndex);
        const high = Math.max(startIndex, endIndex);
        return HISTORICAL_ESG_METRICS.slice(low, high + 1);
      }
    }
    return HISTORICAL_ESG_METRICS;
  }, [dateFilter]);

  // Compute Recharts dataset with forward-looking predictive trajectory line
  const chartDataWithForecast = useMemo(() => {
    return buildForecastDataset(filteredESGMetrics, {
      showForecast,
      scenario: forecastScenario,
      horizonYears: dateFilter.isQuarterly ? 3 : forecastHorizon,
    });
  }, [filteredESGMetrics, showForecast, forecastScenario, forecastHorizon, dateFilter.isQuarterly]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Executive Sustainability Dashboard"
        description="Consolidated overview of group-wide ESG performance, approved BRSR disclosures, compliance indicators, critical risks, and report sign-off readiness."
        extraControls={
          <ESGDateRangePicker
            value={dateFilter}
            onChange={setDateFilter}
          />
        }
      />

      {/* Action Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Executive Actions</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/management/sign-off')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-indigo-700" />
            <span>Review Sign-Off Prerequisites</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/management/brsr-readiness')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>View BRSR Readiness</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/management/risks')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Review Risks &amp; Exceptions</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/management/reports')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
            <span>Open Reports Archive</span>
          </button>
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Export ESG Report (PDF / Excel)</span>
          </button>
        </div>
      </div>

      {/* 6 Executive Performance Cards */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
          Executive Performance Indicators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            title="Overall BRSR Completion"
            value={`${completionPercentage}%`}
            icon={ClipboardCheck}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-700"
            accentBorder="border-l-indigo-600"
            trend={{ value: '+4.2% vs Prev', direction: 'up', label: 'On Schedule' }}
          />
          <MetricCard
            title="Approved Coverage"
            value={`${approvedAssignments} / ${assignments.length}`}
            icon={CheckCircle2}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            accentBorder="border-l-emerald-500"
            trend={{ value: '+3 New', direction: 'up', label: 'Cycle Accelerated' }}
          />
          <MetricCard
            title="Pending Reviews"
            value={pendingReviews.toString()}
            icon={Clock}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            accentBorder="border-l-amber-500"
            trend={{ value: 'Within SLA', direction: 'neutral', label: 'No Breaches' }}
          />
          <MetricCard
            title="Critical Exceptions"
            value={openRisks.toString()}
            icon={AlertTriangle}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
            accentBorder="border-l-rose-500"
            trend={{ value: '+1 vs Prev', isNegative: true, label: '3 Open Risks (Adverse)' }}
            onClick={() => navigate('/management/risks')}
          />
          <MetricCard
            title="Targets Off Track"
            value={pendingApprovals.toString()}
            icon={Target}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
            accentBorder="border-l-orange-500"
            trend={{ value: '2 Off Track', isNegative: true, label: 'Water & Diesel' }}
            onClick={() => navigate('/management/brsr-readiness')}
          />
          <MetricCard
            title="Sign-Off Readiness"
            value="Ready"
            icon={FileCheck2}
            iconBg="bg-sky-50"
            iconColor="text-sky-700"
            accentBorder="border-l-sky-600"
            statusBadge="Prerequisites Met"
            onClick={() => navigate('/management/sign-off')}
          />
        </div>
      </div>

      {/* HIGH-LEVEL ESG KPI SUMMARY CARDS WITH VISUAL NOTIFICATION & ADVERSE STATUS INDICATORS */}
      <ESGKPICardSection
        dateFilter={dateFilter}
        onExportClick={() => setIsExportModalOpen(true)}
      />

      {/* RECHARTS HISTORICAL ESG PERFORMANCE SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                {dateFilter.isQuarterly ? 'Quarterly ESG Trend' : 'Multi-Year Recharts Analytics'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Period: <strong className="text-slate-800">{dateFilter.label}</strong>
              </span>
              {dateFilter.preset !== 'all' && (
                <button
                  type="button"
                  onClick={() =>
                    setDateFilter({
                      preset: 'all',
                      label: 'All Historical (FY22 – FY26)',
                      isQuarterly: false,
                    })
                  }
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2 py-0.5 rounded border border-sky-200 cursor-pointer transition-colors"
                  title="Reset filter"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to All</span>
                </button>
              )}
            </div>
            <h2 className="text-base font-bold text-slate-800 mt-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Historical ESG Performance Trends</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical {dateFilter.isQuarterly ? 'quarterly' : 'multi-year'} progress across consolidated ESG indices, GHG decarbonization, water circularity, and occupational safety.
            </p>
          </div>

          {/* Metric View Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedMetricView('composite')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedMetricView === 'composite'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Composite Index
            </button>
            <button
              type="button"
              onClick={() => setSelectedMetricView('pillars')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedMetricView === 'pillars'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              E-S-G Pillars
            </button>
            <button
              type="button"
              onClick={() => setSelectedMetricView('decarbonization')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedMetricView === 'decarbonization'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              GHG Intensity
            </button>
            <button
              type="button"
              onClick={() => setSelectedMetricView('circularity')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedMetricView === 'circularity'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Renewables &amp; Water
            </button>
            <button
              type="button"
              onClick={() => setSelectedMetricView('safety')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedMetricView === 'safety'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Safety (LTIFR)
            </button>
          </div>
        </div>

        {/* Interactive Drill-Down Indicator */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs text-indigo-800 bg-indigo-50/90 px-3 py-1.5 rounded-lg border border-indigo-200/80">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="font-semibold">Interactive Breakdown:</span>
            <span className="text-indigo-700">Click any data point along the actual or forecast trend lines to view Business Unit breakdown</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Aggregating 6 Accredited MEIL Business Units
            </span>
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-indigo-700 bg-white hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
              title="Export current ESG charts and KPI summaries"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Export Chart &amp; Data</span>
            </button>
          </div>
        </div>

        {/* Predictive Modeling & Forecasting Controls Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2.5 py-2 px-3 bg-gradient-to-r from-indigo-50/90 via-sky-50/70 to-purple-50/80 rounded-xl border border-indigo-100/90">
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => setShowForecast((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                showForecast
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 ring-2 ring-indigo-400/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
              title="Toggle forward-looking ESG trajectory line based on current YTD performance"
            >
              <Sparkles className={`w-3.5 h-3.5 ${showForecast ? 'text-amber-300' : 'text-slate-400'}`} />
              <span>{showForecast ? 'Forecast Line: Active' : 'Enable YTD Forecast'}</span>
            </button>

            {showForecast && (
              <>
                <div className="h-4 w-px bg-slate-200 hidden sm:block" />

                {/* Scenario Selector */}
                <div className="flex items-center gap-1 bg-white/95 p-0.5 rounded-lg border border-slate-200 text-xs shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500 pl-2 pr-1">Scenario:</span>
                  {(['ytd_momentum', 'accelerated', 'conservative'] as ForecastScenario[]).map((scenarioKey) => (
                    <button
                      key={scenarioKey}
                      type="button"
                      onClick={() => setForecastScenario(scenarioKey)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                        forecastScenario === scenarioKey
                          ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                      title={SCENARIO_LABELS[scenarioKey].description}
                    >
                      {SCENARIO_LABELS[scenarioKey].badge}
                    </button>
                  ))}
                </div>

                {/* Horizon Selector */}
                <div className="flex items-center gap-1 bg-white/95 p-0.5 rounded-lg border border-slate-200 text-xs shadow-2xs hidden md:flex">
                  <span className="text-[11px] font-semibold text-slate-500 pl-2 pr-1">Horizon:</span>
                  {[1, 2, 3].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setForecastHorizon(h)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                        forecastHorizon === h
                          ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                      title={`Project forward ${h} ${dateFilter.isQuarterly ? 'quarter(s)' : 'year(s)'}`}
                    >
                      +{h} {dateFilter.isQuarterly ? 'Q' : 'Yr'}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="hidden lg:inline text-slate-500">
              {showForecast
                ? 'Extrapolated via weighted run-rate of FY24–FY26 disclosures'
                : 'Showing audited historical series only'}
            </span>
          </div>
        </div>

        {/* Dynamic Recharts Visualization Container */}
        <div id="esg-trend-chart-container" className="h-[340px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {selectedMetricView === 'composite' ? (
              <AreaChart
                data={chartDataWithForecast}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    handleOpenBUBreakdown('esgScore', e.activePayload[0].payload as HistoricalESGData);
                  }
                }}
              >
                <defs>
                  <linearGradient id="esgScoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#003B73" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#003B73" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="yearLabel"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  domain={[50, 100]}
                  tickFormatter={(val) => `${val}%`}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip content={<ESGChartTooltip metricView={selectedMetricView} />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
                />
                <ReferenceLine
                  y={90}
                  stroke="#E31E24"
                  strokeDasharray="4 4"
                  label={{ value: 'SEBI BRSR Target (90%)', fill: '#E31E24', fontSize: 11, position: 'top' }}
                />
                <Area
                  type="monotone"
                  dataKey="esgScore"
                  name="MEIL ESG Composite Score"
                  stroke="#003B73"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#esgScoreGradient)"
                  dot={{ r: 5, fill: '#003B73', stroke: '#fff', strokeWidth: 2, cursor: 'pointer' }}
                  activeDot={{
                    r: 8,
                    cursor: 'pointer',
                    onClick: (_e: any, payload: any) => handleOpenBUBreakdown('esgScore', payload?.payload),
                  }}
                  onClick={(data: any) => handleOpenBUBreakdown('esgScore', data?.payload)}
                />
                {showForecast && (
                  <Line
                    type="monotone"
                    dataKey="forecastEsgScore"
                    name="Forecast (YTD Run-Rate)"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={{ r: 5, fill: '#0284c7', stroke: '#fff', strokeWidth: 2, cursor: 'pointer' }}
                    activeDot={{
                      r: 8,
                      cursor: 'pointer',
                      onClick: (_e: any, payload: any) => handleOpenBUBreakdown('esgScore', payload?.payload),
                    }}
                    onClick={(data: any) => handleOpenBUBreakdown('esgScore', data?.payload)}
                  />
                )}
              </AreaChart>
            ) : selectedMetricView === 'pillars' ? (
              <LineChart
                data={chartDataWithForecast}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    const key = (e.activePayload[0].dataKey as ESGMetricKey) || 'environmentalScore';
                    handleOpenBUBreakdown(key, e.activePayload[0].payload as HistoricalESGData);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="yearLabel"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  domain={[50, 100]}
                  tickFormatter={(val) => `${val}%`}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip content={<ESGChartTooltip metricView={selectedMetricView} />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="environmentalScore"
                  name="Environmental (P2, P6)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4.5, fill: '#10b981', stroke: '#fff', strokeWidth: 2, cursor: 'pointer' }}
                  activeDot={{
                    r: 7.5,
                    cursor: 'pointer',
                    onClick: (_e: any, payload: any) => handleOpenBUBreakdown('environmentalScore', payload?.payload),
                  }}
                  onClick={(data: any) => handleOpenBUBreakdown('environmentalScore', data?.payload)}
                />
                {showForecast && (
                  <Line
                    type="monotone"
                    dataKey="forecastEnvironmentalScore"
                    name="Environmental (Forecast)"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 4.5, fill: '#10b981', stroke: '#fff', strokeWidth: 1.5, cursor: 'pointer' }}
                    activeDot={{
                      r: 7.5,
                      cursor: 'pointer',
                      onClick: (_e: any, payload: any) => handleOpenBUBreakdown('environmentalScore', payload?.payload),
                    }}
                    onClick={(data: any) => handleOpenBUBreakdown('environmentalScore', data?.payload)}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="socialScore"
                  name="Social (P3, P4, P5, P8, P9)"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4.5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2, cursor: 'pointer' }}
                  activeDot={{
                    r: 7.5,
                    cursor: 'pointer',
                    onClick: (_e: any, payload: any) => handleOpenBUBreakdown('socialScore', payload?.payload),
                  }}
                  onClick={(data: any) => handleOpenBUBreakdown('socialScore', data?.payload)}
                />
                {showForecast && (
                  <Line
                    type="monotone"
                    dataKey="forecastSocialScore"
                    name="Social (Forecast)"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 4.5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 1.5, cursor: 'pointer' }}
                    activeDot={{
                      r: 7.5,
                      cursor: 'pointer',
                      onClick: (_e: any, payload: any) => handleOpenBUBreakdown('socialScore', payload?.payload),
                    }}
                    onClick={(data: any) => handleOpenBUBreakdown('socialScore', data?.payload)}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="governanceScore"
                  name="Governance (P1, P7)"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  dot={{ r: 4.5, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2, cursor: 'pointer' }}
                  activeDot={{
                    r: 7.5,
                    cursor: 'pointer',
                    onClick: (_e: any, payload: any) => handleOpenBUBreakdown('governanceScore', payload?.payload),
                  }}
                  onClick={(data: any) => handleOpenBUBreakdown('governanceScore', data?.payload)}
                />
                {showForecast && (
                  <Line
                    type="monotone"
                    dataKey="forecastGovernanceScore"
                    name="Governance (Forecast)"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 4.5, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 1.5, cursor: 'pointer' }}
                    activeDot={{
                      r: 7.5,
                      cursor: 'pointer',
                      onClick: (_e: any, payload: any) => handleOpenBUBreakdown('governanceScore', payload?.payload),
                    }}
                    onClick={(data: any) => handleOpenBUBreakdown('governanceScore', data?.payload)}
                  />
                )}
              </LineChart>
            ) : selectedMetricView === 'decarbonization' ? (
              <LineChart
                data={chartDataWithForecast}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    handleOpenBUBreakdown('ghgIntensity', e.activePayload[0].payload as HistoricalESGData);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="yearLabel"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  domain={[12, 30]}
                  tickFormatter={(val) => `${val} tCO2e`}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip content={<ESGChartTooltip metricView={selectedMetricView} />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
                />
                <ReferenceLine
                  y={20}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{ value: 'Target Intensity (< 20.0)', fill: '#b45309', fontSize: 11, position: 'top' }}
                />
                <Line
                  type="monotone"
                  dataKey="ghgIntensity"
                  name="GHG Intensity (tCO2e / Cr)"
                  stroke="#e11d48"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#e11d48', stroke: '#fff', strokeWidth: 2, cursor: 'pointer' }}
                  activeDot={{
                    r: 8,
                    cursor: 'pointer',
                    onClick: (_e: any, payload: any) => handleOpenBUBreakdown('ghgIntensity', payload?.payload),
                  }}
                  onClick={(data: any) => handleOpenBUBreakdown('ghgIntensity', data?.payload)}
                />
                {showForecast && (
                  <Line
                    type="monotone"
                    dataKey="forecastGhgIntensity"
                    name="GHG Intensity Forecast (YTD Path)"
                    stroke="#e11d48"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={{ r: 5, fill: '#e11d48', stroke: '#fff', strokeWidth: 2, cursor: 'pointer' }}
                    activeDot={{
                      r: 8,
                      cursor: 'pointer',
                      onClick: (_e: any, payload: any) => handleOpenBUBreakdown('ghgIntensity', payload?.payload),
                    }}
                    onClick={(data: any) => handleOpenBUBreakdown('ghgIntensity', data?.payload)}
                  />
                )}
              </LineChart>
            ) : selectedMetricView === 'circularity' ? (
              <LineChart
                data={chartDataWithForecast}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    const key = (e.activePayload[0].dataKey as ESGMetricKey) || 'renewableRatio';
                    handleOpenBUBreakdown(key, e.activePayload[0].payload as HistoricalESGData);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="yearLabel"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  domain={[10, 100]}
                  tickFormatter={(val) => `${val}%`}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip content={<ESGChartTooltip metricView={selectedMetricView} />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="renewableRatio"
                  name="Renewable Energy Share (%)"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 4.5, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2, cursor: 'pointer' }}
                  activeDot={{
                    r: 7.5,
                    cursor: 'pointer',
                    onClick: (_e: any, payload: any) => handleOpenBUBreakdown('renewableRatio', payload?.payload),
                  }}
                  onClick={(data: any) => handleOpenBUBreakdown('renewableRatio', data?.payload)}
                />
                {showForecast && (
                  <Line
                    type="monotone"
                    dataKey="forecastRenewableRatio"
                    name="Renewable Share (Forecast)"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 4.5, fill: '#f59e0b', stroke: '#fff', strokeWidth: 1.5, cursor: 'pointer' }}
                    activeDot={{
                      r: 7.5,
                      cursor: 'pointer',
                      onClick: (_e: any, payload: any) => handleOpenBUBreakdown('renewableRatio', payload?.payload),
                    }}
                    onClick={(data: any) => handleOpenBUBreakdown('renewableRatio', data?.payload)}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="waterRecycledRatio"
                  name="Water Recycled (%)"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  dot={{ r: 4.5, fill: '#0284c7', stroke: '#fff', strokeWidth: 2, cursor: 'pointer' }}
                  activeDot={{
                    r: 7.5,
                    cursor: 'pointer',
                    onClick: (_e: any, payload: any) => handleOpenBUBreakdown('waterRecycledRatio', payload?.payload),
                  }}
                  onClick={(data: any) => handleOpenBUBreakdown('waterRecycledRatio', data?.payload)}
                />
                {showForecast && (
                  <Line
                    type="monotone"
                    dataKey="forecastWaterRecycledRatio"
                    name="Water Recycled (Forecast)"
                    stroke="#0284c7"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 4.5, fill: '#0284c7', stroke: '#fff', strokeWidth: 1.5, cursor: 'pointer' }}
                    activeDot={{
                      r: 7.5,
                      cursor: 'pointer',
                      onClick: (_e: any, payload: any) => handleOpenBUBreakdown('waterRecycledRatio', payload?.payload),
                    }}
                    onClick={(data: any) => handleOpenBUBreakdown('waterRecycledRatio', data?.payload)}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="wasteRecycled"
                  name="Debris Recycled (%)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4.5, fill: '#10b981', stroke: '#fff', strokeWidth: 2, cursor: 'pointer' }}
                  activeDot={{
                    r: 7.5,
                    cursor: 'pointer',
                    onClick: (_e: any, payload: any) => handleOpenBUBreakdown('wasteRecycled', payload?.payload),
                  }}
                  onClick={(data: any) => handleOpenBUBreakdown('wasteRecycled', data?.payload)}
                />
                {showForecast && (
                  <Line
                    type="monotone"
                    dataKey="forecastWasteRecycled"
                    name="Debris Recycled (Forecast)"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 4.5, fill: '#10b981', stroke: '#fff', strokeWidth: 1.5, cursor: 'pointer' }}
                    activeDot={{
                      r: 7.5,
                      cursor: 'pointer',
                      onClick: (_e: any, payload: any) => handleOpenBUBreakdown('wasteRecycled', payload?.payload),
                    }}
                    onClick={(data: any) => handleOpenBUBreakdown('wasteRecycled', data?.payload)}
                  />
                )}
              </LineChart>
            ) : (
              <LineChart
                data={chartDataWithForecast}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    handleOpenBUBreakdown('ltifr', e.activePayload[0].payload as HistoricalESGData);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="yearLabel"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  domain={[0, 0.35]}
                  tickFormatter={(val) => `${val}`}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip content={<ESGChartTooltip metricView={selectedMetricView} />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
                />
                <ReferenceLine
                  y={0.10}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  label={{ value: 'Zero Harm Benchmark (< 0.10)', fill: '#059669', fontSize: 11, position: 'top' }}
                />
                <Line
                  type="monotone"
                  dataKey="ltifr"
                  name="Lost Time Injury Rate (LTIFR)"
                  stroke="#d97706"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#d97706', stroke: '#fff', strokeWidth: 2, cursor: 'pointer' }}
                  activeDot={{
                    r: 8,
                    cursor: 'pointer',
                    onClick: (_e: any, payload: any) => handleOpenBUBreakdown('ltifr', payload?.payload),
                  }}
                  onClick={(data: any) => handleOpenBUBreakdown('ltifr', data?.payload)}
                />
                {showForecast && (
                  <Line
                    type="monotone"
                    dataKey="forecastLtifr"
                    name="LTIFR Forecast (Zero Harm Path)"
                    stroke="#d97706"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={{ r: 5, fill: '#d97706', stroke: '#fff', strokeWidth: 2, cursor: 'pointer' }}
                    activeDot={{
                      r: 8,
                      cursor: 'pointer',
                      onClick: (_e: any, payload: any) => handleOpenBUBreakdown('ltifr', payload?.payload),
                    }}
                    onClick={(data: any) => handleOpenBUBreakdown('ltifr', data?.payload)}
                  />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* 4 Bottom Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 font-semibold block">5-Year ESG Score Lift</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xl font-black text-slate-900">+33.4%</span>
              <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold text-[10px] flex items-center">
                <ArrowUpRight className="w-3 h-3" />
                FY22 to FY26
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">From 62.4% baseline to 95.8% present.</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 font-semibold block">Carbon Decarbonization</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xl font-black text-slate-900">-32.1%</span>
              <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold text-[10px] flex items-center">
                <ArrowDownRight className="w-3 h-3" />
                Intensity Decline
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Reduced from 26.8 to 18.2 tCO2e / Cr.</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 font-semibold block">Renewable Power Mix</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xl font-black text-slate-900">32.1%</span>
              <span className="text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-bold text-[10px] flex items-center">
                <ArrowUpRight className="w-3 h-3" />
                +19.7% Growth
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Driven by 500MW Pavagada Solar.</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 font-semibold block">HSE Safety Record</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xl font-black text-slate-900">0.08</span>
              <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold text-[10px] flex items-center">
                <CheckCircle2 className="w-3 h-3" />
                Zero Fatalities
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">LTIFR achieved international benchmark.</p>
          </div>
        </div>
      </div>

      {/* Analytical Pillars & Section Deep Dive */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
          Pillar-wise Executive Reviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1: Environmental */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-800">Environmental Pillar</h3>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  94.1% Approved
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Reported Water Consumption</span>
                  <span className="font-bold text-slate-800">{waterData > 0 ? `${waterData.toLocaleString()} KL` : '1,240,000 KL'}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Reported Energy Consumption</span>
                  <span className="font-bold text-slate-800">{energyData > 0 ? `${energyData.toLocaleString()} MWh` : '218,700 GJ'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Scope 1 &amp; 2 Carbon Intensity</span>
                  <span className="font-bold text-emerald-600">18.2 tCO2e / Cr</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/management/environmental')}
                className="w-full text-center text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50/70 hover:bg-indigo-100 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Inspect Environmental Metrics →
              </button>
            </div>
          </div>

          {/* Pillar 2: Social */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-800">Social Pillar</h3>
                </div>
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                  96.2% Approved
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Active Site Workforce</span>
                  <span className="font-bold text-slate-800">38,420 Personnel</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Occupational Safety (LTIFR)</span>
                  <span className="font-bold text-emerald-600">0.08 (Zero Fatality)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">CSR Outlay (Schedule VII)</span>
                  <span className="font-bold text-slate-800">₹84.6 Cr Invested</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/management/social')}
                className="w-full text-center text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50/70 hover:bg-indigo-100 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Inspect Social &amp; Safety Metrics →
              </button>
            </div>
          </div>

          {/* Pillar 3: Governance */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-800">Governance Pillar</h3>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  97.5% Approved
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Board Independence Ratio</span>
                  <span className="font-bold text-slate-800">50.0% Independent</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Anti-Bribery Incidents</span>
                  <span className="font-bold text-emerald-600">0 Reported (100% Clear)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Audited Supplier Codes</span>
                  <span className="font-bold text-slate-800">480 Suppliers Sign-Off</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/management/governance')}
                className="w-full text-center text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50/70 hover:bg-indigo-100 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Inspect Corporate Governance →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Business Unit Drill-Down Modal for Data Points */}
      {selectedDrillDownPoint && (
        <BusinessUnitBreakdownModal
          isOpen={isBUModalOpen}
          onClose={() => setIsBUModalOpen(false)}
          metricKey={selectedDrillDownMetric}
          dataPoint={selectedDrillDownPoint}
          allDataPoints={showForecast ? chartDataWithForecast : filteredESGMetrics}
          onSelectDataPoint={(point) => setSelectedDrillDownPoint(point)}
          onSelectMetricKey={(key) => setSelectedDrillDownMetric(key)}
        />
      )}

      {/* Export ESG Report Modal (PDF & Excel) */}
      <ESGReportExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        dateFilter={dateFilter}
        selectedMetricView={selectedMetricView}
        filteredESGMetrics={showForecast ? chartDataWithForecast : filteredESGMetrics}
        executiveStats={{
          completionPercentage,
          approvedAssignments,
          totalAssignments,
          pendingReviews,
          openRisks,
          targetsOffTrack: pendingApprovals,
          signOffStatus: 'Ready (Prerequisites Met)',
        }}
      />
    </div>
  );
};
