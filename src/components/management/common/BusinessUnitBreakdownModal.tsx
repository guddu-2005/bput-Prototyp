import React, { useState, useMemo } from 'react';
import {
  X,
  Building2,
  ChevronLeft,
  ChevronRight,
  Download,
  Check,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  AlertTriangle,
  Award,
  Factory,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

export interface HistoricalESGData {
  fiscalYear: string;
  yearLabel: string;
  esgScore?: number;
  environmentalScore?: number;
  socialScore?: number;
  governanceScore?: number;
  ghgIntensity?: number;
  renewableRatio?: number;
  waterRecycledRatio?: number;
  ltifr?: number;
  wasteRecycled?: number;
  isForecast?: boolean;
  isTransitionPoint?: boolean;
  scenario?: 'ytd_momentum' | 'accelerated' | 'conservative';
  modelConfidence?: number;
  confidenceLow?: number;
  confidenceHigh?: number;
  forecastEsgScore?: number;
  forecastEnvironmentalScore?: number;
  forecastSocialScore?: number;
  forecastGovernanceScore?: number;
  forecastGhgIntensity?: number;
  forecastRenewableRatio?: number;
  forecastWaterRecycledRatio?: number;
  forecastWasteRecycled?: number;
  forecastLtifr?: number;
}

export type ESGMetricKey =
  | 'esgScore'
  | 'environmentalScore'
  | 'socialScore'
  | 'governanceScore'
  | 'ghgIntensity'
  | 'renewableRatio'
  | 'waterRecycledRatio'
  | 'wasteRecycled'
  | 'ltifr';

export interface BusinessUnitBreakdownItem {
  id: string;
  name: string;
  code: string;
  subsidiary: 'MEIL Infrastructure Ltd' | 'MEIL Clean Energy Ltd';
  sector: string;
  metricValue: number;
  unit: string;
  weightPercent: number; // Share of Group Total
  targetVariance: number; // % variance vs target or prior period
  isVariancePositive: boolean; // whether current performance is favourable
  status: 'Exceeding' | 'On Track' | 'Needs Attention' | 'Critical Review';
  keyProject: string;
  leadOfficer: string;
  location: string;
  auditorVerification: 'Verified (Deloitte)' | 'Internal Sign-off' | 'Assurance Pending';
}

interface BusinessUnitBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricKey: ESGMetricKey;
  dataPoint: HistoricalESGData;
  allDataPoints?: HistoricalESGData[];
  onSelectDataPoint?: (point: HistoricalESGData) => void;
  onSelectMetricKey?: (key: ESGMetricKey) => void;
}

// Metric metadata dictionary
const METRIC_CONFIG: Record<
  ESGMetricKey,
  {
    name: string;
    unit: string;
    category: string;
    targetBenchmark: number;
    targetDescription: string;
    isLowerBetter: boolean;
    color: string;
    description: string;
  }
