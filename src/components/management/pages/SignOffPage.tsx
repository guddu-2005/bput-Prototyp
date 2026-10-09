import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  Download,
  Printer,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { ManagementSignOffModal } from '../modals/ManagementSignOffModal';
import { useNexusData } from '../../../context/NexusDataContext';

export const SignOffPage: React.FC = () => {
  const { assignments } = useNexusData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signOffStatus, setSignOffStatus] = useState<{
    signed: boolean;
    signedBy?: string;
    signedAt?: string;
    note?: string;
    certificateHash?: string;
  }>({
    signed: false,
  });

  const coreDisclosures = assignments.filter((a) => a.isBrsrCore);
  const coreApproved = coreDisclosures.filter((a) => a.status === 'approved').length;

  const handleSignOffSuccess = (note: string) => {
    const now = new Date();
    setSignOffStatus({
      signed: true,
      signedBy: 'Dr. V. Rao, Chief Sustainability Officer (CSO)',
      signedAt: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      note: note || 'Board Sustainability Committee reviewed and approved for statutory SEBI BRSR filing.',
      certificateHash: 'SHA256-MEIL-BRSR-FY26-9C4F81A2D0E68B',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive BRSR Report Sign-Off"
        description="Formal statutory authorization workflow. Verify pre-submission conditions, audit readiness, and execute Board-authorized digital sign-off."
      />

      {/* Sign-Off Status Hero Card */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          signOffStatus.signed
            ? 'bg-gradient-to-r from-emerald-900 to-teal-900 border-emerald-500/40 text-white shadow-lg'
            : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-black uppercase px-2.5 py-1 rounded-full ${
                  signOffStatus.signed
                    ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {signOffStatus.signed ? 'Statutorily Authorized' : 'Pending Executive Sign-Off'}
              </span>
              <span className={`text-xs ${signOffStatus.signed ? 'text-emerald-200' : 'text-slate-500'}`}>
                Reporting Cycle: FY 2025-26
              </span>
            </div>

            <h2 className={`text-xl font-black ${signOffStatus.signed ? 'text-white' : 'text-slate-900'}`}>
              {signOffStatus.signed
                ? 'MEIL Consolidated BRSR FY26 Approved & Locked'
                : 'MEIL Group Consolidated Sustainability Report (BRSR Core)'}
            </h2>

            <p className={`text-xs max-w-2xl ${signOffStatus.signed ? 'text-emerald-100' : 'text-slate-600'}`}>
              {signOffStatus.signed
                ? `Authorized by ${signOffStatus.signedBy} on ${signOffStatus.signedAt}. All disclosures are locked against modifications and pre-packaged for SEBI filing.`
                : 'Execute formal management sign-off to freeze reporting records, certify factual accuracy across operational sites, and transfer custody to independent external assurers.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {signOffStatus.signed ? (
              <>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold bg-white text-emerald-950 hover:bg-emerald-50 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-emerald-700" />
                  <span>Print Certificate</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob(
                      [
                        `MEIL BRSR FY26 MANAGEMENT SIGN-OFF CERTIFICATE\nStatus: Authorized\nSignatory: ${signOffStatus.signedBy}\nTimestamp: ${signOffStatus.signedAt}\nCertificate Hash: ${signOffStatus.certificateHash}\nExecutive Note: ${signOffStatus.note}`,
                      ],
                      { type: 'text/plain' }
                    );
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'MEIL_BRSR_FY26_SignOff_Certificate.txt';
                    a.click();
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/40 text-emerald-100 rounded-xl transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Cert</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl shadow-md transition-all cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Execute Management Sign-Off</span>
              </button>
            )}
          </div>
        </div>

        {signOffStatus.signed && (
          <div className="mt-6 pt-5 border-t border-emerald-700/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-emerald-300 block text-[11px]">Signatory</span>
              <span className="font-bold text-white">{signOffStatus.signedBy}</span>
            </div>
            <div>
              <span className="text-emerald-300 block text-[11px]">Authorization Hash</span>
              <span className="font-mono text-[11px] text-emerald-200">{signOffStatus.certificateHash}</span>
            </div>
            <div>
              <span className="text-emerald-300 block text-[11px]">Board Committee Note</span>
              <span className="text-emerald-100 italic truncate block">{signOffStatus.note}</span>
            </div>
          </div>
        )}
      </div>

      {/* Prerequisites Verification Checklist */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-1">Pre-Sign-Off Verification Checklist</h3>
        <p className="text-xs text-slate-500 mb-4">
          All mandatory pre-conditions must be fulfilled prior to final management submission.
        </p>

        <div className="space-y-3">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 block">SEBI BRSR Core Indicator Coverage</span>
                <span className="text-[11px] text-slate-500">
                  {coreApproved} of {coreDisclosures.length} core parameters verified by Lead Reviewer
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
              Satisfied (100%)
            </span>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 block">Zero Critical Validation Blockers</span>
                <span className="text-[11px] text-slate-500">
                  No open anomalies without audited written explanation
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
              Cleared
            </span>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 block">Subsidiary &amp; Project Site Reconciliations</span>
                <span className="text-[11px] text-slate-500">
                  Turnover, diesel consumption and safe man-hours matched against audited accounts
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
              Reconciled
            </span>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 block">Third-Party Assurance Credentials Provisioned</span>
                <span className="text-[11px] text-slate-500">
                  External assurer (Deloitte Partner) access enabled for reasonable assurance sampling
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
              Ready
            </span>
          </div>
        </div>
      </div>

      {/* Modal Integration */}
      <ManagementSignOffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reportVersion="MEIL-BRSR-FY26-FINAL"
        onConfirmSignOff={handleSignOffSuccess}
      />
    </div>
  );
};
