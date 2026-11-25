import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { SIMULATION_STAGES } from '../data/stages';
import { ComputedKpis, DeficiencyFlag, StageOutcome } from '../types/simulation';
import { formatSar } from '../utils/pdfReport';

interface AuditLogViewProps {
  stageOutcomes: Record<number, StageOutcome>;
  deficiencyFlags: DeficiencyFlag[];
  kpis: ComputedKpis;
  onInspectStage: (stageId: number) => void;
}

export function AuditLogView({
  stageOutcomes,
  deficiencyFlags,
  kpis,
  onInspectStage,
}: AuditLogViewProps) {
  return (
    <div className="space-y-8">
      {/* Header Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-medium text-[#047857] mb-1">
              NHC Architectural Review Board Record
            </p>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              12-Stage Decision Audit Log & Deficiency Ledger
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-slate-600">
            <span>
              Accuracy: <strong className="text-slate-900">{kpis.firstAttemptAccuracyPct}%</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Rework Total:{' '}
              <strong className={kpis.reworkTotalSar > 0 ? 'text-[#B45309]' : 'text-[#047857]'}>
                {formatSar(kpis.reworkTotalSar)}
              </strong>
            </span>
          </div>
        </div>

        {/* 12-Stage Audit Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F8F7F4] border-b border-slate-200 text-xs text-slate-600">
                <th className="py-3 px-4 font-semibold">Stage & Standard Applied</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Attempts</th>
                <th className="py-3 px-4 font-semibold text-right">Rework (SAR)</th>
                <th className="py-3 px-4 font-semibold text-right">Delay</th>
                <th className="py-3 px-4 font-semibold">Key Takeaway</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SIMULATION_STAGES.map((stage) => {
                const outcome = stageOutcomes[stage.id];
                const completed = Boolean(outcome?.completed);
                const firstPass = Boolean(outcome?.firstAttemptCorrect);

                return (
                  <tr key={stage.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 align-top max-w-[260px]">
                      <button
                        type="button"
                        disabled={!completed}
                        onClick={() => completed && onInspectStage(stage.id)}
                        className={`text-left font-semibold ${
                          completed
                            ? 'text-slate-900 hover:text-[#047857] cursor-pointer'
                            : 'text-slate-500 cursor-default'
                        }`}
                      >
                        {String(stage.id).padStart(2, '0')}. {stage.title}
                      </button>
                      <p className="text-xs text-slate-500 mt-0.5">{stage.appliedStandard}</p>
                    </td>

                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      {completed ? (
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                            firstPass ? 'text-[#047857]' : 'text-[#92400e]'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{firstPass ? '1st-Pass Mastered' : 'Mastered w/ Rework'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 align-top text-right font-mono tabular-nums text-slate-800">
                      {outcome ? outcome.attempts : '—'}
                    </td>

                    <td
                      className={`py-3.5 px-4 align-top text-right font-mono tabular-nums ${
                        outcome && outcome.reworkCostSar > 0
                          ? 'text-[#B45309] font-semibold'
                          : 'text-slate-600'
                      }`}
                    >
                      {outcome ? formatSar(outcome.reworkCostSar) : '—'}
                    </td>

                    <td className="py-3.5 px-4 align-top text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">
                      {outcome ? `+${outcome.scheduleDelayWeeks} wks` : '—'}
                    </td>

                    <td className="py-3.5 px-4 align-top text-xs text-slate-600 leading-relaxed max-w-sm">
                      {completed ? stage.keyTakeaway : 'Unlocks upon mastering this stage.'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deficiency Flags Ledger */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7">
        <h2 className="text-base font-bold text-slate-900 mb-1">
          Logged Architectural Review Board Deficiency Flags ({deficiencyFlags.length})
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Every non-compliant or suboptimal engineering submission is permanently recorded in your
          cluster audit trail.
        </p>

        {deficiencyFlags.length === 0 ? (
          <div className="p-6 rounded-lg bg-[#F8F7F4] border border-slate-200 text-sm text-slate-600 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#047857] shrink-0" />
            <span>
              Zero deficiency flags logged so far. Maintain rigorous SBC 602 and Mostadam verification
              to preserve a clean audit record.
            </span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
            {deficiencyFlags.map((flag, idx) => (
              <div
                key={`${flag.deficiencyCode}-${idx}`}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm"
              >
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">
                      <span className="font-mono text-[#B45309] mr-2">{flag.deficiencyCode}</span>
                      Stage {String(flag.stageId).padStart(2, '0')} · Option {flag.optionLetter} —{' '}
                      {flag.deficiencyTitle}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{flag.stageTitle}</p>
                  </div>
                </div>
                <div className="font-mono tabular-nums text-xs text-[#B45309] font-semibold whitespace-nowrap pl-6 sm:pl-0">
                  +{formatSar(flag.reworkCostSar)} · +{flag.scheduleDelayWeeks} wks
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