> = {
  esgScore: {
    name: 'Composite BRSR ESG Score',
    unit: '%',
    category: 'Group Composite',
    targetBenchmark: 90.0,
    targetDescription: 'SEBI Leadership Target: ≥ 90.0%',
    isLowerBetter: false,
    color: '#003B73',
    description: 'Consolidated weighted score across all 9 BRSR Principles (Core + Comprehensive).',
  },
  environmentalScore: {
    name: 'Environmental Pillar (P2, P6)',
    unit: '%',
    category: 'Triple Bottom Line',
    targetBenchmark: 88.0,
    targetDescription: 'SEBI Green Threshold: ≥ 88.0%',
    isLowerBetter: false,
    color: '#10b981',
    description: 'Resource efficiency, decarbonization, water recycling, and biodiversity protection.',
  },
  socialScore: {
    name: 'Social Pillar (P3, P4, P5, P8, P9)',
    unit: '%',
    category: 'Triple Bottom Line',
    targetBenchmark: 90.0,
    targetDescription: 'SEBI Human Capital Target: ≥ 90.0%',
    isLowerBetter: false,
    color: '#3b82f6',
    description: 'Occupational health & safety, labor welfare, human rights, and CSR outreach.',
  },
  governanceScore: {
    name: 'Governance Pillar (P1, P7)',
    unit: '%',
    category: 'Triple Bottom Line',
    targetBenchmark: 95.0,
    targetDescription: 'SEBI Board Mandate: ≥ 95.0%',
    isLowerBetter: false,
    color: '#8b5cf6',
    description: 'Anti-corruption, transparency, board oversight, and regulatory filings.',
  },
  ghgIntensity: {
    name: 'GHG Emission Intensity',
    unit: 'tCO2e / Cr',
    category: 'Decarbonization',
    targetBenchmark: 20.0,
    targetDescription: 'National Net-Zero Pathway: < 20.0 tCO2e/Cr',
    isLowerBetter: true,
    color: '#e11d48',
    description: 'Scope 1 + Scope 2 emissions normalized by consolidated turnover in ₹ Crores.',
  },
  renewableRatio: {
    name: 'Renewable Power Share',
    unit: '%',
    category: 'Clean Energy',
    targetBenchmark: 30.0,
    targetDescription: 'Corporate Green Tariff Goal: ≥ 30.0%',
    isLowerBetter: false,
    color: '#f59e0b',
    description: 'Percentage of total kilowatt-hour electrical consumption derived from solar & wind.',
  },
  waterRecycledRatio: {
    name: 'Water Recycled & Reused',
    unit: '%',
    category: 'Circularity',
    targetBenchmark: 40.0,
    targetDescription: 'CGWA Zero Liquid Discharge: ≥ 40.0%',
    isLowerBetter: false,
    color: '#0284c7',
    description: 'Effluent and storm run-off treated via site STPs/ETPs for construction batching.',
  },
  wasteRecycled: {
    name: 'Construction Debris Recycled',
    unit: '%',
    category: 'Circularity',
    targetBenchmark: 85.0,
    targetDescription: 'MoEFCC C&D Waste Rules: ≥ 85.0%',
    isLowerBetter: false,
    color: '#059669',
    description: 'Muck, excavated aggregates, and demolished pavement reused in sub-base paving.',
  },
  ltifr: {
    name: 'Lost Time Injury Frequency Rate (LTIFR)',
    unit: 'per mn hrs',
    category: 'Safety & HSE',
    targetBenchmark: 0.10,
    targetDescription: 'Zero Harm World-Class Benchmark: < 0.10',
    isLowerBetter: true,
    color: '#d97706',
    description: 'Number of lost-time workplace injuries per one million man-hours worked.',
  },
};

