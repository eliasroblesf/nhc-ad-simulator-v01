import { jsPDF } from 'jspdf';
import { SIMULATION_STAGES } from '../data/stages';
import { getTypologyById } from '../data/typologies';
import { ComputedKpis, MilestoneBadge, SimulationSession } from '../types/simulation';

export function formatDuration(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) {
    return `${hrs}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  }
  return `${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
}

export function formatSar(amount: number): string {
  return `${amount.toLocaleString('en-US')} SAR`;
}

export function generateVerificationHash(
  fullName: string,
  typologyId: string,
  completedAtIso: string,
  mostadamScore: number,
  accuracyPct: number
): string {
  const seed = `${fullName.trim().toUpperCase()}|${typologyId}|${completedAtIso}|${mostadamScore}|${accuracyPct}|NHC-RIYADH-2026`;
  let h1 = 0x811c9dc5;
  let h2 = 0x1a2b3c4d;
  for (let i = 0; i < seed.length; i++) {
    const c = seed.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 0x01000193);
    h2 = Math.imul(h2 ^ c, 0x27d4eb2d);
  }
  const part1 = ((h1 >>> 0).toString(16).toUpperCase()).padStart(8, '0').slice(0, 4);
  const part2 = ((h2 >>> 0).toString(16).toUpperCase()).padStart(8, '0').slice(0, 4);
  const code = typologyId === 'al_fursan_townhouse' ? 'AF' : 'KZ';
  return `NHC-2026-${code}-${part1}-${part2}`;
}

