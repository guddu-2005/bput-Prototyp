import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  AlertTriangle,
  Download,
  Search,
  ExternalLink,
  Building2,
  Layers,
  Sparkles,
  FileSpreadsheet,
  FileText,
  Clock,
  CheckSquare,
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { exportESGReportToExcel } from '../../../services/esgExport.service';
import { HISTORICAL_ESG_METRICS } from '../../management/pages/ManagementDashboard';

interface BRSRCoreIndicator {
  code: string;
  name: string;
  principle: string;
  assuranceType: 'Reasonable' | 'Limited';
  sampleCoverage: string;
  status: 'VERIFIED' | 'IN_PROGRESS' | 'PENDING_DOCUMENTATION';
  primaryEvidence: string;
  findings: string;
}

const BRSR_CORE_INDICATORS: BRSRCoreIndicator[] = [
  {
    code: 'BC-01',
    name: 'Green-House Gas (GHG) Footprint (Scope 1 & 2)',
    principle: 'P6: Environmental Stewardship',
    assuranceType: 'Reasonable',
    sampleCoverage: '100% (All 6 Operating BUs)',
    status: 'VERIFIED',
    primaryEvidence: 'Fuel invoices, CPCB emission test logs, DISCOM bills',
    findings: 'Scope 1 emissions (324,500 tCO2e) reconciled against bulk diesel procurement.',
  },
  {
    code: 'BC-02',
    name: 'Water Consumption & Intensity',
    principle: 'P6: Environmental Stewardship',
    assuranceType: 'Reasonable',
    sampleCoverage: '96% (Hydro, Infra, Solar sites)',
    status: 'VERIFIED',
    primaryEvidence: 'Flow meter telemetry, extraction permits, STP recycling manifests',
    findings: 'Recycled water ratio of 54.2% corroborated by zero-liquid discharge telemetry.',
  },
  {
    code: 'BC-03',
    name: 'Energy Footprint & Renewable Energy Share',
    principle: 'P6: Environmental Stewardship',
    assuranceType: 'Reasonable',
    sampleCoverage: '98% (Plant & Project Level)',
    status: 'VERIFIED',
    primaryEvidence: 'Open-access solar wheeling credits, REC certificates',
    findings: 'Renewable energy mix reached 41.5% in FY26, consistent with rooftop solar logs.',
  },
  {
    code: 'BC-04',
    name: 'Waste Management & Hazardous Scrap Handling',
    principle: 'P2 & P6: Circular Economy',
    assuranceType: 'Limited',
    sampleCoverage: '92% (Major fabrication yards)',
    status: 'VERIFIED',
    primaryEvidence: 'State Pollution Control Board Form 10 manifests, authorized recyclers',
    findings: 'Debris diversion rate at 88.6%; manifest records verified for 18 authorized recyclers.',
  },
  {
    code: 'BC-05',
    name: 'Employee Health & Safety (Lost Time Injury Rate)',
    principle: 'P3: Employee Well-being',
    assuranceType: 'Reasonable',
    sampleCoverage: '100% (Total Man-Hours 142.8M)',
    status: 'VERIFIED',
    primaryEvidence: 'EHS incident registers, OSHA-equivalent statutory filings',
    findings: 'LTIFR verified at 0.08 per million man-hours; zero fatal incidents recorded.',
  },
  {
    code: 'BC-06',
    name: 'Gender Diversity & Equal Remuneration',
    principle: 'P3: Workplace Diversity',
    assuranceType: 'Reasonable',
    sampleCoverage: '100% (42,500 Permanent & Contract)',
    status: 'VERIFIED',
    primaryEvidence: 'HRMS salary registers, EPF & ESI statutory returns',
    findings: 'Equal median pay ratio across core engineering bands validated.',
  },
  {
    code: 'BC-07',
    name: 'Payment to Micro & Small Enterprises (MSME)',
    principle: 'P8: Inclusive Growth',
    assuranceType: 'Reasonable',
    sampleCoverage: '95% (Vendor master & AP logs)',
    status: 'VERIFIED',
    primaryEvidence: 'SAP vendor aging report, MSME SAMADHAAN portal checks',
    findings: 'Average vendor settlement cycle verified at 38 days, compliant with MSMED Act 45-day ceiling.',
  },
  {
    code: 'BC-08',
    name: 'Gross Wages & Living Wage Benchmark',
    principle: 'P3: Fair Compensation',
    assuranceType: 'Reasonable',
    sampleCoverage: '100% (All Operating Entities)',
    status: 'VERIFIED',
    primaryEvidence: 'Bank transfer credit advises, contractor compliance audit',
    findings: '100% workforce compensated above notified state minimum / floor wage rates.',
  },
  {
    code: 'BC-09',
    name: 'Openness of Business & Customer Complaints',
    principle: 'P9: Consumer Value & Integrity',
    assuranceType: 'Reasonable',
    sampleCoverage: '100% (Client grievance logs)',
    status: 'VERIFIED',
    primaryEvidence: 'Client correspondence, NHAI / State Irrigation sign-off minutes',
    findings: 'Zero pending environmental litigation or unresolved public notices in FY26.',
  },
];

