import React from 'react';
import {
  Users,
  Shield,
  HeartHandshake,
  GraduationCap,
  HardHat,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { MetricCard } from '../../admin/common/MetricCard';

export const SocialPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Social Pillar (P3, P4, P5, P8 & P9 Performance)"
        description="Workforce welfare, health and occupational safety across large project sites, human rights due diligence, gender diversity, and CSR social infrastructure investments."
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Active Workforce"
          value="38,420"
          icon={Users}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          accentBorder="border-l-indigo-600"
        />
        <MetricCard
          title="Lost Time Injury Rate (LTIFR)"
          value="0.08"
          icon={HardHat}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          accentBorder="border-l-emerald-500"
        />
        <MetricCard
          title="Avg HSE Safety Training"
          value="42.5 hrs / worker"
          icon={GraduationCap}
          iconBg="bg-sky-50"
          iconColor="text-sky-600"
          accentBorder="border-l-sky-500"
        />
        <MetricCard
          title="CSR Expenditure (FY26)"
          value="₹84.6 Cr"
          icon={HeartHandshake}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          accentBorder="border-l-amber-500"
        />
      </div>

      {/* Workforce & Safety Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workforce Demographics */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-800">Workforce Composition &amp; Diversity</h3>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Permanent Employees</span>
                <span className="text-lg font-bold text-slate-900 block mt-1">8,240 (21.4%)</span>
                <span className="text-[10px] text-slate-500">Engineers, PMs &amp; Corporate</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Contractual Workers</span>
                <span className="text-lg font-bold text-slate-900 block mt-1">30,180 (78.6%)</span>
                <span className="text-[10px] text-slate-500">Site technicians &amp; operators</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Female Representation in Technical &amp; Engineering</span>
                <span className="font-bold text-indigo-700">14.8% (Target: 18% by FY28)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '14.8%' }} />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-900 block">PF, ESI &amp; Statutory Benefits Coverage</span>
                <span className="text-[11px] text-emerald-700">100% statutory adherence across all subcontractors</span>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
                Audited
              </span>
            </div>
          </div>
        </div>

        {/* Occupational Health & Safety */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-800">Occupational Health &amp; Site Safety</h3>
            <Shield className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Fatalities</span>
                <span className="text-xl font-black text-emerald-600 mt-1 block">0</span>
                <span className="text-[10px] text-slate-400">Zero Harm Goal</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Near Misses Logged</span>
                <span className="text-xl font-black text-amber-600 mt-1 block">142</span>
                <span className="text-[10px] text-slate-400">100% Mitigated</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Safe Man-Hours</span>
                <span className="text-xl font-black text-indigo-700 mt-1 block">48.2M</span>
                <span className="text-[10px] text-slate-400">Across 22 Mega Sites</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="font-medium text-slate-700">Mandatory Tool-box Talks &amp; Height Safety Drills</span>
                <span className="font-bold text-emerald-600">Daily 100% Enforced</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="font-medium text-slate-700">Annual Occupational Health Screenings</span>
                <span className="font-bold text-emerald-600">34,120 Workers Screened</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSR & Community Development Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-1">Corporate Social Responsibility &amp; Small Town Impact</h3>
        <p className="text-xs text-slate-500 mb-4">
          Aligned with SEBI BRSR Principle 8 and Schedule VII of the Companies Act, 2013.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs space-y-1.5">
            <h4 className="font-bold text-indigo-950">Safe Drinking Water (Mission Bhagiratha)</h4>
            <p className="text-indigo-800 text-[11px]">
              Provided potable pipeline connections to over 1.4 million rural households across semi-arid regions.
            </p>
            <span className="text-[10px] font-bold text-indigo-600 block mt-2">Spend: ₹42.0 Cr</span>
          </div>

          <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs space-y-1.5">
            <h4 className="font-bold text-emerald-950">Skill Development Centers (MEIL Pragathi)</h4>
            <p className="text-emerald-800 text-[11px]">
              Free certified vocational skill training for 6,400 youth in heavy equipment handling and electrical maintenance.
            </p>
            <span className="text-[10px] font-bold text-emerald-600 block mt-2">Spend: ₹24.2 Cr</span>
          </div>

          <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-100 text-xs space-y-1.5">
            <h4 className="font-bold text-amber-950">Rural Health Clinics &amp; Ambulances</h4>
            <p className="text-amber-800 text-[11px]">
              Mobile dispensary units operating in interior construction corridor villages, treating over 85,000 villagers.
            </p>
            <span className="text-[10px] font-bold text-amber-600 block mt-2">Spend: ₹18.4 Cr</span>
          </div>
        </div>
      </div>
    </div>
  );
};
