import { useEffect, useMemo, useState } from 'react';
import { Award, X } from 'lucide-react';
import { SIMULATION_STAGES } from './data/stages';
import {
  ActiveWorkspaceView,
  ParticipantProfile,
  SimulationSession,
  StageOption,
} from './types/simulation';
import { computeKpis, computeMilestoneBadges } from './utils/scoring';
import { downloadExecutivePdfReport, generateVerificationHash } from './utils/pdfReport';
import { OnboardingGate } from './components/OnboardingGate';
import { TopBar } from './components/TopBar';
import { KpiStrip } from './components/KpiStrip';
import { VillaCrossSectionSVG } from './components/VillaCrossSectionSVG';
import { StageWorkspace } from './components/StageWorkspace';
import { TechnicalReferenceDrawer } from './components/TechnicalReferenceDrawer';
import { AuditLogView } from './components/AuditLogView';
import { MilestonesView } from './components/MilestonesView';
import { CompletionReportView } from './components/CompletionReportView';
import { ResetModal } from './components/ResetModal';

const STORAGE_KEY = 'nhc_arch_sim_session_v1';

const INITIAL_SESSION: SimulationSession = {
  profile: null,
  currentStageIndex: 0,
  stageOutcomes: {},
  deficiencyFlags: [],
  elapsedSeconds: 0,
  completedAtIso: null,
  verificationHash: null,
};

function loadSavedSession(): SimulationSession {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_SESSION;
    const parsed = JSON.parse(raw) as SimulationSession;
    if (parsed && typeof parsed === 'object' && 'stageOutcomes' in parsed) {
      return {
        ...INITIAL_SESSION,
        ...parsed,
      };
    }
    return INITIAL_SESSION;
  } catch {
    return INITIAL_SESSION;
  }
}

