import React, { useState } from 'react';
import {
  Leaf,
  Flame,
  Zap,
  Droplet,
  Trash2,
  Calendar,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { MetricCard } from '../../admin/common/MetricCard';
import { useNexusData } from '../../../context/NexusDataContext';

export const EnvironmentalPage: React.FC = () => {
  const { organizations } = useNexusData();
  const [selectedBu, setSelectedBu] = useState<string>('all');

  // Filter project nodes
  const subsidiaries = organizations.filter((o) => o.type === 'Subsidiary' || o.type === 'BusinessUnit');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Environmental Pillar (P2 & P6 Performance)"
        description="Consolidated environmental metrics covering Scope 1 & 2 GHG emissions, energy intensity, water stewardship, waste circularity, and renewable transition across MEIL infrastructure projects."
      />

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Operational Scope:</span>
          <select
            value={selectedBu}
            onChange={(e) => setSelectedBu(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-600"
          >
            <option value="all">MEIL Group (Consolidated Enterprise)</option>
            {subsidiaries.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Statutory Cycle: FY 2025-2026 (SEBI Core)</span>
        </div>
      </div>

      {/* Executive Environmental KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total GHG Scope 1 & 2"
          value="42,850 tCO2e"
          icon={Flame}
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
          accentBorder="border-l-rose-500"
        />
        <MetricCard
          title="Energy Intensity"
          value="18.4 GJ / Cr"
          icon={Zap}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          accentBorder="border-l-amber-500"
        />
        <MetricCard
          title="Water Recycled Ratio"
          value="41.8 %"
          icon={Droplet}
          iconBg="bg-sky-50"
          iconColor="text-sky-600"
          accentBorder="border-l-sky-500"
        />
        <MetricCard
          title="Construction Waste Recycled"
          value="91.4 %"
          icon={Trash2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          accentBorder="border-l-emerald-500"
        />
      </div>

      {/* GHG Scope 1 & Scope 2 Emissions Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">GHG Footprint Breakdown (tCO2e)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Calculated as per GHG Protocol &amp; CEA India Grid Factors</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              -4.2% YoY
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Scope 1: Direct Diesel &amp; Fleet Emissions</span>
                <span className="font-bold text-slate-900">28,450 tCO2e (66.4%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: '66.4%' }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">High-capacity excavators, dumpers, and batching plants.</p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Scope 2: Purchased Electricity (Grid HT Tariff)</span>
                <span className="font-bold text-slate-900">14,400 tCO2e (33.6%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '33.6%' }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Power drawn for tunnel boring, site camps &amp; fabrication yards.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs mt-3">
              <span className="font-semibold text-slate-700">Scope 3 (Supply Chain Screening)</span>
              <span className="text-slate-600 font-mono">112,000 tCO2e (Steel &amp; Cement Embodied Carbon)</span>
            </div>
          </div>
        </div>

        {/* Water & Wastewater Management */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Water Stewardship &amp; Recycling</h3>
              <p className="text-xs text-slate-500 mt-0.5">Withdrawal volume vs onsite recycling across major projects</p>
            </div>
            <Droplet className="w-4 h-4 text-sky-500" />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-sky-50/60 border border-sky-100">
                <span className="text-[11px] font-semibold text-sky-800 uppercase block">Total Water Withdrawn</span>
                <span className="text-lg font-black text-sky-950 mt-1 block">1,240,000 kL</span>
                <span className="text-[10px] text-sky-700">Surface &amp; Groundwater NOCs</span>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase block">Total Recycled / Reused</span>
                <span className="text-lg font-black text-emerald-950 mt-1 block">518,320 kL</span>
                <span className="text-[10px] text-emerald-700">Curing &amp; Dust Suppression</span>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-700 mb-2">Water-Stressed Zone Compliance (SEBI BRSR Core)</h4>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Projects in Over-Exploited / Critical Basins</span>
                  <span className="font-bold text-slate-800">2 Sites (Raipur &amp; Marathwada)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Specific Water Consumption Target</span>
                  <span className="font-bold text-emerald-600">Achieved (12% reduction)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Site Level Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Key Infrastructure Projects - Environmental Disclosures</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-ready numbers sourced from site sensor telematics and approved by designated Lead Reviewers.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Site / Project Unit</th>
                <th className="px-4 py-3">Sector</th>
                <th className="px-4 py-3">Scope 1 (tCO2e)</th>
                <th className="px-4 py-3">Scope 2 (tCO2e)</th>
                <th className="px-4 py-3">Energy (GJ)</th>
                <th className="px-4 py-3">Water Recycled %</th>
                <th className="px-4 py-3">BRSR Core Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">
                  Expressway Project Phase-II (Raipur)
                </td>
                <td className="px-4 py-3">Roads &amp; Highways</td>
                <td className="px-4 py-3 font-mono font-medium">12,450</td>
                <td className="px-4 py-3 font-mono font-medium">4,200</td>
                <td className="px-4 py-3 font-mono font-medium">185,200</td>
                <td className="px-4 py-3 font-semibold text-emerald-600">44.5%</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Verified
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">
                  Kaleshwaram Lift Irrigation Site 4
                </td>
                <td className="px-4 py-3">Irrigation &amp; Water</td>
                <td className="px-4 py-3 font-mono font-medium">9,800</td>
                <td className="px-4 py-3 font-mono font-medium">8,100</td>
                <td className="px-4 py-3 font-mono font-medium">210,400</td>
                <td className="px-4 py-3 font-semibold text-emerald-600">52.1%</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Verified
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">
                  Pavagada 500MW Solar Park
                </td>
                <td className="px-4 py-3">Renewable Energy</td>
                <td className="px-4 py-3 font-mono font-medium">420</td>
                <td className="px-4 py-3 font-mono font-medium">180</td>
                <td className="px-4 py-3 font-mono font-medium">8,500</td>
                <td className="px-4 py-3 font-semibold text-emerald-600">89.0%</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Verified
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