export const AuditorDashboardPage: React.FC = () => {
  const context = useOutletContext<{ addToast?: (msg: string, type: string) => void }>();
  const [selectedIndicator, setSelectedIndicator] = useState<BRSRCoreIndicator | null>(
    BRSR_CORE_INDICATORS[0]
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [signOffStatus, setSignOffStatus] = useState<string>('Unsigned');

  const filteredIndicators = BRSR_CORE_INDICATORS.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.principle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportAuditorDatabook = async () => {
    try {
      setIsExporting(true);
      await exportESGReportToExcel(HISTORICAL_ESG_METRICS, {
        includeHistoricalTrends: true,
        includeBusinessUnitBreakdown: true,
        includeComplianceSummary: true,
        includeAssuranceStatement: true,
      });
      context?.addToast?.('Auditor ESG Excel Databook exported successfully!', 'success');
    } catch (e) {
      console.error(e);
      context?.addToast?.('Failed to export Databook', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleIssueAssuranceOpinion = () => {
    setSignOffStatus('Signed & Sealed');
    context?.addToast?.(
      'Independent Reasonable Assurance Opinion (ISAE 3000) cryptographically stamped!',
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Independent BRSR Core External Assurance
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Mandatory SEBI BRSR Core assurance review for Megha Engineering &amp; Infrastructures Ltd. (FY 2025–26)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportAuditorDatabook}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-60"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>{isExporting ? 'Generating Databook...' : 'Export Auditor XLSX'}</span>
          </button>

          <button
            type="button"
            onClick={handleIssueAssuranceOpinion}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-md hover:shadow-purple-900/40 transition-all cursor-pointer"
          >
            <CheckSquare className="w-4 h-4" />
            <span>{signOffStatus === 'Signed & Sealed' ? 'Assurance Opinion Sealed' : 'Issue Assurance Opinion'}</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Core Principles
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">9 / 9</span>
            <span className="text-xs font-semibold text-emerald-400">100% Scoped</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            All SEBI Circular mandated parameters covered
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Evidence Audit Rate
            </span>
            <FileCheck2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">98.4%</span>
            <span className="text-xs font-semibold text-purple-300">Sample Clear</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            184 of 187 sample records audited &amp; verified
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Assurance Scope
            </span>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">ISAE 3000</span>
            <span className="text-xs font-semibold text-sky-400">Reasonable</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            International Standard on Assurance Engagements
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Opinion Status
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-xl font-bold ${signOffStatus === 'Signed & Sealed' ? 'text-emerald-400' : 'text-amber-300'}`}>
              {signOffStatus}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Unqualified (Clean) Independent Opinion
          </p>
        </div>
      </div>

      {/* Main Split: Left Indicators Master / Right Inspection Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of 9 BRSR Core Indicators (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>BRSR Core Indicator Ledger</span>
              <span className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-slate-300">
                {filteredIndicators.length}
              </span>
            </h3>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by indicator code, name, principle..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* List items */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredIndicators.map((ind) => {
              const isSelected = selectedIndicator?.code === ind.code;
              return (
                <div
                  key={ind.code}
                  onClick={() => setSelectedIndicator(ind)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500/50'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                      {ind.code}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {ind.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5 line-clamp-1">
                    {ind.name}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>{ind.assuranceType} Assurance</span>
                    <span className="text-slate-300 font-medium">{ind.sampleCoverage}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Verification & Chain of Custody (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-6">
          {selectedIndicator ? (
            <>
              {/* Header */}
              <div className="pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                    {selectedIndicator.code}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {selectedIndicator.principle}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-2">
                  {selectedIndicator.name}
                </h2>
              </div>

              {/* Scope & Sample Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-900/70 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                    Assurance Level
                  </span>
                  <span className="text-sm font-bold text-white mt-1 block">
                    {selectedIndicator.assuranceType} Assurance (ISAE 3000)
                  </span>
                </div>
                <div className="p-3.5 bg-slate-900/70 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                    Sample Audited
                  </span>
                  <span className="text-sm font-bold text-purple-300 mt-1 block">
                    {selectedIndicator.sampleCoverage}
                  </span>
                </div>
              </div>

              {/* Evidence Chain */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>Audited Supporting Evidence</span>
                </span>
                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800/90 text-xs text-slate-300 leading-relaxed">
                  {selectedIndicator.primaryEvidence}
                </div>
              </div>

              {/* Assurer Findings & Observations */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lead Assurer Observations (Deloitte)</span>
                </span>
                <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-xs text-emerald-200 leading-relaxed">
                  {selectedIndicator.findings}
                </div>
              </div>

              {/* Chain of Custody Timeline */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Three-Tier Approval &amp; Custody Trail
                </span>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[11px]">1. Contributor</span>
                    <span className="font-semibold text-white">Suresh Kumar (Site Eng)</span>
                  </div>
                  <div className="text-slate-600 hidden sm:block">&rarr;</div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">2. Reviewer</span>
                    <span className="font-semibold text-white">Aarav Patel (Review Lead)</span>
                  </div>
                  <div className="text-slate-600 hidden sm:block">&rarr;</div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">3. Management Sign-Off</span>
                    <span className="font-semibold text-white">Dr. V. Rao (CSO)</span>
                  </div>
                  <div className="text-slate-600 hidden sm:block">&rarr;</div>
                  <div>
                    <span className="text-purple-400 block text-[11px] font-bold">4. External Assurer</span>
                    <span className="font-semibold text-purple-300">S. Deshmukh (Deloitte)</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-slate-500 text-sm">
              Select an indicator to inspect external audit verification details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
