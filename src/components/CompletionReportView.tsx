import { Award, CheckCircle2, Download, Printer, ShieldCheck } from 'lucide-react';
import { SIMULATION_STAGES } from '../data/stages';
import { getTypologyById } from '../data/typologies';
import { ComputedKpis, MilestoneBadge, SimulationSession } from '../types/simulation';
import { formatDuration, formatSar } from '../utils/pdfReport';

interface CompletionReportViewProps {
  session: SimulationSession;
  kpis: ComputedKpis;
  badges: MilestoneBadge[];
  onDownloadPdf: () => void;
  onReviewStages: () => void;
}

export function CompletionReportView({
  session,
  kpis,
  badges,
  onDownloadPdf,
  onReviewStages,
}: CompletionReportViewProps) {
  if (!session.profile) return null;

  const typology = getTypologyById(session.profile.typologyId);
  const completionDate = session.completedAtIso
    ? new Date(session.completedAtIso).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

  const capExVariance = kpis.capExSar - kpis.capExBaselineSar;
  const unlockedBadges = badges.filter((b) => b.unlocked);
  const firstAttemptPasses = Object.values(session.stageOutcomes).filter(
    (o) => o.firstAttemptCorrect
  ).length;

  return (
    <div className="space-y-6">
      {/* Executive Completion Banner */}
      <section className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-300 font-medium mb-2">
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>NHC Architecture Foundations · Handover Complete</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{session.verificationHash}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Executive Project Completion & Audit Report
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {session.profile.fullName} ({session.profile.organization}) has completed all 12
              lifecycle stages for the <strong className="text-white">{typology.name}</strong>{' '}
              development in Riyadh, achieving a verified{' '}
              <strong className="text-emerald-300">
                Mostadam {kpis.mostadamRating} ({kpis.mostadamScore}/100 pts)
              </strong>{' '}
              rating in {formatDuration(session.elapsedSeconds)}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onDownloadPdf}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#047857] hover:bg-[#059669] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Download PDF Certificate & Audit Report</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <Printer className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4-Column Architectural Performance Scorecard */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-500 mb-1">First-Attempt Accuracy</p>
          <p className="text-2xl font-mono font-bold tabular-nums text-[#047857]">
            {kpis.firstAttemptAccuracyPct}%
          </p>
          <p className="text-xs text-slate-600 mt-1">
            {firstAttemptPasses} of 12 stages mastered cleanly
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-500 mb-1">Final Mostadam Rating</p>
          <p className="text-2xl font-bold text-slate-900">
            {kpis.mostadamRating}{' '}
            <span className="font-mono text-base font-semibold text-[#047857] tabular-nums">
              ({kpis.mostadamScore} pts)
            </span>
          </p>
          <p className="text-xs text-slate-600 mt-1">
            SBC 602 & Salmani Index: {kpis.complianceIndexPct}%
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-500 mb-1">Final CapEx & Rework</p>
          <p className="text-2xl font-mono font-bold tabular-nums text-slate-900">
            {formatSar(kpis.capExSar)}
          </p>
          <p
            className={`text-xs font-mono tabular-nums mt-1 ${
              kpis.reworkTotalSar > 0 ? 'text-[#B45309]' : 'text-[#047857]'
            }`}
          >
            Variance: {capExVariance >= 0 ? '+' : ''}
            {formatSar(capExVariance)} · Rework: {formatSar(kpis.reworkTotalSar)}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-500 mb-1">Energy & Schedule Outcome</p>
          <p className="text-2xl font-mono font-bold tabular-nums text-slate-900">
            {kpis.coolingLoadKwhM2}{' '}
            <span className="text-sm font-normal text-slate-500">kWh/m²·yr</span>
          </p>
          <p className="text-xs font-mono tabular-nums text-slate-600 mt-1">
            -{typology.baselineCoolingKwhM2 - kpis.coolingLoadKwhM2} kWh/m² saved ·{' '}
            {kpis.totalScheduleWeeks} wks (+{kpis.scheduleDelayWeeks} delay)
          </p>
        </div>
      </section>

      {/* Unlocked Milestones Summary */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-base font-bold text-slate-900">
            Earned Architectural Mastery Milestones ({unlockedBadges.length}/{badges.length})
          </h2>
          <button
            type="button"
            onClick={onReviewStages}
            className="text-xs font-semibold text-[#047857] hover:underline cursor-pointer"
          >
            Inspect Interactive Cross-Section & Stage Archive →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3.5 rounded-lg border flex items-start gap-2.5 text-xs ${
                badge.unlocked
                  ? 'border-[#047857]/35 bg-[#ECFDF5]/45 text-slate-900'
                  : 'border-slate-200 bg-slate-50 text-slate-400'
              }`}
            >
              <Award
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  badge.unlocked ? 'text-[#047857]' : 'text-slate-300'
                }`}
              />
              <div>
                <p className="font-semibold">{badge.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{badge.statusNote}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Complete 12-Stage Audit Log */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Complete 12-Stage Architectural Decision Audit Log
        </h2>
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F7F4] border-b border-slate-200 text-slate-600">
                <th className="py-2.5 px-3.5 font-semibold">Stage & Standard Applied</th>
                <th className="py-2.5 px-3.5 font-semibold">Result</th>
                <th className="py-2.5 px-3.5 font-semibold text-right">Rework Penalty</th>
                <th className="py-2.5 px-3.5 font-semibold">Key Architectural Takeaway</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SIMULATION_STAGES.map((stage) => {
                const outcome = session.stageOutcomes[stage.id];
                const clean = outcome?.firstAttemptCorrect;
                return (
                  <tr key={stage.id}>
                    <td className="py-3 px-3.5 align-top">
                      <p className="font-semibold text-slate-900">
                        {String(stage.id).padStart(2, '0')}. {stage.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{stage.appliedStandard}</p>
                    </td>
                    <td className="py-3 px-3.5 align-top whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          clean ? 'text-[#047857]' : 'text-[#B45309]'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {clean
                            ? `1st Pass (Opt ${outcome?.selectedOptimalLetter})`
                            : `${outcome?.attempts} Tries (Opt ${outcome?.selectedOptimalLetter})`}
                        </span>
                      </span>
                    </td>
                    <td className="py-3 px-3.5 align-top text-right font-mono tabular-nums whitespace-nowrap">
                      <span
                        className={
                          outcome && outcome.reworkCostSar > 0
                            ? 'text-[#B45309] font-semibold'
                            : 'text-[#047857]'
                        }
                      >
                        {formatSar(outcome?.reworkCostSar ?? 0)}
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        +{outcome?.scheduleDelayWeeks ?? 0} wks
                      </span>
                    </td>
                    <td className="py-3 px-3.5 align-top text-slate-600 leading-relaxed max-w-md">
                      {stage.keyTakeaway}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Official NHC Completion Verification Block */}
      <section className="bg-[#FCFBF9] border border-[#047857]/40 rounded-xl p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <p className="text-xs font-bold tracking-wide text-[#047857]">
              NHC ARCHITECTURE FOUNDATIONS — COMPLETION VERIFICATION BLOCK
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              Verified completion record for{' '}
              <strong className="text-slate-900">{session.profile.fullName}</strong> (
              {session.profile.organization}) on <strong>{completionDate}</strong> · Typology:{' '}
              {typology.name} · Elapsed Duration: {formatDuration(session.elapsedSeconds)}.
            </p>
          </div>
          <div className="text-left md:text-right font-mono text-xs space-y-1 shrink-0">
            <p className="text-slate-500">Session Verification Hash</p>
            <p className="text-base font-bold text-slate-900 tracking-wider">
              {session.verificationHash}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
