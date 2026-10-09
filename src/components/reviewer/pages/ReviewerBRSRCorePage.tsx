import React from 'react';
import { Award, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Eye, FileSpreadsheet } from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { useNexusData } from '../../../context/NexusDataContext';
import { Link } from 'react-router-dom';

interface CoreAttribute {
  id: string;
  code: string;
  name: string;
  principle: string;
  metricType: string;
  assuranceType: 'Reasonable Assurance' | 'Limited Assurance';
  targetValue: string;
  status: 'Compliant' | 'Review Required' | 'Action Needed';
}

const BRSR_CORE_ATTRIBUTES: CoreAttribute[] = [
  {
    id: 'core-1',
    code: 'P6-E1',
    name: 'Greenhouse Gas (GHG) Scope 1 & 2 Footprint',
    principle: 'Principle 6 (Environment)',
    metricType: 'tCO2e & Intensity / Turnover',
    assuranceType: 'Reasonable Assurance',
    targetValue: 'Reduction by 4.5% YoY',
    status: 'Review Required',
  },
  {
    id: 'core-2',
    code: 'P6-E2',
    name: 'Water Consumption & Water Intensity',
    principle: 'Principle 6 (Environment)',
    metricType: 'kL & Intensity in Water-Stressed Areas',
    assuranceType: 'Reasonable Assurance',
    targetValue: 'Zero net increase in stressed zones',
    status: 'Compliant',
  },
  {
    id: 'core-3',
    code: 'P6-E3',
    name: 'Energy Footprint & Renewable Energy Ratio',
    principle: 'Principle 6 (Environment)',
    metricType: 'GJ & % Renewable Share',
    assuranceType: 'Limited Assurance',
    targetValue: '>= 28% Renewable by FY27',
    status: 'Compliant',
  },
  {
    id: 'core-4',
    code: 'P6-E4',
    name: 'Circular Economy, Waste Generation & Recycling',
    principle: 'Principle 6 (Environment)',
    metricType: 'MT Hazardous & Non-Hazardous',
    assuranceType: 'Limited Assurance',
    targetValue: '92% construction debris recycled',
    status: 'Compliant',
  },
  {
    id: 'core-5',
    code: 'P3-S1',
    name: 'Employee Well-being, Safety & Lost Time Injury Rate',
    principle: 'Principle 3 (Employees)',
    metricType: 'LTIFR per million man-hours',
    assuranceType: 'Reasonable Assurance',
    targetValue: 'Zero fatal accidents, LTIFR < 0.12',
    status: 'Compliant',
  },
  {
    id: 'core-6',
    code: 'P5-S2',
    name: 'Gender Diversity & Median Wages Ratio',
    principle: 'Principle 5 (Human Rights)',
    metricType: 'Gender Pay Ratio & Board Diversity %',
    assuranceType: 'Limited Assurance',
    targetValue: '1:1 equal pay for equal work',
    status: 'Compliant',
  },
  {
    id: 'core-7',
    code: 'P8-S3',
    name: 'Inclusive Development & Job Creation in Small Towns',
    principle: 'Principle 8 (Inclusive Growth)',
    metricType: 'Tier 2/3 town hiring & MSME spend',
    assuranceType: 'Limited Assurance',
    targetValue: '>= 35% local procurement',
    status: 'Compliant',
  },
  {
    id: 'core-8',
    code: 'P1-G1',
    name: 'Openness of Business & Statutory Disputed Tax',
    principle: 'Principle 1 (Ethics)',
    metricType: 'Disputed statutory dues & Anti-Bribery',
    assuranceType: 'Limited Assurance',
    targetValue: 'Zero material non-compliance',
    status: 'Compliant',
  },
  {
    id: 'core-9',
    code: 'P7-G2',
    name: 'Gross Value Added (GVA) Distribution & Fair Trade',
    principle: 'Principle 7 (Public Policy)',
    metricType: 'Distribution to wages, capital, government',
    assuranceType: 'Limited Assurance',
    targetValue: 'Fair economic value distribution',
    status: 'Compliant',
  },
];

export const ReviewerBRSRCorePage: React.FC = () => {
  const { assignments } = useNexusData();

  const coreAssignments = assignments.filter((a) => a.isBrsrCore);
  const approvedCore = coreAssignments.filter((a) => a.status === 'approved').length;
  const pendingCore = coreAssignments.filter(
    (a) => a.status === 'under_review' || a.status === 'submitted' || a.status === 'resubmitted'
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="BRSR Core Assurance Review"
        description="SEBI-mandated 9 BRSR Core Key Performance Indicators requiring reasonable or limited third-party assurance for listed and top infrastructure conglomerates."
      />

      {/* Assurance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">BRSR Core Indicators</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">9 / 9</p>
            <p className="text-xs text-slate-500 mt-0.5">SEBI Mandate Scope</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ready for Assurance</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{approvedCore} Disclosures</p>
            <p className="text-xs text-emerald-600 mt-0.5">Signed off &amp; verified</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Under Review</p>
            <p className="text-2xl font-bold text-sky-600 mt-1">{pendingCore}</p>
            <p className="text-xs text-sky-600 mt-0.5">Awaiting reviewer sign-off</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Assurance Level</p>
            <p className="text-xl font-bold text-indigo-700 mt-1">Reasonable</p>
            <p className="text-xs text-indigo-600 mt-0.5">Target audit firm: Big-4</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SEBI 9 BRSR Core Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">SEBI BRSR Core Key Performance Indicators</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict audit trails, emission factor documentation, and evidence attachments required before signing off.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Attribute Code</th>
                <th className="px-4 py-3">Core Parameter Name</th>
                <th className="px-4 py-3">Pillar / Principle</th>
                <th className="px-4 py-3">Assurance Standard</th>
                <th className="px-4 py-3">Threshold / Target</th>
                <th className="px-4 py-3">Assurance Readiness</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {BRSR_CORE_ATTRIBUTES.map((attr) => {
                const linkedAssignment = assignments.find(
                  (a) => a.indicatorCode.includes(attr.code) || a.isBrsrCore
                );

                return (
                  <tr key={attr.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">{attr.code}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800 block">{attr.name}</span>
                      <span className="text-[11px] text-slate-400">{attr.metricType}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{attr.principle}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          attr.assuranceType === 'Reasonable Assurance'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {attr.assuranceType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{attr.targetValue}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          attr.status === 'Compliant'
                            ? 'bg-emerald-100 text-emerald-800'
                            : attr.status === 'Review Required'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {attr.status === 'Compliant' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {attr.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {linkedAssignment ? (
                        <Link
                          to={`/reviewer/submission-detail/${linkedAssignment.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 hover:bg-sky-100 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Audit</span>
                        </Link>
                      ) : (
                        <Link
                          to="/reviewer/review-queue"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 px-2 py-1 rounded-lg"
                        >
                          <span>Queue</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
