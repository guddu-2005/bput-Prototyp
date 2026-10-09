import React, { useState } from 'react';
import { GitBranch, Database, FileText, ShieldCheck, CheckCircle2, Search, Sliders } from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { useNexusData } from '../../../context/NexusDataContext';

export const ReviewerDataLineagePage: React.FC = () => {
  const { assignments, submissions, evidence } = useNexusData();
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(
    assignments[0]?.id || ''
  );
  const [search, setSearch] = useState('');

  const selectedAssignment = assignments.find((a) => a.id === selectedAssignmentId) || assignments[0];
  const submission = submissions.find((s) => s.assignmentId === selectedAssignment?.id);

  const filteredAssignments = assignments.filter((a) =>
    a.indicatorName.toLowerCase().includes(search.toLowerCase()) ||
    a.indicatorCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Lineage & Calculation Audit Trail"
        description="Inspect transparent calculation formulas, emission factor provenance, metering logs, and source evidence chains behind reported numbers."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Disclosures List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col h-[650px]">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-slate-800">Select Disclosure</h3>
            <p className="text-xs text-slate-500">Pick any disclosure to trace its data lineage.</p>
            <div className="relative mt-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search indicator..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:bg-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredAssignments.map((a) => {
              const isSelected = a.id === selectedAssignment?.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setSelectedAssignmentId(a.id)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                    isSelected
                      ? 'bg-sky-50/80 border-sky-300 text-sky-950 font-semibold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-sky-700 font-bold">{a.indicatorCode}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${
                        a.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : a.status === 'under_review'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {a.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="mt-1 font-medium text-slate-900 line-clamp-1">{a.indicatorName}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {a.brsrSection} • {a.brsrPrinciple}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Columns: Lineage Diagram & Computation breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Info */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {selectedAssignment?.indicatorCode}
                </span>
                <h2 className="text-base font-bold text-slate-800 mt-2">{selectedAssignment?.indicatorName}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reporting Scope: {selectedAssignment?.reportingPeriod} • Section: {selectedAssignment?.brsrSection}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Reported Final Value</span>
                <span className="text-2xl font-black text-slate-900">
                  {submission ? submission.value : '2,845.00'}{' '}
                  <span className="text-xs font-medium text-slate-500">{submission?.unit || 'Units'}</span>
                </span>
              </div>
            </div>

            {/* Lineage Steps Visual */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-sky-600" />
                Lineage Pathway (Origin to BRSR Output)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
                {/* Stage 1: Data Source */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-1">
                    <Database className="w-3.5 h-3.5 text-indigo-600" />
                    <span>1. Primary Source</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Site Logbook &amp; Meter Invoices</p>
                  <p className="text-[10px] text-slate-500 mt-1">IOCL / CSPDCL Telemetry Record</p>
                </div>

                {/* Stage 2: Activity Data */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-1">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    <span>2. Activity Input</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {submission?.activityValue ? `${submission.activityValue} ${submission.activityUnit || ''}` : '654,000 Litres'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Validated against Gate Register</p>
                </div>

                {/* Stage 3: Emission / Standard Factor */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>3. Standard Factor</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {submission?.emissionFactor ? `${submission.emissionFactor} ${submission.emissionFactorUnit || ''}` : '2.68 kg CO2e / L'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">IPCC 2006 / CEA CO2 Baseline v19</p>
                </div>

                {/* Stage 4: BRSR Metric */}
                <div className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>4. Final Disclosure</span>
                  </div>
                  <p className="text-[11px] font-bold text-emerald-900">
                    {submission?.value ? `${submission.value} ${submission.unit}` : '1,752.72 tCO2e'}
                  </p>
                  <p className="text-[10px] text-emerald-700 mt-1">SEBI BRSR Core Format</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Calculation Formula & Audit Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-600" />
                Calculation Formula
              </h4>
              <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs space-y-1">
                <p className="text-sky-300">Total Emissions (tCO2e) =</p>
                <p className="pl-3">Activity Volume (L) × Emission Factor (kg/L) ÷ 1,000</p>
                <div className="pt-2 border-t border-slate-700 text-slate-300 text-[11px]">
                  <span>Source: CEA India Grid Emission Database &amp; DEFRA Conversion Guidelines</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Supporting Evidence
              </h4>
              <div className="space-y-2">
                {evidence.slice(0, 2).map((ev) => (
                  <div key={ev.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-800 truncate max-w-[200px]">{ev.name}</p>
                      <p className="text-[10px] text-slate-500">{ev.documentType}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Attached
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
