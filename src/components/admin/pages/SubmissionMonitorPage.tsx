import React, { useState } from 'react';
import { Send, CheckCircle2, Eye } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { useNexusData } from '../../../context/NexusDataContext';
import { Link } from 'react-router-dom';

export const SubmissionMonitorPage: React.FC = () => {
  const { assignments, organizations, users } = useNexusData();
  const [activeStatusTab, setActiveStatusTab] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  const STATUS_TABS = [
    { id: 'all', label: 'All Submissions' },
    { id: 'under_review', label: 'Under Review' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'correction_requested', label: 'Correction Requested' },
    { id: 'approved', label: 'Approved' },
    { id: 'draft', label: 'Draft / In Progress' },
  ];

  const handleSendReminder = (contributorName: string) => {
    setReminderToast(`Automated reminder notification sent to ${contributorName}.`);
    setTimeout(() => setReminderToast(null), 3500);
  };

  const filteredAssignments = assignments.filter((a) => {
    if (activeStatusTab !== 'all' && a.status !== activeStatusTab) return false;
    if (
      search &&
      !a.indicatorName.toLowerCase().includes(search.toLowerCase()) &&
      !a.indicatorCode.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="BRSR Control Center & Submission Workflow Monitor"
        description="Monitor real-time data collection status, multi-stage approval workflows, contributor assignments, and review progress across MEIL group disclosures."
      />

      {reminderToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{reminderToast}</span>
        </div>
      )}

      {/* Workflow Status Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Submissions</span>
          <p className="text-xl font-black text-slate-800 mt-1">{assignments.length}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-sky-600 uppercase">Under Review</span>
          <p className="text-xl font-black text-sky-700 mt-1">
            {assignments.filter((a) => a.status === 'under_review' || a.status === 'submitted').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase">Approved &amp; Verified</span>
          <p className="text-xl font-black text-emerald-700 mt-1">
            {assignments.filter((a) => a.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-orange-600 uppercase">Corrections</span>
          <p className="text-xl font-black text-orange-700 mt-1">
            {assignments.filter((a) => a.status === 'correction_requested').length}
          </p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs overflow-x-auto custom-scrollbar">
        <div className="flex gap-1 min-w-max">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveStatusTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeStatusTab === tab.id
                  ? 'bg-[#003B73] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by indicator code, title, or project..."
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 w-80 focus:bg-white focus:outline-none focus:border-indigo-600"
        />
        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredAssignments.length} of {assignments.length} assignments
        </span>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Indicator / Disclosure</th>
                <th className="px-4 py-3">Reporting Entity</th>
                <th className="px-4 py-3">Assigned Contributor</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssignments.map((a) => {
                const org = organizations.find((o) => o.id === a.orgId);
                const contributor = users.find((u) => u.id === a.contributorId);

                return (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">{a.indicatorCode}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900 block">{a.indicatorName}</span>
                      <span className="text-[10px] text-slate-400">
                        {a.brsrSection} • {a.brsrPrinciple} {a.isBrsrCore && '• SEBI Core'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{org?.name || 'MEIL Group'}</td>
                    <td className="px-4 py-3 text-slate-700">{contributor?.name || 'Assigned Contributor'}</td>
                    <td className="px-4 py-3 text-slate-600">{a.dueDate}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          a.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : a.status === 'under_review' || a.status === 'submitted'
                            ? 'bg-sky-100 text-sky-800'
                            : a.status === 'correction_requested'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {a.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        {a.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => handleSendReminder(contributor?.name || 'Contributor')}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            <Send className="w-3 h-3 text-slate-500" />
                            <span>Remind</span>
                          </button>
                        )}
                        <Link
                          to={`/reviewer/submission-detail/${a.id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </Link>
                      </div>
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