// Base Business Units profiles with multiplier scaling functions across reporting periods
const BU_DEFINITIONS = [
  {
    id: 'bu_solar',
    code: 'BU-REN-01',
    name: 'Solar, Wind & Renewable Power BU',
    subsidiary: 'MEIL Clean Energy Ltd' as const,
    sector: 'Clean Energy & Utilities',
    keyProject: 'Pavagada 500MW Solar Park & Western Wind Corridor',
    leadOfficer: 'Vikram Joshi (VP, Clean Energy)',
    location: 'Tumakuru, Karnataka',
    weight: 18,
    metricScales: {
      esgScore: 1.025,
      environmentalScore: 1.045,
      socialScore: 1.01,
      governanceScore: 1.015,
      ghgIntensity: 0.26, // Very low carbon
      renewableRatio: 2.76, // Highest renewable
      waterRecycledRatio: 1.36,
      wasteRecycled: 0.97,
      ltifr: 0.25, // Extremely safe
    },
  },
  {
    id: 'bu_hydro',
    code: 'BU-HYD-02',
    name: 'Hydroelectric & Pumped Storage BU',
    subsidiary: 'MEIL Clean Energy Ltd' as const,
    sector: 'Hydroelectric Power',
    keyProject: 'Kundah 500MW Pumped Storage & Subansiri Lower HE',
    leadOfficer: 'D. K. Sharma (Chief Engineer, Hydro)',
    location: 'Nilgiris, Tamil Nadu',
    weight: 16,
    metricScales: {
      esgScore: 1.005,
      environmentalScore: 1.02,
      socialScore: 0.99,
      governanceScore: 1.00,
      ghgIntensity: 0.40,
      renewableRatio: 2.24,
      waterRecycledRatio: 1.21,
      wasteRecycled: 1.01,
      ltifr: 0.50,
    },
  },
  {
    id: 'bu_irrigation',
    code: 'BU-WTR-03',
    name: 'Water, Irrigation & Lift Irrigation BU',
    subsidiary: 'MEIL Infrastructure Ltd' as const,
    sector: 'Water Infrastructure',
    keyProject: 'Kaleshwaram Lift Irrigation Site 4 & Polavaram Pumps',
    leadOfficer: 'Ananya Roy (Environmental Officer)',
    location: 'Jayashankar Bhupalpally, Telangana',
    weight: 24,
    metricScales: {
      esgScore: 1.0,
      environmentalScore: 1.005,
      socialScore: 1.002,
      governanceScore: 1.0,
      ghgIntensity: 1.09,
      renewableRatio: 0.88,
      waterRecycledRatio: 1.51, // Very high water efficiency
      wasteRecycled: 0.99,
      ltifr: 1.00,
    },
  },
  {
    id: 'bu_urban',
    code: 'BU-URB-04',
    name: 'Urban Metros & High-Speed Rail BU',
    subsidiary: 'MEIL Infrastructure Ltd' as const,
    sector: 'Mass Transit & Bridges',
    keyProject: 'Ahmedabad Metro Rail Phase-2 & Thane Creek Viaduct',
    leadOfficer: 'Meenakshi Sundaram (Civil Director)',
    location: 'Ahmedabad, Gujarat',
    weight: 15,
    metricScales: {
      esgScore: 0.995,
      environmentalScore: 0.99,
      socialScore: 1.015,
      governanceScore: 0.995,
      ghgIntensity: 0.90,
      renewableRatio: 0.77,
      waterRecycledRatio: 0.83,
      wasteRecycled: 1.02,
      ltifr: 0.88,
    },
  },
  {
    id: 'bu_highways',
    code: 'BU-ROD-05',
    name: 'Roads, Tunnels & Expressways BU',
    subsidiary: 'MEIL Infrastructure Ltd' as const,
    sector: 'Transportation Infrastructure',
    keyProject: 'Raipur-Visakhapatnam Expressway & Zojila Pass Approach',
    leadOfficer: 'Suresh Kumar (Site Incharge)',
    location: 'Raipur / Koraput Corridor',
    weight: 17,
    metricScales: {
      esgScore: 0.985,
      environmentalScore: 0.975,
      socialScore: 0.995,
      governanceScore: 1.005,
      ghgIntensity: 1.24, // High diesel machinery
      renewableRatio: 0.57,
      waterRecycledRatio: 0.63,
      wasteRecycled: 1.05, // Highest pavement & RAP reuse
      ltifr: 1.38,
    },
  },
  {
    id: 'bu_hydrocarbons',
    code: 'BU-PET-06',
    name: 'Hydrocarbons, Gas & Process EPC BU',
    subsidiary: 'MEIL Infrastructure Ltd' as const,
    sector: 'Industrial Process EPC',
    keyProject: 'Assam Petrochemicals & City Gas Distribution Grid',
    leadOfficer: 'Tariq Ahmed (VP, Process Safety & ESG)',
    location: 'Namrup, Assam',
    weight: 10,
    metricScales: {
      esgScore: 0.965,
      environmentalScore: 0.94,
      socialScore: 0.975,
      governanceScore: 0.98,
      ghgIntensity: 1.57, // Energy intensive thermal
      renewableRatio: 0.39,
      waterRecycledRatio: 1.04,
      wasteRecycled: 0.94,
      ltifr: 1.50,
    },
  },
];

