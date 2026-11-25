import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  XCircle,
} from 'lucide-react';
import { OptionLetter, SimulationStage, StageOption, StageOutcome } from '../types/simulation';
import { formatSar } from '../utils/pdfReport';

interface StageWorkspaceProps {
  stage: SimulationStage;
  outcome?: StageOutcome;
  isViewingArchive: boolean;
  activeStageNumber: number;
  allCompleted: boolean;
  onSubmitDecision: (stageId: number, option: StageOption) => void;
  onProceedNext: () => void;
  onReturnToActiveStage: () => void;
  onOpenReference: () => void;
  onViewFinalReport: () => void;
}

export function StageWorkspace({
  stage,
  outcome,
  isViewingArchive,
  activeStageNumber,
  allCompleted,
  onSubmitDecision,
  onProceedNext,
  onReturnToActiveStage,
  onOpenReference,
  onViewFinalReport,
}: StageWorkspaceProps) {
  const [selectedLetter, setSelectedLetter] = useState<OptionLetter | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [latestCritique, setLatestCritique] = useState<StageOption | null>(null);

  const isMastered = Boolean(outcome?.completed);
  const wrongSelections = outcome?.wrongSelections ?? [];
  const optimalOption = stage.options.find((o) => o.isOptimal);

  // Reset local selection when switching stages
  useEffect(() => {
    setSelectedLetter(null);
    setShowHint(false);
    if (outcome && !outcome.completed && outcome.wrongSelections.length > 0) {
      const lastWrong = outcome.wrongSelections[outcome.wrongSelections.length - 1];
      const found = stage.options.find((o) => o.letter === lastWrong) ?? null;
      setLatestCritique(found);
    } else {
      setLatestCritique(null);
    }
  }, [stage.id]);

  const handleConfirm = () => {
    if (!selectedLetter || isMastered) return;
    const chosen = stage.options.find((o) => o.letter === selectedLetter);
    if (!chosen) return;
    if (!chosen.isOptimal) {
      setLatestCritique(chosen);
      setSelectedLetter(null);
    } else {
      setLatestCritique(null);
    }
    onSubmitDecision(stage.id, chosen);
  };

  return (
    <div className="space-y-6">
      {/* Main Stage Brief Card */}
      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7">
        {/* Archive Banner if reviewing earlier stage */}
        {isViewingArchive && !allCompleted && (
          <div className="mb-5 pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-600">
              Reviewing mastered Stage {String(stage.id).padStart(2, '0')} archive · Current active
              stage is Stage {String(activeStageNumber).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={onReturnToActiveStage}
              className="font-semibold text-[#047857] hover:underline cursor-pointer"
            >
              Return to Active Stage {String(activeStageNumber).padStart(2, '0')} →
            </button>
          </div>
        )}

        {/* Unboxed Metadata Kicker */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-mono font-semibold text-[#047857]">
              Stage {String(stage.id).padStart(2, '0')} of 12
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-slate-700">{stage.phase}</span>
            <span aria-hidden="true">·</span>
            <span>{stage.codeFocus}</span>
          </div>

          <button
            type="button"
            onClick={onOpenReference}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#047857] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Open Code Reference & Calculators</span>
          </button>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-3">
          {stage.title}
        </h1>

        <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-5">
          {stage.brief}
        </p>

        {/* Site Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-lg bg-[#F8F7F4] border border-slate-200/80 mb-4">
          {stage.siteParameters.map((param) => (
            <div key={param.label} className="flex flex-col">
              <span className="text-[11px] text-slate-500">{param.label}</span>
              <span className="text-xs sm:text-sm font-mono font-medium text-slate-900 tabular-nums mt-0.5">
                {param.value}
              </span>
            </div>
          ))}
        </div>

        {/* Expandable Engineering Hint */}
        <div>
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            aria-expanded={showHint}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <span>{showHint ? 'Hide Engineering Verification Guidance' : 'Show Engineering Verification Guidance'}</span>
            {showHint ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {showHint && (
            <p className="mt-2.5 text-xs text-slate-600 leading-relaxed p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              {stage.calculationHint}
            </p>
          )}
        </div>
      </article>

      {/* Architectural Review Board Critique (Non-Optimal Feedback) */}
      {latestCritique && !isMastered && (
        <div
          role="alert"
          className="bg-[#FFFBEB] border border-[#B45309]/40 rounded-xl p-5 sm:p-6 space-y-3"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-[#92400e]">
              <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
              <h2 className="text-sm font-bold">
                Architectural Review Board Deficiency — Option {latestCritique.letter} Rejected
              </h2>
            </div>
            <span className="font-mono text-xs font-semibold text-[#B45309] tabular-nums">
              Flag {latestCritique.deficiencyCode} · Rework +{formatSar(latestCritique.reworkCostSar)} · +{latestCritique.scheduleDelayWeeks} wks
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-900">{latestCritique.deficiencyTitle}</p>
          <p className="text-sm text-slate-700 leading-relaxed">
            {latestCritique.reviewBoardCritique}
          </p>
          <p className="text-xs text-[#92400e] font-medium pt-1">
            Re-verify code thresholds in the Technical Data Drawer and select a compliant engineering specification below to clear this stage.
          </p>
        </div>
      )}

      {/* Mastery Approval Banner */}
      {isMastered && optimalOption && (
        <div className="bg-[#ECFDF5] border border-[#047857]/35 rounded-xl p-5 sm:p-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[#047857]">
              <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
              <h2 className="text-sm font-bold">
                Review Board Approved — Option {optimalOption.letter} Verified
              </h2>
            </div>
            <span className="text-xs font-mono font-semibold text-[#047857] tabular-nums">
              {optimalOption.coolingLoadDeltaKwhM2 !== 0
                ? `${optimalOption.coolingLoadDeltaKwhM2} kWh/m²·yr · `
                : ''}
              +{optimalOption.mostadamDeltaPts} Mostadam pts · +{optimalOption.complianceDeltaPct}% Code
            </span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{optimalOption.approvalSummary}</p>
          <div className="pt-2 border-t border-[#047857]/15 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-600">
              <strong className="text-slate-800">Key Takeaway:</strong> {stage.keyTakeaway}
            </p>
            {stage.id < 12 && !isViewingArchive && (
              <button
                type="button"
                onClick={onProceedNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#047857] hover:bg-[#065f46] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Proceed to Stage {String(stage.id + 1).padStart(2, '0')}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            {stage.id === 12 && (
              <button
                type="button"
                onClick={onViewFinalReport}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#047857] hover:bg-[#065f46] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>View Executive Audit Report & PDF</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4 Engineering Options Deck */}
      <section aria-label="Engineering specification options" className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Select Engineering Specification (A – D)
          </h2>
          <span className="text-xs text-slate-500">
            {isMastered
              ? 'Stage mastered — specification locked'
              : 'Evaluate trade-offs against SBC 602, Salmani & Mostadam'}
          </span>
        </div>

        <div className="space-y-3">
          {stage.options.map((opt) => {
            const wasRejected = wrongSelections.includes(opt.letter);
            const isApproved = isMastered && opt.isOptimal;
            const isSelected = selectedLetter === opt.letter;
            const disabled = isMastered || wasRejected;

            return (
              <button
                key={opt.letter}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setSelectedLetter(opt.letter)}
                aria-pressed={isSelected || isApproved}
                className={`w-full text-left rounded-xl border p-5 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857] ${
                  isApproved
                    ? 'border-[#047857] bg-[#047857]/[0.04]'
                    : wasRejected
                    ? 'border-slate-200 bg-slate-50/90 opacity-65 cursor-not-allowed'
                    : isSelected
                    ? 'border-slate-900 bg-white ring-1 ring-slate-900 cursor-pointer'
                    : 'border-slate-200 bg-white hover:border-slate-400 cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-7 h-7 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border ${
                        isApproved
                          ? 'bg-[#047857] text-white border-[#047857]'
                          : wasRejected
                          ? 'bg-slate-200 text-slate-500 border-slate-300'
                          : isSelected
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-[#F8F7F4] text-slate-800 border-slate-300'
                      }`}
                    >
                      {opt.letter}
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-snug">
                        {opt.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-xs font-mono tabular-nums text-slate-500">
                        <span>
                          Est. CapEx:{' '}
                          <strong className="text-slate-800">
                            {opt.capExDeltaSar >= 0 ? '+' : ''}
                            {formatSar(opt.capExDeltaSar)}
                          </strong>
                        </span>
                        {isApproved && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 font-sans font-semibold text-[#047857]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approved Specification
                            </span>
                          </>
                        )}
                        {wasRejected && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 font-sans font-semibold text-[#B45309]">
                              <XCircle className="w-3.5 h-3.5" />
                              Rejected ({opt.deficiencyCode})
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed pl-10 mb-3">
                  {opt.specification}
                </p>

                {/* Unboxed inline technical metrics */}
                <div className="pl-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono tabular-nums text-slate-600">
                  {opt.keyMetrics.map((metric, idx) => (
                    <span key={metric} className="inline-flex items-center gap-3">
                      {idx > 0 && (
                        <span className="text-slate-300" aria-hidden="true">
                          /
                        </span>
                      )}
                      <span>{metric}</span>
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit Action Row */}
        {!isMastered && (
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              {selectedLetter
                ? `Option ${selectedLetter} selected for Architectural Review Board submission.`
                : 'Select one option above, then submit for compliance & physics audit.'}
            </p>
            <button
              type="button"
              disabled={!selectedLetter}
              onClick={handleConfirm}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedLetter
                  ? 'bg-[#047857] hover:bg-[#065f46] text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Submit Engineering Decision</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