export default function App() {
  const [session, setSession] = useState<SimulationSession>(() => loadSavedSession());
  const [activeView, setActiveView] = useState<ActiveWorkspaceView>(() => {
    const saved = loadSavedSession();
    return saved.completedAtIso ? 'report' : 'stage';
  });
  const [viewingStageId, setViewingStageId] = useState<number>(() => {
    const saved = loadSavedSession();
    return Math.min(12, Math.max(1, (saved.currentStageIndex ?? 0) + 1));
  });
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<string | null>(null);

  const kpis = useMemo(() => computeKpis(session), [session]);
  const badges = useMemo(() => computeMilestoneBadges(session), [session]);
  const isComplete = Boolean(session.completedAtIso);

  // Persist session to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Ignore storage quota issues
    }
  }, [session]);

  // Live 1-second timer while simulation is active and not yet completed
  useEffect(() => {
    if (!session.profile || session.completedAtIso) return;
    const timer = window.setInterval(() => {
      setSession((prev) => {
        if (!prev.profile || prev.completedAtIso) return prev;
        return { ...prev, elapsedSeconds: prev.elapsedSeconds + 1 };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [session.profile, session.completedAtIso]);

  const handleStartSimulation = (profile: ParticipantProfile) => {
    const fresh: SimulationSession = {
      ...INITIAL_SESSION,
      profile,
    };
    setSession(fresh);
    setViewingStageId(1);
    setActiveView('stage');
    setNewlyUnlockedBadge(null);
  };

  const handleSubmitDecision = (stageId: number, option: StageOption) => {
    const prevUnlockedIds = new Set(badges.filter((b) => b.unlocked).map((b) => b.id));
    const stage = SIMULATION_STAGES.find((s) => s.id === stageId);
    if (!stage) return;

    const nowIso = new Date().toISOString();

    setSession((prev) => {
      const existing = prev.stageOutcomes[stageId] ?? {
        stageId,
        completed: false,
        attempts: 0,
        wrongSelections: [],
        reworkCostSar: 0,
        scheduleDelayWeeks: 0,
        firstAttemptCorrect: false,
      };

      if (existing.completed) return prev;

      if (!option.isOptimal) {
        if (existing.wrongSelections.includes(option.letter)) return prev;
        const updatedOutcome = {
          ...existing,
          attempts: existing.attempts + 1,
          wrongSelections: [...existing.wrongSelections, option.letter],
          reworkCostSar: existing.reworkCostSar + option.reworkCostSar,
          scheduleDelayWeeks: existing.scheduleDelayWeeks + option.scheduleDelayWeeks,
        };
        const newFlag = {
          stageId,
          stageTitle: stage.title,
          optionLetter: option.letter,
          deficiencyCode: option.deficiencyCode,
          deficiencyTitle: option.deficiencyTitle,
          reworkCostSar: option.reworkCostSar,
          scheduleDelayWeeks: option.scheduleDelayWeeks,
          timestampIso: nowIso,
        };
        return {
          ...prev,
          stageOutcomes: {
            ...prev.stageOutcomes,
            [stageId]: updatedOutcome,
          },
          deficiencyFlags: [...prev.deficiencyFlags, newFlag],
        };
      }

      // Optimal choice selected!
      const nextAttempts = existing.attempts + 1;
      const firstAttemptCorrect = existing.wrongSelections.length === 0;
      const updatedOutcome = {
        ...existing,
        completed: true,
        attempts: nextAttempts,
        selectedOptimalLetter: option.letter,
        firstAttemptCorrect,
        completedAtIso: nowIso,
      };

      const nextStageOutcomes = {
        ...prev.stageOutcomes,
        [stageId]: updatedOutcome,
      };

      const allTwelveMastered = SIMULATION_STAGES.every((s) => nextStageOutcomes[s.id]?.completed);

      let nextSession: SimulationSession = {
        ...prev,
        stageOutcomes: nextStageOutcomes,
      };

      if (allTwelveMastered && prev.profile) {
        const finalKpis = computeKpis(nextSession);
        const hash = generateVerificationHash(
          prev.profile.fullName,
          prev.profile.typologyId,
          nowIso,
          finalKpis.mostadamScore,
          finalKpis.firstAttemptAccuracyPct
        );
        nextSession = {
          ...nextSession,
          completedAtIso: nowIso,
          verificationHash: hash,
        };
      }

      // Check newly unlocked badges
      const nextBadges = computeMilestoneBadges(nextSession);
      const justEarned = nextBadges.find((b) => b.unlocked && !prevUnlockedIds.has(b.id));
      if (justEarned) {
        setNewlyUnlockedBadge(justEarned.title);
      }

      return nextSession;
    });
  };

  const handleProceedNext = () => {
    const nextIdx = Math.min(SIMULATION_STAGES.length - 1, session.currentStageIndex + 1);
    setSession((prev) => ({
      ...prev,
      currentStageIndex: Math.max(prev.currentStageIndex, nextIdx),
    }));
    setViewingStageId(nextIdx + 1);
    setNewlyUnlockedBadge(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmReset = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(INITIAL_SESSION);
    setViewingStageId(1);
    setActiveView('stage');
    setIsResetModalOpen(false);
    setNewlyUnlockedBadge(null);
  };

  const handleDownloadPdf = () => {
    downloadExecutivePdfReport(session, kpis, badges);
  };

  // Mandatory Onboarding Gate if no participant profile registered
  if (!session.profile) {
    return <OnboardingGate onStartSimulation={handleStartSimulation} />;
  }

  const activeStageNumber = session.currentStageIndex + 1;
  const displayedStage =
    SIMULATION_STAGES.find((s) => s.id === viewingStageId) ?? SIMULATION_STAGES[session.currentStageIndex];
  const isViewingArchive = displayedStage.id !== activeStageNumber;

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-slate-900 flex flex-col">
      {/* Strict 3-Zone Top Bar */}
      <TopBar
        activeView={activeView}
        isComplete={isComplete}
        onSelectView={setActiveView}
        onOpenReference={() => setIsReferenceOpen(true)}
        onDownloadPdf={isComplete ? handleDownloadPdf : undefined}
        onRequestReset={() => setIsResetModalOpen(true)}
      />

      {/* Persistent Live Project KPI Strip */}
      <KpiStrip
        profile={session.profile}
        kpis={kpis}
        elapsedSeconds={session.elapsedSeconds}
        deficiencyCount={session.deficiencyFlags.length}
      />

      {/* Newly Unlocked Milestone Banner */}
      {newlyUnlockedBadge && (
        <div className="bg-[#047857] text-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                <strong>Milestone Unlocked:</strong> {newlyUnlockedBadge} — recorded in your NHC
                competency dossier.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setNewlyUnlockedBadge(null)}
              aria-label="Dismiss milestone notice"
              className="p-1 hover:bg-white/15 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Frame */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {activeView === 'stage' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Sticky Interactive Architectural Cross-Section */}
            <div className="lg:col-span-5 lg:sticky lg:top-20">
              <VillaCrossSectionSVG
                stageOutcomes={session.stageOutcomes}
                activeStageId={activeStageNumber}
                viewingStageId={displayedStage.id}
                onSelectStage={(id) => setViewingStageId(id)}
              />
            </div>

            {/* Right Active Stage Decision Deck */}
            <div className="lg:col-span-7">
              <StageWorkspace
                stage={displayedStage}
                outcome={session.stageOutcomes[displayedStage.id]}
                isViewingArchive={isViewingArchive}
                activeStageNumber={activeStageNumber}
                allCompleted={isComplete}
                onSubmitDecision={handleSubmitDecision}
                onProceedNext={handleProceedNext}
                onReturnToActiveStage={() => setViewingStageId(activeStageNumber)}
                onOpenReference={() => setIsReferenceOpen(true)}
                onViewFinalReport={() => {
                  setActiveView('report');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </div>
        )}

        {activeView === 'audit' && (
          <AuditLogView
            stageOutcomes={session.stageOutcomes}
            deficiencyFlags={session.deficiencyFlags}
            kpis={kpis}
            onInspectStage={(id) => {
              setViewingStageId(id);
              setActiveView('stage');
            }}
          />
        )}

        {activeView === 'milestones' && <MilestonesView badges={badges} />}

        {activeView === 'report' && isComplete && (
          <CompletionReportView
            session={session}
            kpis={kpis}
            badges={badges}
            onDownloadPdf={handleDownloadPdf}
            onReviewStages={() => setActiveView('stage')}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span>NHC Architectural Development Simulator: From Terrain to Handover</span>
          <span>Riyadh Climate Zone 1 · SBC 602 / 501 / 304 · Salmani Code · Mostadam Residential</span>
        </div>
      </footer>

      {/* Technical Data Drawer / Code Reference Sheet */}
      <TechnicalReferenceDrawer
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />

      {/* Reset Confirmation Modal */}
      <ResetModal
        isOpen={isResetModalOpen}
        onCancel={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
      />
    </div>
  );
}