export const BusinessUnitBreakdownModal: React.FC<BusinessUnitBreakdownModalProps> = ({
  isOpen,
  onClose,
  metricKey,
  dataPoint,
  allDataPoints = [],
  onSelectDataPoint,
  onSelectMetricKey,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'value' | 'name' | 'variance' | 'status'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const config = METRIC_CONFIG[metricKey] || METRIC_CONFIG.esgScore;
  const forecastKey = (`forecast${metricKey.charAt(0).toUpperCase() + metricKey.slice(1)}` as keyof HistoricalESGData);
  const groupValue = (dataPoint[metricKey] as number) ?? (dataPoint[forecastKey] as number) ?? 0;

  // Compute specific BU breakdown items for the chosen metric and reporting data point
  const breakdownItems: BusinessUnitBreakdownItem[] = useMemo(() => {
    return BU_DEFINITIONS.map((bu) => {
      const scale = bu.metricScales[metricKey] ?? 1.0;
      let rawValue = groupValue * scale;

      // Adjust percentages to stay within [0, 100] bounds
      if (['esgScore', 'environmentalScore', 'socialScore', 'governanceScore', 'renewableRatio', 'waterRecycledRatio', 'wasteRecycled'].includes(metricKey)) {
        rawValue = Math.min(100, Math.max(0, rawValue));
      }

      // Format rounding: LTIFR to 2 decimals, others to 1 decimal
      const formattedValue = metricKey === 'ltifr' ? Math.round(rawValue * 100) / 100 : Math.round(rawValue * 10) / 10;

      // Calculate variance against benchmark
      const target = config.targetBenchmark;
      let variance = 0;
      let isFavourable = false;

      if (config.isLowerBetter) {
        // Lower is better (e.g. GHG Intensity, LTIFR)
        variance = Math.round(((formattedValue - target) / target) * 1000) / 10;
        isFavourable = formattedValue <= target;
      } else {
        // Higher is better (e.g. ESG score, recycling rates)
        variance = Math.round(((formattedValue - target) / target) * 1000) / 10;
        isFavourable = formattedValue >= target;
      }

      // Status classification
      let status: BusinessUnitBreakdownItem['status'] = 'On Track';
      if (config.isLowerBetter) {
        if (formattedValue <= target * 0.7) status = 'Exceeding';
        else if (formattedValue <= target) status = 'On Track';
        else if (formattedValue <= target * 1.25) status = 'Needs Attention';
        else status = 'Critical Review';
      } else {
        if (formattedValue >= target * 1.06) status = 'Exceeding';
        else if (formattedValue >= target * 0.98) status = 'On Track';
        else if (formattedValue >= target * 0.88) status = 'Needs Attention';
        else status = 'Critical Review';
      }

      // Assurer badge logic
      const auditorVerification: BusinessUnitBreakdownItem['auditorVerification'] =
        bu.id === 'bu_solar' || bu.id === 'bu_irrigation' || bu.id === 'bu_hydro'
          ? 'Verified (Deloitte)'
          : bu.id === 'bu_highways' || bu.id === 'bu_urban'
          ? 'Internal Sign-off'
          : 'Assurance Pending';

      return {
        id: bu.id,
        name: bu.name,
        code: bu.code,
        subsidiary: bu.subsidiary,
        sector: bu.sector,
        metricValue: formattedValue,
        unit: config.unit,
        weightPercent: bu.weight,
        targetVariance: variance,
        isVariancePositive: isFavourable,
        status,
        keyProject: bu.keyProject,
        leadOfficer: bu.leadOfficer,
        location: bu.location,
        auditorVerification,
      };
    });
  }, [metricKey, groupValue, config]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    return breakdownItems
      .filter((item) => {
        const matchesQuery =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.keyProject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.leadOfficer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubsidiary =
          selectedSubsidiary === 'all' || item.subsidiary === selectedSubsidiary;
        return matchesQuery && matchesSubsidiary;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'value') {
          diff = a.metricValue - b.metricValue;
        } else if (sortBy === 'name') {
          diff = a.name.localeCompare(b.name);
        } else if (sortBy === 'variance') {
          diff = a.targetVariance - b.targetVariance;
        } else if (sortBy === 'status') {
          diff = a.status.localeCompare(b.status);
        }
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [breakdownItems, searchQuery, selectedSubsidiary, sortBy, sortOrder]);

  // Chart data for horizontal comparison
  const chartData = useMemo(() => {
    return breakdownItems.map((item) => ({
      name: item.name.replace(' BU', ''),
      shortName: item.code,
      value: item.metricValue,
      status: item.status,
      isFavourable: item.isVariancePositive,
    }));
  }, [breakdownItems]);

  if (!isOpen) return null;

  // Period navigation helpers
  const currentPeriodIndex = allDataPoints.findIndex(
    (p) => p.yearLabel === dataPoint.yearLabel
  );
  const prevPeriod = currentPeriodIndex > 0 ? allDataPoints[currentPeriodIndex - 1] : null;
  const nextPeriod =
    currentPeriodIndex !== -1 && currentPeriodIndex < allDataPoints.length - 1
      ? allDataPoints[currentPeriodIndex + 1]
      : null;

  const handleCopySummary = () => {
    const csvContent = [
      `Business Unit Breakdown - ${config.name} (${dataPoint.fiscalYear})`,
      `Group Consolidated Value: ${groupValue} ${config.unit} | Target Benchmark: ${config.targetBenchmark} ${config.unit}`,
      '',
      'BU Code,Business Unit,Subsidiary,Metric Value,Unit,Group Weight (%),Target Variance (%),BRSR Status,Flagship Project,Lead Officer',
      ...breakdownItems.map(
        (b) =>
          `"${b.code}","${b.name}","${b.subsidiary}",${b.metricValue},"${b.unit}",${b.weightPercent}%,${b.targetVariance}%,${b.status},"${b.keyProject}","${b.leadOfficer}"`
      ),
    ].join('\n');

    navigator.clipboard.writeText(csvContent);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="bg-[#003B73] text-white px-6 py-4 flex items-center justify-between border-b border-sky-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {dataPoint.isForecast ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/40">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Forecast Projection ({dataPoint.modelConfidence || 92}% Confidence)
                  </span>
                ) : (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                    Data Point Drill-Down
                  </span>
                )}
                <span className="text-white/40">·</span>
                <span className="text-xs text-slate-200 font-medium">{dataPoint.fiscalYear}</span>
              </div>
              <h2 id="modal-headline" className="text-lg font-bold text-white flex items-center gap-2">
                <span>{config.name}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/20 text-white">
                  {config.unit}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Period Navigator */}
            <div className="hidden sm:flex items-center bg-white/10 rounded-lg p-0.5 border border-white/15 text-xs">
              <button
                type="button"
                disabled={!prevPeriod}
                onClick={() => prevPeriod && onSelectDataPoint?.(prevPeriod)}
                title="View previous reporting period"
                className="px-2 py-1 rounded text-white/80 hover:text-white hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{prevPeriod ? prevPeriod.yearLabel : 'Prior'}</span>
              </button>
              <div className="w-px h-4 bg-white/20" />
              <button
                type="button"
                disabled={!nextPeriod}
                onClick={() => nextPeriod && onSelectDataPoint?.(nextPeriod)}
                title="View next reporting period"
                className="px-2 py-1 rounded text-white/80 hover:text-white hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{nextPeriod ? nextPeriod.yearLabel : 'Next'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metric Quick Switcher Tabs */}
        {onSelectMetricKey && (
          <div className="bg-slate-100/90 px-6 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider mr-1 shrink-0">
              Switch Metric:
            </span>
            {(
              [
                'esgScore',
                'environmentalScore',
                'socialScore',
                'governanceScore',
                'ghgIntensity',
                'renewableRatio',
                'waterRecycledRatio',
                'wasteRecycled',
                'ltifr',
              ] as ESGMetricKey[]
            ).map((key) => {
              const meta = METRIC_CONFIG[key];
              const isActive = key === metricKey;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectMetricKey(key)}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#003B73] font-bold shadow-xs border border-slate-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  {meta.name.split(' (')[0]}
                </button>
              );
            })}
          </div>
        )}

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {/* Predictive Model Explanatory Banner for Forecast Data Points */}
          {dataPoint.isForecast && (
            <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 flex items-start gap-3 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-amber-700" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <span>YTD Predictive Run-Rate Allocation ({dataPoint.yearLabel})</span>
                  <span className="text-[10px] bg-amber-200/80 text-amber-900 font-semibold px-2 py-0.5 rounded-full border border-amber-300">
                    Confidence: {dataPoint.modelConfidence || 92}%
                  </span>
                </div>
                <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
                  These Business Unit figures represent forecasted targets derived from current FY26 YTD execution momentum, energy transition capex pipelines, and unit-level efficiency run-rates across MEIL's 6 accredited operating units.
                </p>
              </div>
            </div>
          )}

          {/* Executive KPI Summary Banner */}
          <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:border-r sm:border-slate-100 sm:pr-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Consolidated Group Result
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900">
                  {groupValue}
                  <span className="text-sm font-semibold text-slate-500 ml-1">{config.unit}</span>
                </span>
                {dataPoint.isForecast ? (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    {dataPoint.yearLabel} (Forecast)
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                    {dataPoint.yearLabel} Audited
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{config.description}</p>
            </div>

            <div className="sm:border-r sm:border-slate-100 sm:pr-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Regulatory / Internal Benchmark
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-slate-800">
                  {config.targetBenchmark} {config.unit}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{config.targetDescription}</p>
            </div>

            <div className="sm:border-r sm:border-slate-100 sm:pr-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Compliance Alignment
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                {groupValue >= config.targetBenchmark !== config.isLowerBetter ? (
                  <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Target Achieved
                  </span>
                ) : (
                  <span className="text-rose-700 bg-rose-50 border border-rose-200 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Attention Required
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                6 Business Units reporting under BRSR Principle 6 &amp; Core.
              </p>
            </div>

            <div className="flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Reporting Actions
              </span>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  {copiedNotification ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">CSV Copied!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-slate-600" />
                      <span>Export BU CSV</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Visual Business Unit Comparison Bar Chart */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span>Business Unit Performance Comparison</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison against group benchmark of {config.targetBenchmark} {config.unit} (dashed line)
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-xs bg-[#003B73]" />
                  <span>High Alignment</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-xs bg-amber-500" />
                  <span>Moderate</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-xs bg-rose-500" />
                  <span>Variance Risk</span>
                </span>
              </div>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(val) => `${val} ${config.unit}`}
                  />
                  <YAxis
                    dataKey="shortName"
                    type="category"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-[#0B1D33] text-white p-2.5 rounded-lg border border-sky-500/30 text-xs shadow-xl">
                            <p className="font-bold text-sky-300">{d.name}</p>
                            <p className="text-white mt-1">
                              Value:{' '}
                              <span className="font-mono font-bold text-emerald-400">
                                {d.value} {config.unit}
                              </span>
                            </p>
                            <p className="text-slate-300 text-[11px]">
                              Status: <span className="font-semibold">{d.status}</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    x={config.targetBenchmark}
                    stroke="#dc2626"
                    strokeDasharray="4 4"
                    label={{
                      value: `Target (${config.targetBenchmark})`,
                      fill: '#dc2626',
                      fontSize: 10,
                      position: 'top',
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => {
                      let color = '#003B73';
                      if (entry.status === 'Exceeding') color = '#059669';
                      else if (entry.status === 'On Track') color = '#0284c7';
                      else if (entry.status === 'Needs Attention') color = '#d97706';
                      else color = '#e11d48';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Business Units Breakdown Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Filter toolbar */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by BU, site, project, or lead officer..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>Subsidiary:</span>
                </div>
                <select
                  value={selectedSubsidiary}
                  onChange={(e) => setSelectedSubsidiary(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700"
                >
                  <option value="all">All Subsidiaries (6 BUs)</option>
                  <option value="MEIL Infrastructure Ltd">MEIL Infrastructure Ltd</option>
                  <option value="MEIL Clean Energy Ltd">MEIL Clean Energy Ltd</option>
                </select>

                <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

                {/* Sort control */}
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700"
                >
                  <option value="value-desc">Sort by Value (High to Low)</option>
                  <option value="value-asc">Sort by Value (Low to High)</option>
                  <option value="name-asc">Sort by BU Name (A to Z)</option>
                  <option value="variance-desc">Sort by Target Variance</option>
                  <option value="status-asc">Sort by BRSR Status</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Business Unit &amp; Sector</th>
                    <th className="py-3 px-4">Subsidiary</th>
                    <th className="py-3 px-4 text-right">
                      {config.name} ({config.unit})
                    </th>
                    <th className="py-3 px-4 text-center">Group Weight</th>
                    <th className="py-3 px-4 text-center">Variance vs Target</th>
                    <th className="py-3 px-4 text-center">BRSR Status</th>
                    <th className="py-3 px-4">Flagship Project &amp; Site Lead</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAndSortedItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No business units matching your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{item.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <span className="font-mono text-slate-400">{item.code}</span>
                            <span>·</span>
                            <span>{item.sector}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-slate-700 font-medium">{item.subsidiary}</span>
                          <span className="block text-[10px] text-slate-400">{item.location}</span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <span className="font-mono text-sm font-bold text-slate-900">
                            {item.metricValue}
                          </span>
                          <span className="text-[11px] text-slate-500 ml-1">{item.unit}</span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-slate-700">{item.weightPercent}%</span>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mt-1 overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${(item.weightPercent / 25) * 100}%` }}
                            />
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-md ${
                              item.isVariancePositive
                                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                                : 'text-rose-700 bg-rose-50 border border-rose-200'
                            }`}
                          >
                            {item.isVariancePositive ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            {item.targetVariance > 0 ? `+${item.targetVariance}%` : `${item.targetVariance}%`}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                              item.status === 'Exceeding'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : item.status === 'On Track'
                                ? 'bg-sky-100 text-sky-800 border border-sky-300'
                                : item.status === 'Needs Attention'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {item.status}
                          </span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">
                            {item.auditorVerification}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800">{item.keyProject}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{item.leadOfficer}</div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer info */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  Disclosures audited per SEBI circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Reporting Period: {dataPoint.fiscalYear} ({dataPoint.yearLabel})
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-slate-500 flex items-center gap-1.5">
            <Factory className="w-4 h-4 text-slate-400" />
            <span>Showing all 6 accredited business units across MEIL Group</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
