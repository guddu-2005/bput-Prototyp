import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  FileText,
  Download,
  CheckCircle2,
  Sparkles,
  Calendar,
  Layers,
  Flame,
  Trash2,
  Droplet,
  Fuel,
  Zap,
  Check,
  Printer,
} from 'lucide-react';
import type { HistoricalESGData } from './BusinessUnitBreakdownModal';
import type { DateFilterState } from './ESGDateRangePicker';
import {
  exportESGExcelReport,
  exportESGPDFReport,
  type ExportReportOptions,
} from '../../../services/esgExport.service';

interface ESGReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateFilter: DateFilterState;
  selectedMetricView: string;
  filteredESGMetrics: HistoricalESGData[];
  executiveStats: {
    completionPercentage: number;
    approvedAssignments: number;
    totalAssignments: number;
    pendingReviews: number;
    openRisks: number;
    targetsOffTrack: number;
    signOffStatus: string;
  };
}

export const ESGReportExportModal: React.FC<ESGReportExportModalProps> = ({
  isOpen,
  onClose,
  dateFilter,
  selectedMetricView,
  filteredESGMetrics,
  executiveStats,
}) => {
  const [format, setFormat] = useState<'pdf' | 'excel' | 'both'>('pdf');
  const [includeChartSnapshot, setIncludeChartSnapshot] = useState(true);
  const [includeKPISummaries, setIncludeKPISummaries] = useState(true);
  const [includeAdverseMitigations, setIncludeAdverseMitigations] = useState(true);
  const [includeGovernanceChecklist, setIncludeGovernanceChecklist] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Curated KPI metrics aligned with ESGKPICardSection
  const kpiMetricsData = [
    {
      id: 'carbon_footprint',
      title: 'Total Carbon Footprint (Scope 1 & 2)',
      category: 'Emissions',
      currentValue: '42,850',
      unit: 'tCO2e',
      previousValue: '44,730',
      percentageChange: -4.2,
      isNegativeTrend: false,
      benchmark: 'Target: ≤ 45,000 tCO2e',
      subLabel: 'Intensity: 18.2 tCO2e / ₹ Cr',
      summary: 'Net emissions down across EPC operations due to solar captive arrays and fleet route optimization.',
      icon: Flame,
    },
    {
      id: 'waste_circularity',
      title: 'Waste Reduction & Circularity',
      category: 'Circularity',
      currentValue: '92.0%',
      unit: 'Recycled / Diverted',
      previousValue: '88.6%',
      percentageChange: +3.4,
      isNegativeTrend: false,
      benchmark: 'SEBI BRSR Target: ≥ 90%',
      subLabel: 'Debris Diverted: 184,200 MT',
      summary: 'Concrete, fly-ash, and steel scrap salvaged and redirected into road sub-base compaction.',
      icon: Trash2,
    },
    {
      id: 'freshwater_intensity',
      title: 'Freshwater Withdrawal Intensity',
      category: 'Water',
      currentValue: '542',
      unit: 'kL / ₹ Cr',
      previousValue: '498',
      percentageChange: +8.8,
      isNegativeTrend: true, // Flagged
      benchmark: 'Internal Cap: ≤ 480 kL / ₹ Cr',
      subLabel: 'Total Withdrawn: 1,240,000 kL',
      summary: 'Adverse variance: Specific water consumption rose by +8.8% due to summer curing at lift irrigation sites.',
      rootCause: 'Intensive summer concrete curing without canvas jackets at Godavari Lift Irrigation Phase-II and Polavaram sites.',
      mitigationPlan: 'Deploy curing compound sprays (reducing water requirement by 65%), closed-loop sumps, and weekly telemetry.',
      responsibleLead: 'Er. K. Venkat Rao (Chief Site Engineer - Irrigation)',
      targetDeadline: 'Within 30 Days (Pre-Audit Sign-Off)',
      icon: Droplet,
    },
    {
      id: 'diesel_equipment_burn',
      title: 'Equipment Diesel Intensity (Scope 1)',
      category: 'Energy',
      currentValue: '19.4',
      unit: 'kL / km constructed',
      previousValue: '18.3',
      percentageChange: +6.2,
      isNegativeTrend: true, // Flagged
      benchmark: 'Target: ≤ 17.5 kL / km',
      subLabel: 'Total Fuel Burn: 6,850 kL',
      summary: 'Adverse variance: Diesel consumption per km rose by +6.2% due to excavator idling and temporary DG reliance.',
      rootCause: 'Heavy excavators operating on uncalibrated idling cycles on highway rock cuts awaiting 33kV grid lines.',
      mitigationPlan: 'IoT idle-stop telematics on heavy excavators (> 5 min idle alerts) and commission 33kV grid substation.',
      responsibleLead: 'P. Rajesh Kumar (Head of Heavy Machinery)',
      targetDeadline: '15 Days / Immediate Enforcement',
      icon: Fuel,
    },
    {
      id: 'renewable_energy_mix',
      title: 'Renewable Energy Mix',
      category: 'Energy',
      currentValue: '32.1%',
      unit: 'Clean Power',
      previousValue: '28.5%',
      percentageChange: +3.6,
      isNegativeTrend: false,
      benchmark: 'FY26 MEIL Target: 35.0%',
      subLabel: 'Generated: 142,500 MWh',
      summary: 'Clean power share expanded via 500MW Pavagada solar farm captive wheeling and rooftop arrays.',
      icon: Zap,
    },
    {
      id: 'water_recycled_ratio',
      title: 'Water Recycled & Circular Ratio',
      category: 'Water',
      currentValue: '42.4%',
      unit: 'Circular Ratio',
      previousValue: '38.8%',
      percentageChange: +3.6,
      isNegativeTrend: false,
      benchmark: 'ZLD Policy Target: 40.0%',
      subLabel: 'Volume Reused: 525,800 kL',
      summary: 'Effluent treatment plants and zero-liquid-discharge (ZLD) curing systems prevented virgin water draw.',
      icon: Droplet,
    },
  ];

  const handleExport = async (overrideFormat?: 'pdf' | 'excel') => {
    const selectedFormat = overrideFormat || format;
    setIsExporting(true);
    setExportSuccessMessage(null);

    const exportOptions: ExportReportOptions = {
      companyName: 'Megha Engineering & Infrastructures Limited',
      reportTitle: 'Executive ESG & Sustainability Performance Report',
      dateFilter,
      selectedMetricView,
      trendData: filteredESGMetrics,
      executiveStats,
      kpiMetrics: kpiMetricsData,
      chartSvgSelector: includeChartSnapshot ? '#esg-trend-chart-container' : undefined,
    };

    try {
      if (selectedFormat === 'excel' || selectedFormat === 'both') {
        exportESGExcelReport(exportOptions);
      }
      if (selectedFormat === 'pdf' || selectedFormat === 'both') {
        await exportESGPDFReport(exportOptions);
      }

      setExportSuccessMessage(
        selectedFormat === 'both'
          ? 'Both PDF Executive Report and Excel Workbook downloaded!'
          : selectedFormat === 'pdf'
          ? 'PDF Executive Report successfully generated & downloaded!'
          : 'Excel Data Workbook (.xlsx) successfully generated & downloaded!'
      );
      setTimeout(() => {
        setExportSuccessMessage(null);
      }, 4000);
    } catch (err) {
      console.error('Failed to export report:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Download className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="export-modal-title" className="text-base font-bold text-white">
                  Export Executive ESG &amp; Sustainability Report
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30">
                  SEBI BRSR Core
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Generate high-fidelity PDF briefs or multi-sheet Excel workbooks for board reviews &amp; auditors.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close export dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Success Banner */}
          {exportSuccessMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{exportSuccessMessage}</span>
            </div>
          )}

          {/* Scope & Date Range Context */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Report Scope &amp; Period
                </span>
                <p className="text-sm font-bold text-slate-800">
                  {dateFilter.label}
                  <span className="ml-2 text-xs font-medium text-slate-500">
                    ({dateFilter.isQuarterly ? 'Quarterly Trend Series' : 'Multi-Year Historical Series'})
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100">
              <Layers className="w-3.5 h-3.5" />
              <span>{filteredESGMetrics.length} Period Data Points</span>
            </div>
          </div>

          {/* Format Selector Cards */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Choose Export Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* PDF Card */}
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  format === 'pdf'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    {format === 'pdf' && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">PDF Executive Report (.pdf)</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Board-ready 2-page brief with MEIL corporate branding, KPI scorecards, adverse trend alerts, and embedded trend chart visualization.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center gap-2 text-[11px] font-semibold text-rose-700">
                  <span>Formatted for print &amp; board distribution</span>
                </div>
              </button>

              {/* Excel Card */}
              <button
                type="button"
                onClick={() => setFormat('excel')}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  format === 'excel'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    {format === 'excel' && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Excel Data Workbook (.xlsx)</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Multi-sheet spreadsheet with complete time series data, BRSR coverage, adverse variance logs, and root-cause action registers.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center gap-2 text-[11px] font-semibold text-emerald-700">
                  <span>3 Sheets: Summary, Trends, Mitigations</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section Options / Content Inclusions */}
          <div className="space-y-3">
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Sections to Include
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeKPISummaries}
                  onChange={(e) => setIncludeKPISummaries(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800">High-Level KPI Summaries</span>
                  <p className="text-[11px] text-slate-500">6 core ESG indicators &amp; variances</p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeChartSnapshot}
                  onChange={(e) => setIncludeChartSnapshot(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800">Recharts Trend Visuals</span>
                  <p className="text-[11px] text-slate-500">Embedded vector/raster chart capture</p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAdverseMitigations}
                  onChange={(e) => setIncludeAdverseMitigations(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800">Adverse Variance Alerts</span>
                  <p className="text-[11px] text-slate-500">2 flagged metrics &amp; corrective actions</p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGovernanceChecklist}
                  onChange={(e) => setIncludeGovernanceChecklist(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800">BRSR Assurance Readiness</span>
                  <p className="text-[11px] text-slate-500">Sign-off signposts &amp; auditor blocks</p>
                </div>
              </label>
            </div>
          </div>

          {/* Quick Preview Information Box */}
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 space-y-1">
              <p className="font-semibold text-indigo-950">
                Included ESG Metrics in this Export:
              </p>
              <p className="text-[11px] text-slate-600">
                Carbon Footprint (Scope 1 &amp; 2: 42,850 tCO2e), Waste Circularity (92.0%), Freshwater Withdrawal (542 kL/₹Cr - ⚠️ Flagged), Equipment Diesel Intensity (19.4 kL/km - ⚠️ Flagged), Renewable Mix (32.1%), Water Recycled Ratio (42.4%).
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
              title="Open browser print dialog"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print View</span>
            </button>
            <button
              type="button"
              onClick={() => handleExport('excel')}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Quick Excel</span>
            </button>
            <button
              type="button"
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
            >
              <FileText className="w-3.5 h-3.5 text-rose-700" />
              <span>Quick PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleExport()}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {isExporting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating {format.toUpperCase()}...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>
                    Export {format === 'both' ? 'PDF & Excel Package' : format === 'pdf' ? 'PDF Report' : 'Excel Report'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
