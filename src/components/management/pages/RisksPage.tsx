import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';

interface RiskItem {
  id: string;
  title: string;
  category: 'Environmental' | 'Social' | 'Governance' | 'Assurance';
  severity: 'High' | 'Medium' | 'Low';
  project: string;
  description: string;
  mitigation: string;
  status: 'Open' | 'Mitigating' | 'Resolved';
}

const RISKS_DATA: RiskItem[] = [
  {
    id: 'risk-1',
    title: 'Scope 1 Diesel Consumption +24% YoY Variance at Raipur Site',
    category: 'Environmental',
    severity: 'High',
    project: 'Expressway Project Phase-II (Raipur)',
    description: 'Sudden spike in high-speed diesel usage caused by double-shift earthmoving without calibrated log slips.',
    mitigation: 'Automated fuel dispensing telemetry installed; 100% IOCL batch invoices attached for external assurance.',
    status: 'Mitigating',
  },
  {
    id: 'risk-2',
    title: 'Groundwater NOC Renewal Pending with CGWA for Irrigation Site',
    category: 'Environmental',
    severity: 'High',
    project: 'Kaleshwaram Lift Irrigation Site 4',
    description: 'Current NOC valid till Nov 2026; state groundwater board inspection report awaited for compliance.',
    mitigation: 'Application filed with state authority; temporary recycled water reservoir operational.',
    status: 'Mitigating',
  },
  {
    id: 'risk-3',
    title: 'Subcontractor Safety PPE Non-Compliance Flagged at Flyover Camp',
    category: 'Social',
    severity: 'Medium',
    project: 'Roads & Expressways BU',
    description: 'Random safety audit found 12 contract workers without chin-strap helmets at height.',
    mitigation: 'Subcontractor penalized; mandatory retraining session conducted with biometric attendance.',
    status: 'Resolved',
  },
  {
    id: 'risk-4',
    title: 'Tier-2 Supplier ESG Code of Conduct Declarations Delay',
    category: 'Governance',
    severity: 'Medium',
    project: 'Corporate Procurement',
    description: '42 local cement/aggregate vendors have not submitted modern slavery & environmental self-declarations.',
    mitigation: 'Procurement portal hard-block implemented on purchase order issuance until declaration is uploaded.',
    status: 'Open',
  },
];

export const RisksPage: React.FC = () => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = RISKS_DATA.filter((r) => {
    if (filterSeverity !== 'all' && r.severity !== filterSeverity) return false;
    if (filterCategory !== 'all' && r.category !== filterCategory) return false;
    if (
      search &&
      !r.title.toLowerCase().includes(search.toLowerCase()) &&
      !r.project.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="ESG Risks & Exceptions Register"
        description="Active environmental exceptions, data quality anomalies, occupational safety breaches, and assurance non-conformances requiring executive intervention."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-rose-800 uppercase">Critical / High Severity</p>
            <p className="text-2xl font-black text-rose-600 mt-1">
              {RISKS_DATA.filter((r) => r.severity === 'High').length} Active
            </p>
            <p className="text-[11px] text-rose-700 mt-0.5">Assurance impact possible</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-800 uppercase">Medium Severity</p>
            <p className="text-2xl font-black text-amber-600 mt-1">
              {RISKS_DATA.filter((r) => r.severity === 'Medium').length} Monitored
            </p>
            <p className="text-[11px] text-amber-700 mt-0.5">Mitigation underway</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-800 uppercase">Resolved This Quarter</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {RISKS_DATA.filter((r) => r.status === 'Resolved').length} Cleared
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5">Auditor evidence signed</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search risks by project or issue..."
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 w-72 focus:bg-white focus:outline-none focus:border-indigo-600"
        />

        <div className="flex items-center gap-2">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5"
          >
            <option value="all">All Severities</option>
            <option value="High">High Severity</option>
            <option value="Medium">Medium Severity</option>
            <option value="Low">Low Severity</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5"
          >
            <option value="all">All Categories</option>
            <option value="Environmental">Environmental</option>
            <option value="Social">Social</option>
            <option value="Governance">Governance</option>
          </select>
        </div>
      </div>

      {/* Risks List */}
      <div className="space-y-3">
        {filtered.map((risk) => (
          <div
            key={risk.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    risk.severity === 'High'
                      ? 'bg-rose-100 text-rose-800'
                      : risk.severity === 'Medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {risk.severity} Risk
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase">{risk.category}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-700">{risk.project}</span>
              </div>

              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 self-start sm:self-auto ${
                  risk.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : risk.status === 'Mitigating'
                    ? 'bg-sky-100 text-sky-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {risk.status}
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900">{risk.title}</h3>
            <p className="text-xs text-slate-600 mt-1">{risk.description}</p>

            <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/50 p-2.5 rounded-lg text-xs">
              <span className="font-semibold text-slate-700">Mitigation Action Plan: </span>
              <span className="text-slate-600">{risk.mitigation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
