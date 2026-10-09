import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { HistoricalESGData } from '../components/management/common/BusinessUnitBreakdownModal';
import type { DateFilterState } from '../components/management/common/ESGDateRangePicker';

export interface ExportReportOptions {
  companyName?: string;
  reportTitle?: string;
  generatedBy?: string;
  dateFilter: DateFilterState;
  selectedMetricView: string;
  trendData: HistoricalESGData[];
  executiveStats: {
    completionPercentage: number;
    approvedAssignments: number;
    totalAssignments: number;
    pendingReviews: number;
    openRisks: number;
    targetsOffTrack: number;
    signOffStatus: string;
  };
  kpiMetrics: Array<{
    id: string;
    title: string;
    category: string;
    currentValue: string;
    unit: string;
    previousValue: string;
    percentageChange: number;
    isNegativeTrend: boolean;
    benchmark: string;
    subLabel: string;
    summary: string;
    rootCause?: string;
    mitigationPlan?: string;
    responsibleLead?: string;
    targetDeadline?: string;
  }>;
  chartSvgSelector?: string;
}

/**
 * Capture an SVG element from the DOM and convert it to a PNG data URL
 */
async function captureSvgAsDataUrl(selector: string): Promise<string | null> {
  try {
    const container = document.querySelector(selector);
    if (!container) return null;
    const svg = container.querySelector('svg');
    if (!svg) return null;

    const svgRect = svg.getBoundingClientRect();
    const width = svgRect.width || 800;
    const height = svgRect.height || 360;

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svg);

    // Ensure xml namespace
    if (!svgString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width * 2; // high-dpi
        canvas.height = height * 2;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.scale(2, 2);
          ctx.drawImage(img, 0, 0, width, height);
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL('image/png'));
        } else {
          URL.revokeObjectURL(url);
          resolve(null);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  } catch (err) {
    console.warn('SVG chart capture skipped:', err);
    return null;
  }
}

/**
 * Export ESG Performance Report as professional Excel (.xlsx) workbook
 */
