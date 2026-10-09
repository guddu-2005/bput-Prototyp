import React, { useState } from 'react';
import { Send, CheckCircle2, Radio } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';

export const AdminNotificationsPage: React.FC = () => {
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'contributors' | 'reviewers'>('all');
  const [toast, setToast] = useState<string | null>(null);

  const [broadcastHistory, setBroadcastHistory] = useState([
    {
      id: 'b-1',
      title: 'FY26 Q2 Interim BRSR Submissions Deadline Reminder',
      target: 'All Data Contributors',
      date: 'Today, 10:00 AM',
      author: 'Rajesh Sharma (Admin)',
      readCount: '18 / 22 Acknowledged',
    },
    {
      id: 'b-2',
      title: 'Updated CEA Grid Emission Factors v19 Released',
      target: 'All Reviewers & Contributors',
      date: '3 days ago',
      author: 'Rajesh Sharma (Admin)',
      readCount: 'All Acknowledged',
    },
  ]);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    setBroadcastHistory((prev) => [
      {
        id: `b-${Date.now()}`,
        title: broadcastTitle,
        target: targetAudience === 'all' ? 'All Portal Users' : targetAudience === 'contributors' ? 'All Contributors' : 'All Reviewers',
        date: 'Just now',
        author: 'Rajesh Sharma (Admin)',
        readCount: '0 / 22 Acknowledged',
      },
      ...prev,
    ]);

    setToast(`Broadcast announcement successfully dispatched.`);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications & Broadcast Center"
        description="Dispatch automated workflow reminders, compliance escalations, and group-wide methodology updates to contributors and reviewers."
      />

      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Broadcast */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit">
          <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-indigo-600" />
            Dispatch Broadcast
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Push an alert to portal dashboards and notification centers.
          </p>

          <form onSubmit={handleSendBroadcast} className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as 'all' | 'contributors' | 'reviewers')}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700"
              >
                <option value="all">All Portal Users (Group-wide)</option>
                <option value="contributors">Data Contributors Only</option>
                <option value="reviewers">Reviewers &amp; Approvers Only</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Announcement Title</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Urgent: Q2 Utility Invoices Due"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Detailed Message</label>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Specify requirements, deadlines, or action items..."
                rows={4}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#003B73] hover:bg-[#002e5c] rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Broadcast Alert</span>
            </button>
          </form>
        </div>

        {/* Broadcast History */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Broadcast Log &amp; Acknowledgments</h3>
          <p className="text-xs text-slate-500 mb-4">
            Track message delivery and read receipts across site engineers and department leads.
          </p>

          <div className="space-y-3">
            {broadcastHistory.map((item) => (
              <div key={item.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800">{item.title}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span>Target: <strong className="text-slate-700">{item.target}</strong></span>
                  <span>•</span>
                  <span>Dispatched by: <strong className="text-slate-700">{item.author}</strong></span>
                </div>
                <div className="pt-2 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {item.readCount}
                  </span>
                  <span className="text-slate-400 font-mono">Delivered via Portal UI</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
