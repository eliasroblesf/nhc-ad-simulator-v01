import { SIMULATION_STAGES } from '../data/stages';
import { getTypologyById } from '../data/typologies';
import { ComputedKpis, MilestoneBadge, SimulationSession } from '../types/simulation';

export function getMostadamRating(score: number): ComputedKpis['mostadamRating'] {
  if (score >= 80) return 'Diamond';
  if (score >= 65) return 'Gold';
  if (score >= 50) return 'Silver';
  if (score >= 35) return 'Bronze';
  if (score >= 20) return 'Certified';
  return 'Unrated';
}

export function computeKpis(session: SimulationSession): ComputedKpis {
  const typology = getTypologyById(session.profile?.typologyId ?? 'al_fursan_townhouse');

  let designDeltaSar = 0;
  let reworkTotalSar = 0;
  let scheduleDelayWeeks = 0;
  let coolingDelta = 0;
  let mostadamDelta = 0;
  let complianceDelta = 0;
  let masteredCount = 0;
  let firstAttemptCount = 0;

  for (const stage of SIMULATION_STAGES) {
    const outcome = session.stageOutcomes[stage.id];
    if (!outcome) continue;

    reworkTotalSar += outcome.reworkCostSar;
    scheduleDelayWeeks += outcome.scheduleDelayWeeks;

    if (outcome.completed) {
      masteredCount += 1;
      if (outcome.firstAttemptCorrect) {
        firstAttemptCount += 1;
      }
      const optimalOpt = stage.options.find((o) => o.isOptimal);
      if (optimalOpt) {
        designDeltaSar += optimalOpt.capExDeltaSar;
        coolingDelta += optimalOpt.coolingLoadDeltaKwhM2;
        mostadamDelta += optimalOpt.mostadamDeltaPts;
        complianceDelta += optimalOpt.complianceDeltaPct;
      }
    }
  }

  // Deficiency penalty on Mostadam (small -1.5 pts per deficiency flag to reward precision, capped so Gold remains achievable with careful play)
  const deficiencyPenalty = Math.min(18, Math.round(session.deficiencyFlags.length * 1.5));
  // Clean first-attempt mastery bonus when all 12 stages mastered with <= 1 deficiency
  const cleanMasteryBonus =
    masteredCount === 12 && session.deficiencyFlags.length === 0
      ? 6
      : masteredCount === 12 && session.deficiencyFlags.length <= 2
      ? 2
      : 0;

  const rawMostadam = typology.baselineMostadamScore + mostadamDelta - deficiencyPenalty + cleanMasteryBonus;
  const mostadamScore = Math.max(10, Math.min(100, rawMostadam));
  const coolingLoadKwhM2 = Math.max(58, typology.baselineCoolingKwhM2 + coolingDelta);
  const complianceIndexPct = Math.min(100, typology.baselineCompliancePct + complianceDelta);
  const firstAttemptAccuracyPct =
    masteredCount > 0 ? Math.round((firstAttemptCount / masteredCount) * 100) : 100;

  return {
    capExSar: typology.baselineCapExSar + designDeltaSar + reworkTotalSar,
    capExBaselineSar: typology.baselineCapExSar,
    reworkTotalSar,
    designDeltaSar,
    coolingLoadKwhM2,
    mostadamScore,
    mostadamRating: getMostadamRating(mostadamScore),
    complianceIndexPct,
    totalScheduleWeeks: typology.baselineScheduleWeeks + scheduleDelayWeeks,
    scheduleDelayWeeks,
    masteredCount,
    firstAttemptAccuracyPct,
  };
}

