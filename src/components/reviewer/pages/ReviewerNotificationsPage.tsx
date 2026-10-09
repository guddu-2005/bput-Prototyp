import React, { useState } from 'react';
import { Bell, CheckCheck, Clock, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { useNexusData } from '../../../context/NexusDataContext';
import { Link } from 'react-router-dom';

export const ReviewerNotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useNexusData();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviewer Notifications"
        description="Stay notified on pending approvals, new submissions from site contributors, correction re-submissions, and validation escalation alerts."
      />

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'all' ? 'bg-[#003B73] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'unread' ? 'bg-[#003B73] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Unread ({notifications.filter((n) => !n.isRead).length})
          </button>
        </div>

        <button
          type="button"
          onClick={markAllNotificationsRead}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark All as Read</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">No notifications found</h4>
            <p className="text-xs text-slate-500 mt-1">You are all caught up on your review workload.</p>
          </div>
        ) : (
          filtered.map((n) => {
            return (
              <div
                key={n.id}
                className={`p-4 flex items-start gap-3 transition-colors ${
                  n.isRead ? 'bg-white' : 'bg-sky-50/50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    n.type === 'submission' || n.type === 'resubmission'
                      ? 'bg-sky-100 text-sky-700'
                      : n.type === 'deadline'
                      ? 'bg-orange-100 text-orange-700'
                      : n.type === 'anomaly'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {n.type === 'anomaly' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : n.type === 'validation' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs ${n.isRead ? 'font-medium text-slate-800' : 'font-bold text-slate-900'}`}>
                      {n.title}
                    </p>
                    <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!n.isRead && (
                    <button
                      type="button"
                      onClick={() => markNotificationRead(n.id)}
                      className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                  {n.assignmentId ? (
                    <Link
                      to={`/reviewer/submission-detail/${n.assignmentId}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <Link
                      to="/reviewer/review-queue"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
                    >
                      <span>Queue</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
