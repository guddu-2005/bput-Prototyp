import React, { useState } from 'react';
import {
  Building2,
  FolderTree,
  CheckCircle2,
  Play,
  RotateCw,
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { useNexusData } from '../../../context/NexusDataContext';

export const AdminConsolidationPage: React.FC = () => {
  const { organizations } = useNexusData();
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunTimestamp, setLastRunTimestamp] = useState<string>('Today at 04:15 PM');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRunConsolidation = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setLastRunTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setToastMessage('Consolidation engine completed successfully. Group totals aggregated across 22 sites.');
      setTimeout(() => setToastMessage(null), 4000);
    }, 1200);
  };

  const subsidiaries = organizations.filter((o) => o.type === 'Subsidiary');
  const businessUnits = organizations.filter((o) => o.type === 'BusinessUnit');
  const projects = organizations.filter((o) => o.type === 'Project');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Multi-Entity Consolidation Engine"
        description="Configure reporting boundaries, operational control vs financial control logic, and execute automated roll-ups across MEIL subsidiaries, business units, and site projects."
      />

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Control Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Boundary Standard: SEBI BRSR Core v2.0
            </span>
            <span className="text-xs text-slate-500">Last Roll-up: {lastRunTimestamp}</span>
          </div>
          <h2 className="text-sm font-bold text-slate-800 mt-2">
            Operational Control Approach (100% Activity Accounting)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Includes all active EPC construction sites, fabrication yards, and subsidiary facilities where MEIL exercises operational control.
          </p>
        </div>

        <button
          type="button"
          disabled={isRunning}
          onClick={handleRunConsolidation}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#003B73] hover:bg-[#002e5c] rounded-xl shadow-xs transition-colors cursor-pointer shrink-0 disabled:opacity-50"
        >
          {isRunning ? (
            <RotateCw className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
          <span>{isRunning ? 'Aggregating Entities...' : 'Run Group Roll-up'}</span>
        </button>
      </div>

      {/* Boundary & Scope Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Parent Entity</span>
          <p className="text-base font-bold text-slate-900 mt-1">Megha Engineering &amp; Infrastructures Ltd</p>
          <p className="text-[11px] text-slate-500 mt-1">Consolidation Scope: Group HQ</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Subsidiaries In-Scope</span>
          <p className="text-base font-bold text-slate-900 mt-1">{subsidiaries.length} Operating Entities</p>
          <p className="text-[11px] text-slate-500 mt-1">100% Equity / Full Consolidation</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Active Sites / BU Nodes</span>
          <p className="text-base font-bold text-slate-900 mt-1">
            {businessUnits.length + projects.length} Tracked Nodes
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Telemetry &amp; Site Logs connected</p>
        </div>
      </div>

      {/* Entity Tree Hierarchy */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Consolidated Entity Hierarchy</h3>
          <span className="text-xs font-semibold text-slate-500">Method: Operational Control</span>
        </div>

        <div className="p-4 space-y-3">
          {subsidiaries.map((sub) => {
            const childBUs = organizations.filter((o) => o.parentId === sub.id);

            return (
              <div key={sub.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-700" />
                    <span className="font-bold text-xs text-slate-900">{sub.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      Subsidiary (100%)
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600">Reconciled</span>
                </div>

                <div className="pl-6 space-y-2 border-l-2 border-indigo-200 ml-2">
                  {childBUs.map((bu) => {
                    const childProjects = organizations.filter((o) => o.parentId === bu.id);

                    return (
                      <div key={bu.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <FolderTree className="w-3.5 h-3.5 text-slate-400" />
                            {bu.name}
                          </span>
                          <span className="text-[11px] text-slate-500">{childProjects.length} Projects</span>
                        </div>

                        <div className="pl-5 space-y-1">
                          {childProjects.map((p) => (
                            <div
                              key={p.id}
                              className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between text-[11px]"
                            >
                              <span className="text-slate-700 font-medium">{p.name}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                100% Telemetry Active
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
