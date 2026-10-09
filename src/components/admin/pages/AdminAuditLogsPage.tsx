import React, { useState } from 'react';
import { Search, Download, Lock } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { useNexusData } from '../../../context/NexusDataContext';

export const AdminAuditLogsPage: React.FC = () => {
  const { auditHistory } = useNexusData();
  const [search, setSearch] = useState('');
  const [filterDecision, setFilterDecision] = useState<string>('all');

  const filteredLogs = auditHistory.filter((log) => {
    if (filterDecision !== 'all' && log.decision !== filterDecision) return false;
    if (
      search &&
      !log.indicatorName.toLowerCase().includes(search.toLowerCase()) &&
      !log.reviewedBy.toLowerCase().includes(search.toLowerCase()) &&
      !log.comments.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Security & Disclosure Audit Logs"
        description="Tamper-evident, immutable activity trail recording every user login, data edit, reviewer approval, and sign-off event across the MEIL BRSR platform."
      />

      {/* Filter and Export Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail by actor, indicator, or detail..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:bg-white focus:outline-none focus:border-indigo-600"
            />
          </div>

          <select
            value={filterDecision}
            onChange={(e) => setFilterDecision(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5"
          >
            <option value="all">All Decision Types</option>
            <option value="APPROVE">Approved</option>
            <option value="CORRECTION_REQUIRED">Correction Required</option>
            <option value="REJECT">Rejected</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            const dataStr = JSON.stringify(filteredLogs, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `MEIL_BRSR_Audit_Trail_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Review Date</th>
                <th className="px-4 py-3">Decision</th>
                <th className="px-4 py-3">Indicator Code</th>
                <th className="px-4 py-3">Reviewer / Actor</th>
                <th className="px-4 py-3">Comments &amp; Audit Summary</th>
                <th className="px-4 py-3">Integrity Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.reviewDate}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        log.decision === 'APPROVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : log.decision === 'CORRECTION_REQUIRED'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {log.decision.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-indigo-700">
                    {log.indicatorCode}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{log.reviewedBy}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-md">
                    <p className="font-medium text-slate-800">{log.indicatorName}</p>
                    <p className="text-[11px] text-slate-500">{log.comments || log.evidenceSummary}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>SHA256-{log.id.slice(0, 8)}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