export function downloadExecutivePdfReport(
  session: SimulationSession,
  kpis: ComputedKpis,
  badges: MilestoneBadge[]
): void {
  if (!session.profile) return;

  const typology = getTypologyById(session.profile.typologyId);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 16;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > pageHeight - 16) {
      doc.addPage();
      y = 18;
    }
  };

  // Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 34, 'F');
  doc.setFillColor(4, 120, 87); // Emerald 700 accent strip
  doc.rect(0, 34, pageWidth, 1.8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('NHC ARCHITECTURAL DEVELOPMENT SIMULATOR', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Executive Project Completion Certificate & 12-Stage Technical Audit Report', margin, 21);
  doc.text('Riyadh Climate Zone 1  |  SBC 2024 / SBC 602  |  Salmani Urban Code  |  Mostadam Residential', margin, 27);

  y = 44;

  // Section 1: Participant & Project Identification
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. Participant & Project Dossier', margin, y);
  y += 4;

  doc.setFillColor(248, 247, 244);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'FD');

  const completionDate = session.completedAtIso
    ? new Date(session.completedAtIso).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const leftColX = margin + 4;
  const rightColX = margin + contentWidth / 2 + 4;

  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Lead Development Architect', leftColX, y + 6.5);
  doc.text('Department / Organization', leftColX, y + 16);
  doc.text('Selected Typology', leftColX, y + 25.5);

  doc.text('Completion Date', rightColX, y + 6.5);
  doc.text('Total Elapsed Time', rightColX, y + 16);
  doc.text('Verification Hash', rightColX, y + 25.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9.5);
  doc.text(session.profile.fullName, leftColX + 43, y + 6.5);
  doc.text(session.profile.organization, leftColX + 43, y + 16);
  doc.text(typology.name, leftColX + 43, y + 25.5);

  doc.text(completionDate, rightColX + 34, y + 6.5);
  doc.text(formatDuration(session.elapsedSeconds), rightColX + 34, y + 16);
  doc.setTextColor(4, 120, 87);
  doc.text(session.verificationHash || 'PENDING', rightColX + 34, y + 25.5);

  y += 38;

  // Section 2: Architectural Performance Scorecard
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. Architectural Performance Scorecard', margin, y);
  y += 4;

  const cardGap = 3.5;
  const cardW = (contentWidth - cardGap * 3) / 4;
  const cardH = 24;

  const varianceSar = kpis.capExSar - kpis.capExBaselineSar;
  const varianceSign = varianceSar >= 0 ? '+' : '';

  const scoreCards = [
    {
      label: 'First-Attempt Accuracy',
      value: `${kpis.firstAttemptAccuracyPct}%`,
      sub: `${Object.values(session.stageOutcomes).filter((o) => o.firstAttemptCorrect).length} / 12 clean passes`,
      accent: [4, 120, 87] as [number, number, number],
    },
    {
      label: 'Final Mostadam Rating',
      value: `${kpis.mostadamRating}`,
      sub: `${kpis.mostadamScore} / 100 pts verified`,
      accent: [4, 120, 87] as [number, number, number],
    },
    {
      label: 'CapEx & Rework Variance',
      value: `${varianceSign}${Math.round(varianceSar / 1000)}k SAR`,
      sub: `Rework: ${formatSar(kpis.reworkTotalSar)}`,
      accent: kpis.reworkTotalSar > 0 ? ([180, 83, 9] as [number, number, number]) : ([4, 120, 87] as [number, number, number]),
    },
    {
      label: 'Cooling Energy Intensity',
      value: `${kpis.coolingLoadKwhM2} kWh/m²`,
      sub: `Down from ${typology.baselineCoolingKwhM2} baseline`,
      accent: [15, 23, 42] as [number, number, number],
    },
  ];

  scoreCards.forEach((card, idx) => {
    const cx = margin + idx * (cardW + cardGap);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(cx, y, cardW, cardH, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(card.label, cx + 3, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(card.accent[0], card.accent[1], card.accent[2]);
    doc.text(card.value, cx + 3, y + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(card.sub, cx + 3, y + 20);
  });

  y += cardH + 7;

  // Secondary summary line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const unlockedNames = badges.filter((b) => b.unlocked).map((b) => b.title);
  const summaryLine = `Final CapEx: ${formatSar(kpis.capExSar)}  |  Schedule: ${kpis.totalScheduleWeeks} wks (+${kpis.scheduleDelayWeeks} wks delay)  |  SBC/Salmani Index: ${kpis.complianceIndexPct}%  |  Deficiency Flags: ${session.deficiencyFlags.length}`;
  doc.text(summaryLine, margin, y);
  y += 5;

  const badgeText = `Unlocked Milestones (${unlockedNames.length}/${badges.length}): ${unlockedNames.length > 0 ? unlockedNames.join(', ') : 'None'}`;
  const wrappedBadges = doc.splitTextToSize(badgeText, contentWidth);
  doc.text(wrappedBadges, margin, y);
  y += wrappedBadges.length * 4.2 + 5;

  // Section 3: Stage-by-Stage Decision Audit Log
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. 12-Stage Architectural Decision Audit Log', margin, y);
  y += 4;

  // Table header
  const drawTableHeader = () => {
    doc.setFillColor(15, 23, 42);
    doc.rect(margin, y, contentWidth, 7.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('Stage & Applied Technical Standard', margin + 2.5, y + 5);
    doc.text('Result', margin + 82, y + 5);
    doc.text('Rework', margin + 101, y + 5);
    doc.text('Key Architectural Takeaway', margin + 123, y + 5);
    y += 7.5;
  };

  drawTableHeader();

  SIMULATION_STAGES.forEach((stage, index) => {
    const outcome = session.stageOutcomes[stage.id];
    const stageLabel = `${String(stage.id).padStart(2, '0')}. ${stage.title}`;
    const stdLines = doc.splitTextToSize(`${stageLabel}\n${stage.appliedStandard}`, 76);
    const takeawayLines = doc.splitTextToSize(stage.keyTakeaway, contentWidth - 125);
    const rowLines = Math.max(stdLines.length, takeawayLines.length, 2);
    const rowH = rowLines * 3.7 + 4;

    if (y + rowH > pageHeight - 18) {
      doc.addPage();
      y = 16;
      drawTableHeader();
    }

    if (index % 2 === 0) {
      doc.setFillColor(248, 247, 244);
      doc.rect(margin, y, contentWidth, rowH, 'F');
    } else {
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, y, contentWidth, rowH, 'F');
    }
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + rowH, margin + contentWidth, y + rowH);

    // Stage title + standard
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.6);
    doc.setTextColor(15, 23, 42);
    doc.text(stdLines[0] || stageLabel, margin + 2.5, y + 4.3);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    if (stdLines.length > 1) {
      doc.text(stdLines.slice(1), margin + 2.5, y + 8);
    }

    // Attempts / Result
    const isClean = outcome?.firstAttemptCorrect;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    if (isClean) {
      doc.setTextColor(4, 120, 87);
      doc.text('1st Pass', margin + 82, y + 4.5);
    } else {
      doc.setTextColor(180, 83, 9);
      doc.text(`${outcome?.attempts ?? 1} Tries`, margin + 82, y + 4.5);
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Opt ${outcome?.selectedOptimalLetter ?? '-'}`, margin + 82, y + 8.3);

    // Rework
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.3);
    if (outcome && outcome.reworkCostSar > 0) {
      doc.setTextColor(180, 83, 9);
      doc.text(`${(outcome.reworkCostSar / 1000).toFixed(0)}k SAR`, margin + 101, y + 4.5);
      doc.text(`+${outcome.scheduleDelayWeeks} wks`, margin + 101, y + 8.3);
    } else {
      doc.setTextColor(4, 120, 87);
      doc.text('0 SAR', margin + 101, y + 4.5);
      doc.text('+0 wks', margin + 101, y + 8.3);
    }

    // Key takeaway
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(51, 65, 85);
    doc.text(takeawayLines, margin + 123, y + 4.3);

    y += rowH;
  });

  // Deficiency Flags summary (if any)
  if (session.deficiencyFlags.length > 0) {
    ensureSpace(26);
    y += 7;
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(`4. Architectural Review Board Deficiency Ledger (${session.deficiencyFlags.length} Logged)`, margin, y);
    y += 5;

    session.deficiencyFlags.forEach((flag) => {
      ensureSpace(9);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(180, 83, 9);
      doc.text(`[${flag.deficiencyCode}] Stage ${flag.stageId} (Option ${flag.optionLetter}):`, margin + 2, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const line = `${flag.deficiencyTitle} — Rework: ${formatSar(flag.reworkCostSar)}, Delay: +${flag.scheduleDelayWeeks} wks`;
      doc.text(line, margin + 45, y);
      y += 4.8;
    });
  }

  // Official Verification Block
  ensureSpace(44);
  y += 8;
  doc.setFillColor(248, 247, 244);
  doc.setDrawColor(4, 120, 87);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 36, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(4, 120, 87);
  doc.text('NHC ARCHITECTURE FOUNDATIONS — COMPLETION VERIFICATION', margin + 5, y + 7.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(51, 65, 85);
  const certText = doc.splitTextToSize(
    `This certifies that ${session.profile.fullName} (${session.profile.organization}) has successfully completed all 12 lifecycle engineering stages of the NHC Architectural Development Simulator: From Terrain to Handover for the ${typology.name} cluster in Riyadh (Climate Zone 1), achieving a verified ${kpis.mostadamRating} (${kpis.mostadamScore}/100 pts) Mostadam outcome and ${kpis.complianceIndexPct}% SBC 602 / Salmani Code compliance.`,
    contentWidth - 10
  );
  doc.text(certText, margin + 5, y + 13);

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.25);
  doc.line(margin + 5, y + 29, margin + 62, y + 29);
  doc.line(margin + 72, y + 29, margin + 128, y + 29);

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Lead Development Architect Signature', margin + 5, y + 33);
  doc.text('NHC Architecture Foundations Program Director', margin + 72, y + 33);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Hash: ${session.verificationHash || 'VERIFIED'}`, margin + 134, y + 29);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Issued: ${completionDate}`, margin + 134, y + 33);

  // Page numbers footer
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `NHC Architectural Development Simulator  ·  ${session.profile.fullName}  ·  Page ${p} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 7,
      { align: 'center' }
    );
  }

  const safeName = session.profile.fullName.replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_|_$/g, '');
  doc.save(`NHC_Architectural_Audit_Report_${safeName || 'Participant'}.pdf`);
}
