import React from 'react';
import { History } from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { useNexusData } from '../../../context/NexusDataContext';

export const ManagementActivityPage: React.FC = () => {
  const { auditHistory } = useNexusData();

  // Management related activities
  const mgmtActivities = [
    {
      id: 'act-1',
      title: 'Board Sustainability Committee Pre-Approval Granted',
      actor: 'Dr. V. Rao (Chief Sustainability Officer)',
      timestamp: 'Today, 04:30 PM',
      details: 'Reviewed Scope 1 diesel intensity variances and approved mitigation plan for SEBI filing.',
      type: 'approval',
    },
    {
      id: 'act-2',
      title: 'Requested Clarification on Water Extraction NOC',
      actor: 'Dr. V. Rao (Chief Sustainability Officer)',
      timestamp: 'Yesterday, 02:15 PM',
      details: 'Sent request to Environmental Officer regarding Kaleshwaram CGWA renewal timeline.',
      type: 'clarification',
    },
    {
      id: 'act-3',
      title: 'Assurance Sampling Protocol Provisioned',
      actor: 'Dr. V. Rao (Chief Sustainability Officer)',
      timestamp: '3 days ago, 11:00 AM',
      details: 'Authorized external assurance team access to raw IOCL fuel invoices and CSPDCL power slips.',
      type: 'assurance',
    },
    ...auditHistory.map((h) => ({
      id: h.id,
      title: `${h.decision}: ${h.indicatorName}`,
      actor: h.reviewedBy,
      timestamp: h.reviewDate,
      details: h.comments || h.evidenceSummary,
      type: 'audit',
    })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Activity & Governance Log"
        description="Chronological audit history of management reviews, executive sign-off events, clarification requests, and Board committee decisions."
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {mgmtActivities.map((act) => (
          <div key={act.id} className="p-4 flex items-start gap-3 hover:bg-slate-50/60 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
              <History className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                <span className="text-[10px] text-slate-400 font-medium">{act.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{act.details}</p>
              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                <span className="font-semibold text-slate-700">{act.actor}</span>
                <span>•</span>
                <span className="uppercase font-bold tracking-wider text-indigo-600">{act.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
