import React from 'react';
import {
  ShieldCheck,
  FileCheck2,
  Scale,
  Users2,
  Lock,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { MetricCard } from '../../admin/common/MetricCard';

export const GovernancePage: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Governance Pillar (P1 & P7 Performance)"
        description="Corporate ethics, anti-corruption frameworks, board sustainability committee oversight, whistleblower mechanisms, and public policy advocacy transparency."
      />

      {/* Governance Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Board Independence"
          value="50.0 %"
          icon={Scale}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          accentBorder="border-l-indigo-600"
        />
        <MetricCard
          title="Vigilance & Anti-Bribery"
          value="0 Incidents"
          icon={ShieldCheck}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          accentBorder="border-l-emerald-500"
        />
        <MetricCard
          title="Statutory Tax Adherence"
          value="100.0 %"
          icon={FileCheck2}
          iconBg="bg-sky-50"
          iconColor="text-sky-600"
          accentBorder="border-l-sky-500"
        />
        <MetricCard
          title="Vendor ESG Audits"
          value="480 Suppliers"
          icon={Users2}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          accentBorder="border-l-amber-500"
        />
      </div>

      {/* Board Oversight & Whistleblower Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-800">Board Sustainability Committee</h3>
            <Scale className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Committee Frequency</span>
                <span className="text-[11px] text-slate-500">Quarterly statutory review of ESG risks</span>
              </div>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                4 / 4 Held
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Independent Director Participation</span>
                <span className="text-[11px] text-slate-500">Chaired by Independent Director</span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                100% Quorum
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">SEBI BRSR Core Approval Status</span>
                <span className="text-[11px] text-slate-500">Mandated Board sign-off schedule</span>
              </div>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Awaiting Sign-off
              </span>
            </div>
          </div>
        </div>

        {/* Ethics & Vigilance Mechanisms */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-800">Vigilance, Anti-Corruption &amp; Grievances</h3>
            <Lock className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Whistleblower Complaints Received</span>
                <span className="text-[11px] text-slate-500">Ombudsman anonymous portal</span>
              </div>
              <span className="text-xs font-semibold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                6 Cases (All Closed)
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Confirmed Cases of Bribery / Corruption</span>
                <span className="text-[11px] text-slate-500">SEBI BRSR Core P1 mandatory attribute</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Zero
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Disputed Statutory Tax Dues</span>
                <span className="text-[11px] text-slate-500">Income Tax &amp; GST appeals reconciliation</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Reconciled with Audit
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
