export type TypologyId = 'al_fursan_townhouse' | 'khuzam_salmani_villa';

export interface ResidentialTypology {
  id: TypologyId;
  name: string;
  district: string;
  subtitle: string;
  plotAreaM2: number;
  gfaM2: number;
  exposedFacades: number;
  baselineCapExSar: number;
  baselineCoolingKwhM2: number;
  baselineMostadamScore: number;
  baselineCompliancePct: number;
  baselineScheduleWeeks: number;
  targetMostadam: string;
  imagePath: string;
  imageAlt: string;
  architecturalContext: string;
}

export type OptionLetter = 'A' | 'B' | 'C' | 'D';

export interface StageOption {
  letter: OptionLetter;
  title: string;
  specification: string;
  keyMetrics: string[];
  capExDeltaSar: number;
  isOptimal: boolean;
  // Applied when non-optimal option is selected (rework penalty)
  reworkCostSar: number;
  scheduleDelayWeeks: number;
  deficiencyCode: string;
  deficiencyTitle: string;
  reviewBoardCritique: string;
  // Applied when optimal option is selected
  coolingLoadDeltaKwhM2: number;
  mostadamDeltaPts: number;
  complianceDeltaPct: number;
  approvalSummary: string;
}

export interface SimulationStage {
  id: number;
  phase: string;
  title: string;
  codeFocus: string;
  brief: string;
  siteParameters: { label: string; value: string }[];
  calculationHint: string;
  appliedStandard: string;
  keyTakeaway: string;
  svgLayerLabel: string;
  options: StageOption[];
}

export interface DeficiencyFlag {
  stageId: number;
  stageTitle: string;
  optionLetter: OptionLetter;
  deficiencyCode: string;
  deficiencyTitle: string;
  reworkCostSar: number;
  scheduleDelayWeeks: number;
  timestampIso: string;
}

export interface StageOutcome {
  stageId: number;
  completed: boolean;
  attempts: number;
  wrongSelections: OptionLetter[];
  selectedOptimalLetter?: OptionLetter;
  reworkCostSar: number;
  scheduleDelayWeeks: number;
  firstAttemptCorrect: boolean;
  completedAtIso?: string;
}

export interface ParticipantProfile {
  fullName: string;
  organization: string;
  typologyId: TypologyId;
  startedAtIso: string;
}

export interface SimulationSession {
  profile: ParticipantProfile | null;
  currentStageIndex: number; // 0 to 11
  stageOutcomes: Record<number, StageOutcome>;
  deficiencyFlags: DeficiencyFlag[];
  elapsedSeconds: number;
  completedAtIso: string | null;
  verificationHash: string | null;
}

export type ActiveWorkspaceView = 'stage' | 'audit' | 'milestones' | 'report';

export interface MilestoneBadge {
  id: string;
  title: string;
  criteria: string;
  stagesCovered: string;
  unlocked: boolean;
  statusNote: string;
}

export interface ComputedKpis {
  capExSar: number;
  capExBaselineSar: number;
  reworkTotalSar: number;
  designDeltaSar: number;
  coolingLoadKwhM2: number;
  mostadamScore: number;
  mostadamRating: 'Unrated' | 'Certified' | 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  complianceIndexPct: number;
  totalScheduleWeeks: number;
  scheduleDelayWeeks: number;
  masteredCount: number;
  firstAttemptAccuracyPct: number;
}