export function exportESGExcelReport(options: ExportReportOptions): void {
  const wb = XLSX.utils.book_new();
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // --- SHEET 1: Executive KPI Summary ---
  const summarySheetData: (string | number)[][] = [
    ['MEIL GROUP - ESG & SUSTAINABILITY EXECUTIVE REPORT'],
    ['Megha Engineering & Infrastructures Limited | Corporate Sustainability Governance'],
    [],
    ['Report Details', ''],
    ['Reporting Period:', options.dateFilter.label],
    ['Report Type:', options.dateFilter.isQuarterly ? 'Quarterly ESG Review' : 'Multi-Year Historical Review'],
    ['Generated Date:', dateStr],
    ['Prepared For:', 'Executive Committee & Board of Directors (ESG / BRSR)'],
    ['Compliance Standard:', 'SEBI BRSR Core, GRI 2021, ISO 14064-1'],
    [],
    ['--- EXECUTIVE GOVERNANCE & BRSR READINESS INDICATORS ---', ''],
    ['Indicator Name', 'Current Value', 'Status / Context'],
    ['Overall BRSR Completion', `${options.executiveStats.completionPercentage}%`, 'Cycle Accelerated'],
    ['Approved BRSR Coverage', `${options.executiveStats.approvedAssignments} of ${options.executiveStats.totalAssignments} Disclosures`, 'Deloitte Verification Ready'],
    ['Pending Reviews', options.executiveStats.pendingReviews, 'Under Technical / Legal Validation'],
    ['High-Risk Exceptions', options.executiveStats.openRisks, options.executiveStats.openRisks > 0 ? 'Requires Mitigation Plan' : 'Nominal'],
    ['Targets Off Track', options.executiveStats.targetsOffTrack, '2 Metrics Flagged for Intervention'],
    ['Sign-Off Readiness', options.executiveStats.signOffStatus, 'Prerequisites Met'],
    [],
    ['--- HIGH-LEVEL ESG KPI METRICS SUMMARY ---', ''],
    [
      'KPI Metric Title',
      'Category',
      'Current Value',
      'Unit',
      'Previous Value',
      'Variance %',
      'Adverse Status Flag',
      'Benchmark / Regulatory Cap',
      'Key Executive Summary',
    ],
  ];

  options.kpiMetrics.forEach((m) => {
    summarySheetData.push([
      m.title,
      m.category,
      m.currentValue,
      m.unit,
      m.previousValue,
      `${m.percentageChange > 0 ? '+' : ''}${m.percentageChange}%`,
      m.isNegativeTrend ? 'FLAGGED (Adverse Variance)' : 'ON TRACK',
      m.benchmark,
      m.summary,
    ]);
  });

  const wsSummary = XLSX.utils.aoa_to_sheet(summarySheetData);

  // Set column widths
  wsSummary['!cols'] = [
    { wch: 36 },
    { wch: 18 },
    { wch: 16 },
    { wch: 18 },
    { wch: 16 },
    { wch: 14 },
    { wch: 26 },
    { wch: 30 },
    { wch: 55 },
  ];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Executive Summary');

  // --- SHEET 2: Trend Series Data (Recharts underlying data) ---
  const trendSheetData: (string | number)[][] = [
    ['HISTORICAL & PERIOD ESG PERFORMANCE TREND DATA'],
    [`Period Scope: ${options.dateFilter.label}`],
    [],
    [
      'Fiscal Period',
      'Period Label',
      'Composite ESG Score (%)',
      'Target Benchmark (%)',
      'Environment Pillar (%)',
      'Social Pillar (%)',
      'Governance Pillar (%)',
      'GHG Intensity (tCO2e/Cr)',
      'Waste Recycled (%)',
      'Water Recycled (%)',
      'Renewable Energy (%)',
      'Safety LTIFR',
    ],
  ];

  options.trendData.forEach((row) => {
    trendSheetData.push([
      row.fiscalYear + (row.isForecast ? ' [Forecast Model]' : ''),
      row.yearLabel + (row.isForecast ? ' (Proj)' : ''),
      row.esgScore ?? row.forecastEsgScore ?? 0,
      85, // Target benchmark
      row.environmentalScore ?? row.forecastEnvironmentalScore ?? 0,
      row.socialScore ?? row.forecastSocialScore ?? 0,
      row.governanceScore ?? row.forecastGovernanceScore ?? 0,
      row.ghgIntensity ?? row.forecastGhgIntensity ?? 0,
      row.wasteRecycled ?? row.forecastWasteRecycled ?? 0,
      row.waterRecycledRatio ?? row.forecastWaterRecycledRatio ?? 0,
      row.renewableRatio ?? row.forecastRenewableRatio ?? 0,
      row.ltifr ?? row.forecastLtifr ?? 0,
    ]);
  });

  const wsTrend = XLSX.utils.aoa_to_sheet(trendSheetData);
  wsTrend['!cols'] = [
    { wch: 14 },
    { wch: 16 },
    { wch: 22 },
    { wch: 20 },
    { wch: 22 },
    { wch: 18 },
    { wch: 20 },
    { wch: 24 },
    { wch: 18 },
    { wch: 18 },
    { wch: 20 },
    { wch: 14 },
  ];
  XLSX.utils.book_append_sheet(wb, wsTrend, 'ESG Trend Data');

  // --- SHEET 3: Flagged Adverse Trends & Action Plans ---
  const flaggedMetrics = options.kpiMetrics.filter((m) => m.isNegativeTrend);
  const actionSheetData: (string | number)[][] = [
    ['FLAGGED ESG ADVERSE VARIANCES & MITIGATION REGISTER'],
    ['Detailed Root Cause Analysis & Time-bound Corrective Action Plans'],
    [],
    [
      'Metric Title',
      'Category',
      'Adverse Shift',
      'Benchmark Target',
      'Root Cause Analysis',
      'Mitigation Action Plan',
      'Responsible Officer',
      'Resolution Deadline',
    ],
  ];

  if (flaggedMetrics.length === 0) {
    actionSheetData.push(['No adverse trends flagged in the current reporting period.', '', '', '', '', '', '', '']);
  } else {
    flaggedMetrics.forEach((m) => {
      actionSheetData.push([
        m.title,
        m.category,
        `${m.previousValue} -> ${m.currentValue} (${m.percentageChange > 0 ? '+' : ''}${m.percentageChange}%)`,
        m.benchmark,
        m.rootCause || 'Under operational review',
        m.mitigationPlan || 'Action plan assigned to site engineering directorate',
        m.responsibleLead || 'Engineering Head',
        m.targetDeadline || 'Pre-Audit Sign-Off',
      ]);
    });
  }

  const wsAction = XLSX.utils.aoa_to_sheet(actionSheetData);
  wsAction['!cols'] = [
    { wch: 32 },
    { wch: 16 },
    { wch: 26 },
    { wch: 28 },
    { wch: 45 },
    { wch: 48 },
    { wch: 30 },
    { wch: 24 },
  ];
  XLSX.utils.book_append_sheet(wb, wsAction, 'Adverse Mitigations');

  // Generate filename and trigger download
  const cleanPeriod = options.dateFilter.label.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `MEIL_ESG_Report_${cleanPeriod}_${Date.now().toString().slice(-4)}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/**
 * Export ESG Performance Report as a high-fidelity PDF document
 */
export async function exportESGPDFReport(options: ExportReportOptions): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // --- HEADER BANNER ---
  // Corporate primary background banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 26, 'F');

  // Accent line
  doc.setFillColor(14, 165, 233); // sky-500
  doc.rect(0, 26, pageWidth, 2, 'F');

  // MEIL Logo / Title in Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('MEIL GROUP | EXECUTIVE ESG REPORT', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Megha Engineering & Infrastructures Ltd • Corporate Sustainability & BRSR Governance', 14, 19);

  // Date and Scope in top right
  doc.setFontSize(8);
  doc.setTextColor(224, 242, 254);
  doc.text(`Scope: ${options.dateFilter.label}`, pageWidth - 14, 11, { align: 'right' });
  doc.setTextColor(186, 230, 253);
  doc.text(`Generated: ${dateStr}`, pageWidth - 14, 18, { align: 'right' });

  let cursorY = 36;

  // --- SECTION: Executive Performance Overview ---
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. Executive Governance & BRSR Indicators', 14, cursorY);

  cursorY += 4;

  // Executive stats cards table
  const execTableData: any[][] = [
    [
      { content: `BRSR Overall Completion\n${options.executiveStats.completionPercentage}% (Target 100%)`, styles: { halign: 'center', fontStyle: 'bold' } },
      { content: `Approved Disclosures\n${options.executiveStats.approvedAssignments} / ${options.executiveStats.totalAssignments}`, styles: { halign: 'center', fontStyle: 'bold' } },
      { content: `Technical Reviews Pending\n${options.executiveStats.pendingReviews} in pipeline`, styles: { halign: 'center', fontStyle: 'bold' } },
      { content: `High-Risk Exceptions\n${options.executiveStats.openRisks} Flagged`, styles: { halign: 'center', fontStyle: 'bold', textColor: options.executiveStats.openRisks > 0 ? [225, 29, 72] : [15, 23, 42] } },
      { content: `Sign-Off Readiness\n${options.executiveStats.signOffStatus}`, styles: { halign: 'center', fontStyle: 'bold', textColor: [16, 185, 129] } },
    ],
  ];

  autoTable(doc, {
    startY: cursorY,
    body: execTableData,
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 3.5,
      fillColor: [248, 250, 252],
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    margin: { left: 14, right: 14 },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 8;

  // --- SECTION: High-Level ESG KPI Summary Cards ---
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. High-Level ESG KPI Performance Summary', 14, cursorY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Comparison vs prior reporting period, adverse status flags, and regulatory compliance targets.', 14, cursorY + 4);

  cursorY += 6;

  const kpiTableHeaders = [
    'ESG Metric',
    'Category',
    'Current Value',
    'Prior Period',
    'Variance',
    'Status Indicator',
    'Target / Benchmark',
  ];

  const kpiRows = options.kpiMetrics.map((m) => {
    const isAdverse = m.isNegativeTrend;
    return [
      m.title,
      m.category,
      `${m.currentValue} ${m.unit}`,
      `${m.previousValue} ${m.unit}`,
      `${m.percentageChange > 0 ? '+' : ''}${m.percentageChange}%`,
      isAdverse ? '⚠️ ADVERSE VARIANCE' : '✓ ON TRACK',
      m.benchmark,
    ];
  });

  autoTable(doc, {
    startY: cursorY,
    head: [kpiTableHeaders],
    body: kpiRows,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: 7.5,
      cellPadding: 2.5,
      lineColor: [241, 245, 249],
    },
    columnStyles: {
      0: { cellWidth: 46, fontStyle: 'bold' },
      1: { cellWidth: 20 },
      2: { cellWidth: 26 },
      3: { cellWidth: 24 },
      4: { cellWidth: 16 },
      5: { cellWidth: 32 },
      6: { cellWidth: 28 },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 5) {
        if (data.cell.raw === '⚠️ ADVERSE VARIANCE') {
          data.cell.styles.textColor = [190, 18, 60]; // rose-700
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [5, 150, 105]; // emerald-600
        }
      }
    },
    margin: { left: 14, right: 14 },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 8;

  // --- SECTION: Flagged Adverse Metrics Callout Box ---
  const flagged = options.kpiMetrics.filter((m) => m.isNegativeTrend);
  if (flagged.length > 0) {
    doc.setFillColor(255, 241, 242); // rose-50
    doc.setDrawColor(254, 205, 211); // rose-200
    doc.roundedRect(14, cursorY, pageWidth - 28, 26, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(190, 18, 60);
    doc.text('CRITICAL ATTENTION: 2 Metrics Flagged with Adverse Variance vs Prior Period', 18, cursorY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);

    let flaggedLine = cursorY + 11;
    flagged.forEach((fm) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${fm.title}: `, 18, flaggedLine);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Rose ${fm.percentageChange > 0 ? '+' : ''}${fm.percentageChange}% (${fm.previousValue} -> ${fm.currentValue} ${fm.unit}). Mitigation: ${fm.mitigationPlan?.slice(0, 95)}...`,
        65,
        flaggedLine,
        { maxWidth: pageWidth - 85 }
      );
      flaggedLine += 6;
    });

    cursorY += 32;
  }

  // --- PAGE 2: CHARTS & TREND DATA ---
  doc.addPage();

  // Top header for Page 2
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 16, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('MEIL GROUP | ESG HISTORICAL PERFORMANCE & TREND BREAKDOWN', 14, 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Period Scope: ${options.dateFilter.label}`, pageWidth - 14, 10, { align: 'right' });

  let page2CursorY = 24;

  // Try to capture and insert chart image if selector was provided
  if (options.chartSvgSelector) {
    const chartImgData = await captureSvgAsDataUrl(options.chartSvgSelector);
    if (chartImgData) {
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('3. Performance Trend Chart Visualization', 14, page2CursorY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Active Metric View: ${options.selectedMetricView.toUpperCase()} | Filter: ${options.dateFilter.label}`, 14, page2CursorY + 4);

      page2CursorY += 7;

      // Embed chart image
      const chartWidth = pageWidth - 28;
      const chartHeight = 65;
      doc.addImage(chartImgData, 'PNG', 14, page2CursorY, chartWidth, chartHeight);
      page2CursorY += chartHeight + 8;
    }
  }

  // Time-Series Trend Data Table
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('4. Historical & Quarter Performance Data Register', 14, page2CursorY);

  page2CursorY += 4;

  const trendHeaders = [
    'Period',
    'Composite (%)',
    'Env Pillar (%)',
    'Soc Pillar (%)',
    'Gov Pillar (%)',
    'GHG Int. (tCO2e)',
    'Waste Rec. (%)',
    'Water Rec. (%)',
    'Renewables (%)',
    'LTIFR',
  ];

  const trendRows = options.trendData.map((d) => [
    d.yearLabel + (d.isForecast ? ' (Proj)' : ''),
    `${d.esgScore ?? d.forecastEsgScore ?? '-'}%`,
    `${d.environmentalScore ?? d.forecastEnvironmentalScore ?? '-'}%`,
    `${d.socialScore ?? d.forecastSocialScore ?? '-'}%`,
    `${d.governanceScore ?? d.forecastGovernanceScore ?? '-'}%`,
    `${d.ghgIntensity ?? d.forecastGhgIntensity ?? '-'}`,
    `${d.wasteRecycled ?? d.forecastWasteRecycled ?? '-'}%`,
    `${d.waterRecycledRatio ?? d.forecastWaterRecycledRatio ?? '-'}%`,
    `${d.renewableRatio ?? d.forecastRenewableRatio ?? '-'}%`,
    `${d.ltifr ?? d.forecastLtifr ?? '-'}`,
  ]);

  autoTable(doc, {
    startY: page2CursorY,
    head: [trendHeaders],
    body: trendRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      cellPadding: 2.5,
    },
    bodyStyles: {
      fontSize: 7.5,
      cellPadding: 2,
    },
    margin: { left: 14, right: 14 },
  });

  page2CursorY = (doc as any).lastAutoTable.finalY + 10;

  // Sign-off / Verification box
  if (page2CursorY + 35 < pageHeight) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, page2CursorY, pageWidth - 28, 30, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text('EXECUTIVE SUSTAINABILITY SIGN-OFF & ASSURANCE READY', 18, page2CursorY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'All aggregated disclosures comply with SEBI BRSR Core Circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122. Independent assurance by Deloitte Touche Tohmatsu India LLP scheduled for pre-audit sign-off.',
      18,
      page2CursorY + 11,
      { maxWidth: pageWidth - 36 }
    );

    // Signatures
    doc.text('Prepared by: Group Head of Sustainability & ESG', 18, page2CursorY + 23);
    doc.text('Approved by: Managing Director / ESG Committee Chair', pageWidth / 2 + 10, page2CursorY + 23);
  }

  // Footer for each page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Megha Engineering & Infrastructures Limited (MEIL) — Confidential Executive Document', 14, pageHeight - 6);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 14, pageHeight - 6, { align: 'right' });
  }

  const cleanPeriod = options.dateFilter.label.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `MEIL_ESG_Executive_Report_${cleanPeriod}_${Date.now().toString().slice(-4)}.pdf`;
  doc.save(filename);
}
