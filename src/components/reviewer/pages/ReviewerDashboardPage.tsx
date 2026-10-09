import React from 'react';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck2,
  XCircle,
  BarChart3,
  TrendingUp,
  Calendar,
  Activity,
  PieChart,
  FileSearch,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { MetricCard } from '../../admin/common/MetricCard';
import { useNexusData } from '../../../context/NexusDataContext';
import { Link, useNavigate } from 'react-router-dom';

export const ReviewerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { assignments, submissions, evidence, auditHistory } = useNexusData();

  const totalAssigned = assignments.length;
  const pendingApprovals = assignments.filter(
    (a) => a.status === 'under_review' || a.status === 'submitted' || a.status === 'resubmitted'
  ).length;
  const approvedCount = assignments.filter((a) => a.status === 'approved').length;
  const correctionsCount = assignments.filter((a) => a.status === 'correction_requested').length;
  const rejectedCount = assignments.filter((a) => a.status === 'rejected').length;
  const resubmissionsCount = assignments.filter((a) => a.status === 'resubmitted').length;
  const validationFlagsCount = submissions.filter(
    (s) => s.anomaly?.isAnomaly && !s.anomaly?.isExplanationAccepted
  ).length;
  const evidenceCount = evidence.length;

  // Principles P1-P9 Breakdown
  const principles = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9'] as const;
  const principleStats = principles.map((p) => {
    const pAssignments = assignments.filter((a) => a.brsrPrinciple === p);
    const approved = pAssignments.filter((a) => a.status === 'approved').length;
    return {
      principle: p,
      total: pAssignments.length,
      approved,
      pct: pAssignments.length > 0 ? Math.round((approved / pAssignments.length) * 100) : 0,
    };
  });

  // Sections A, B, C Breakdown
  const sections = ['Section A', 'Section B', 'Section C'] as const;
  const sectionStats = sections.map((sec) => {
    const sAssignments = assignments.filter((a) => a.brsrSection === sec);
    const approved = sAssignments.filter((a) => a.status === 'approved').length;
    return {
      section: sec,
      total: sAssignments.length,
      approved,
      pct: sAssignments.length > 0 ? Math.round((approved / sAssignments.length) * 100) : 0,
    };
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Reviewer & Approver Dashboard"
        description="Monitor active review queues, evaluate automated validation anomalies, inspect supporting evidence, and grant approvals across MEIL ESG disclosures."
      />

      {/* Quick Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          <span>Priority Review Actions:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/reviewer/review-queue')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#003B73] hover:bg-[#002e5c] rounded-lg transition-colors cursor-pointer"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Open Review Queue ({pendingApprovals})</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/reviewer/validation-issues')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Review Anomalies ({validationFlagsCount})</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/reviewer/evidence-review')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-indigo-700" />
            <span>Audit Evidence ({evidenceCount})</span>
          </button>
        </div>
      </div>

      {/* 8 Summary Metrics */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
          Review Performance Indicators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Assigned for Review"
            value={totalAssigned.toString()}
            icon={ClipboardList}
            iconBg="bg-sky-50"
            iconColor="text-sky-600"
            accentBorder="border-l-sky-500"
          />
          <MetricCard
            title="Pending Approval"
            value={pendingApprovals.toString()}
            icon={Clock}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            accentBorder="border-l-amber-500"
          />
          <MetricCard
            title="Approved Submissions"
            value={approvedCount.toString()}
            icon={CheckCircle2}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            accentBorder="border-l-emerald-500"
          />
          <MetricCard
            title="Corrections Requested"
            value={correctionsCount.toString()}
            icon={AlertTriangle}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
            accentBorder="border-l-orange-500"
          />
          <MetricCard
            title="Rejected Submissions"
            value={rejectedCount.toString()}
            icon={XCircle}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
            accentBorder="border-l-rose-500"
          />
          <MetricCard
            title="Validation Flags"
            value={validationFlagsCount.toString()}
            icon={AlertTriangle}
            iconBg="bg-red-50"
            iconColor="text-red-600"
            accentBorder="border-l-[#E31E24]"
          />
          <MetricCard
            title="Evidence Documents"
            value={evidenceCount.toString()}
            icon={FileCheck2}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
            accentBorder="border-l-indigo-500"
          />
          <MetricCard
            title="Resubmissions"
            value={resubmissionsCount.toString()}
            icon={FileSearch}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            accentBorder="border-l-purple-500"
          />
        </div>
      </div>

      {/* Analytical Panels Grid */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
          Review Analytics &amp; Workflow Panels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Panel 1: Review Status Distribution */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Review Status Distribution</h3>
                <PieChart className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-700 font-semibold">Approved</span>
                    <span className="font-bold">{approvedCount} / {totalAssigned}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.round((approvedCount / (totalAssigned || 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-sky-700 font-semibold">Under Review / Awaiting</span>
                    <span className="font-bold">{pendingApprovals} / {totalAssigned}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-sky-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.round((pendingApprovals / (totalAssigned || 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-orange-700 font-semibold">Correction Requested</span>
                    <span className="font-bold">{correctionsCount} / {totalAssigned}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.round((correctionsCount / (totalAssigned || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link
                to="/reviewer/review-queue"
                className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center justify-between"
              >
                <span>View Full Review Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Panel 2: Section A/B/C Review Progress */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Section A/B/C Review Progress</h3>
                <BarChart3 className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-4">
                {sectionStats.map((sec) => (
                  <div key={sec.section}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700">{sec.section}</span>
                      <span className="text-slate-500 font-bold">
                        {sec.approved} / {sec.total} ({sec.pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${sec.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link
                to="/reviewer/brsr-core"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-between"
              >
                <span>Inspect SEBI BRSR Core</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Panel 3: Principles P1-P9 Review Coverage */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Principles P1-P9 Coverage</h3>
                <BarChart3 className="w-4 h-4 text-slate-400" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {principleStats.map((p) => (
                  <div
                    key={p.principle}
                    className="p-2 rounded-lg border border-slate-100 bg-slate-50 text-center"
                  >
                    <span className="font-bold text-xs text-slate-800 block">{p.principle}</span>
                    <span className="text-[10px] text-slate-500">
                      {p.approved}/{p.total}
                    </span>
                    <div className="w-full bg-slate-200 rounded-full h-1 mt-1">
                      <div
                        className={`h-1 rounded-full ${
                          p.pct === 100
                            ? 'bg-emerald-500'
                            : p.pct > 0
                            ? 'bg-amber-500'
                            : 'bg-slate-300'
                        }`}
                        style={{ width: `${p.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link
                to="/reviewer/data-lineage"
                className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center justify-between"
              >
                <span>View Data Lineage Tree</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Panel 4: Upcoming Review Deadlines */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Upcoming Review Deadlines</h3>
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-2.5">
                {assignments.slice(0, 3).map((a) => (
                  <div key={a.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 truncate max-w-[170px]">
                        {a.indicatorName}
                      </span>
                      <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                        {a.dueDate}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{a.indicatorCode} • Priority: {a.priority}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">SEBI Statutory Cycle: FY26 Q2 End</span>
            </div>
          </div>

          {/* Panel 5: Validation Exception Trend */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Validation &amp; Outlier Alerts</h3>
                <TrendingUp className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-2.5">
                {submissions.filter(s => s.anomaly?.isAnomaly).map((s) => (
                  <div key={s.assignmentId} className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900">YoY Outlier Detected</span>
                      <span className="text-[10px] font-bold text-amber-700">+{s.yoyVariancePercent}%</span>
                    </div>
                    <p className="text-[11px] text-amber-800 mt-1 line-clamp-2">
                      {s.anomaly?.explanationProvided || s.anomaly?.anomalyReason || 'Variance exceeded threshold for reported fuel and power metrics.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link
                to="/reviewer/validation-issues"
                className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center justify-between"
              >
                <span>Resolve Anomalies</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Panel 6: Recent Review Activity */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Recent Review Activity</h3>
                <Activity className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-2.5">
                {auditHistory.slice(0, 3).map((hist) => (
                  <div key={hist.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{hist.decision}: {hist.indicatorCode}</span>
                      <span className="text-[10px] text-slate-400">{hist.reviewDate}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{hist.reviewedBy} • {hist.comments || hist.evidenceSummary}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link
                to="/reviewer/activity-history"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-between"
              >
                <span>View Full Audit Log</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
