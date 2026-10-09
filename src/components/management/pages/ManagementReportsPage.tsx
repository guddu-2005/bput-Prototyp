import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  FileText,
  FileCode,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';

export const ManagementReportsPage: React.FC = () => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (type: string, filename: string) => {
    // Generate text/csv/json dummy download blob
    const content = `MEIL BRSR ESG REPORT (${type.toUpperCase()})\nReporting Period: FY 2025-26\nConglomerate: Megha Engineering & Infrastructures Ltd (MEIL)\nExported At: ${new Date().toISOString()}\nStatus: Pre-Assurance Signed-Off\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setDownloadSuccess(`Downloaded ${filename} successfully.`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consolidated Reports & Export Center"
        description="Generate official SEBI BRSR reports, statutory XBRL filings, Board sustainability slide decks, and detailed indicator data archives."
      />

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Main Report Formats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Official BRSR Annual Report */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">MEIL BRSR Comprehensive Report (PDF)</h3>
            <p className="text-xs text-slate-500 mt-1">
              Full 142-page statutory annual sustainability report covering Section A, B, and Principles P1 through P9.
            </p>
            <div className="mt-4 space-y-1.5 text-[11px] text-slate-600">
              <p>• Formatted for SEBI &amp; BSE/NSE annual filing</p>
              <p>• Includes assurance readiness certificate</p>
              <p>• High-resolution executive infographics</p>
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleDownload('pdf', 'MEIL_BRSR_Comprehensive_FY26.pdf')}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Card 2: SEBI XBRL Statutory Schema */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">SEBI BRSR XBRL Taxonomy Package</h3>
            <p className="text-xs text-slate-500 mt-1">
              Machine-readable XML/XBRL taxonomy dataset validated against the official SEBI BRSR taxonomy schema v2.0.
            </p>
            <div className="mt-4 space-y-1.5 text-[11px] text-slate-600">
              <p>• 100% tag compliance for SEBI e-filing portal</p>
              <p>• Numeric precision validated across 9 principles</p>
              <p>• Schema checksum integrity verified</p>
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleDownload('xbrl', 'MEIL_BRSR_Taxonomy_FY26.xml')}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export XBRL (XML)</span>
            </button>
          </div>
        </div>

        {/* Card 3: Auditor Excel Databook */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Auditor ESG Excel Databook (XLSX)</h3>
            <p className="text-xs text-slate-500 mt-1">
              Complete tabular export of all 42 indicators, formulas, activity volumes, emission factors, and project IDs.
            </p>
            <div className="mt-4 space-y-1.5 text-[11px] text-slate-600">
              <p>• Tab-wise breakdown for Section A, B, and C</p>
              <p>• Linked to evidence document index</p>
              <p>• Prepared for Big-4 assurance engagement</p>
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleDownload('xlsx', 'MEIL_BRSR_DataBook_FY26.xlsx')}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