export function computeMilestoneBadges(session: SimulationSession): MilestoneBadge[] {
  const outcomes = session.stageOutcomes;
  const isDone = (id: number) => Boolean(outcomes[id]?.completed);
  const isFirstTry = (id: number) => Boolean(outcomes[id]?.completed && outcomes[id]?.firstAttemptCorrect);
  const totalWrongIn = (ids: number[]) =>
    ids.reduce((acc, id) => acc + (outcomes[id]?.wrongSelections.length ?? 0), 0);

  const stage12Done = isDone(1) && isDone(2);
  const stage45Done = isDone(4) && isDone(5);
  const stage67Done = isDone(6) && isDone(7);
  const stage89Done = isDone(8) && isDone(9);
  const stage10Done = isDone(10);
  const stage1112Done = isDone(11) && isDone(12);

  return [
    {
      id: 'geotech_strategist',
      title: 'Geotech & Urban Strategist',
      criteria: 'Master Stages 1–2 (Limestone Siting & Shaded Sikka Masterplan) with at most 1 review revision.',
      stagesCovered: 'Stages 01 – 02',
      unlocked: stage12Done && totalWrongIn([1, 2]) <= 1,
      statusNote: !stage12Done
        ? 'Complete Stages 1 & 2 to evaluate'
        : totalWrongIn([1, 2]) <= 1
        ? 'Earned — Competent bedrock siting & H/W 2.0 Sikka verified'
        : 'Completed Stages 1–2 with > 1 revision',
    },
    {
      id: 'passive_envelope_purist',
      title: 'Passive Envelope Purist',
      criteria: 'Master Stages 4–5 (Foundation Thermal Break & Continuous Exterior Insulation) on first attempt.',
      stagesCovered: 'Stages 04 – 05',
      unlocked: isFirstTry(4) && isFirstTry(5),
      statusNote: !stage45Done
        ? 'Complete Stages 4 & 5 cleanly'
        : isFirstTry(4) && isFirstTry(5)
        ? 'Earned — Zero structural thermal bridges & U ≤ 0.342'
        : 'Completed Stages 4–5 with prior deficiency flag',
    },
    {
      id: 'sbc602_solar_master',
      title: 'SBC 602 Solar & Salmani Master',
      criteria: 'Master Stages 6–7 (WWR ≤ 25%, SHGC ≤ 0.25, Roof U ≤ 0.202 & SRI ≥ 50) with at most 1 revision.',
      stagesCovered: 'Stages 06 – 07',
      unlocked: stage67Done && totalWrongIn([6, 7]) <= 1,
      statusNote: !stage67Done
        ? 'Complete Stages 6 & 7 to evaluate'
        : totalWrongIn([6, 7]) <= 1
        ? 'Earned — Deep-reveal mashrabiya & inverted high-SRI roof locked'
        : 'Completed Stages 6–7 with > 1 revision',
    },
    {
      id: 'mep_mostadam_integrator',
      title: 'MEP & Mostadam Integrator',
      criteria: 'Master Stages 8–9 (Right-Sized T3 HVAC, ERV Filtration, Greywater Xeriscape & 24° PV).',
      stagesCovered: 'Stages 08 – 09',
      unlocked: stage89Done && totalWrongIn([8, 9]) <= 1,
      statusNote: !stage89Done
        ? 'Complete Stages 8 & 9 to evaluate'
        : totalWrongIn([8, 9]) <= 1
        ? 'Earned — T3 EER 11.8 & Mostadam arid water stewardship verified'
        : 'Completed Stages 8–9 with > 1 revision',
    },
    {
      id: 've_defender',
      title: 'VE Defender',
      criteria: 'Reject the mid-construction contractor envelope downgrade on the first attempt at Stage 10.',
      stagesCovered: 'Stage 10',
      unlocked: isFirstTry(10),
      statusNote: !stage10Done
        ? 'Defend passive envelope at Stage 10'
        : isFirstTry(10)
        ? 'Earned — Protected SBC 602 envelope while executing smart finish VE'
        : 'Resolved Stage 10 after review board intervention',
    },
    {
      id: 'zero_defect_handover',
      title: 'Zero-Defect Handover Lead',
      criteria: 'Complete Stages 11–12 (Blower-Door QA, IR Thermography, TAB & Digital Twin Handover).',
      stagesCovered: 'Stages 11 – 12',
      unlocked: stage1112Done,
      statusNote: !stage1112Done
        ? 'Complete Stages 11 & 12 to unlock'
        : 'Earned — Verified ≤ 1.5 L/s·m² airtightness & commissioned handover',
    },
  ];
}
