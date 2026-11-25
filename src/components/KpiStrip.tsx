import { ComputedKpis, ParticipantProfile } from '../types/simulation';
import { getTypologyById } from '../data/typologies';
import { formatDuration, formatSar } from '../utils/pdfReport';

interface KpiStripProps {
  profile: ParticipantProfile;
  kpis: ComputedKpis;
  elapsedSeconds: number;
  deficiencyCount: number;
}

export function KpiStrip({ profile, kpis, elapsedSeconds, deficiencyCount }: KpiStripProps) {
  const typology = getTypologyById(profile.typologyId);
  const capExVariance = kpis.capExSar - kpis.capExBaselineSar;
  const coolingSaved = typology.baselineCoolingKwhM2 - kpis.coolingLoadKwhM2;

  return (
    <section
      aria-label="Live project key performance indicators"
      className="bg-white border-b border-slate-200"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Top quiet context line */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-800">{profile.fullName}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.organization}</span>
            <span aria-hidden="true">·</span>
            <span>{typology.name}</span>
          </div>
          <div className="flex items-center gap-3 font-mono tabular-nums">
            <span>
              Stage Progress: <strong className="text-slate-900">{kpis.masteredCount}/12</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Session Time: <strong className="text-slate-900">{formatDuration(elapsedSeconds)}</strong>
            </span>
          </div>
        </div>

        {/* 5-Column KPI Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* 1. CapEx Budget */}
          <div>
            <p className="text-xs text-slate-500 mb-0.5">CapEx Budget</p>
            <p className="text-base sm:text-lg font-mono font-semibold tabular-nums text-slate-900 leading-tight">
              {formatSar(kpis.capExSar)}
            </p>
            <p
              className={`text-xs font-mono tabular-nums mt-0.5 ${
                kpis.reworkTotalSar > 0 ? 'text-[#B45309]' : 'text-slate-500'
              }`}
            >
              {capExVariance >= 0 ? '+' : ''}
              {Math.round(capExVariance / 1000)}k vs base
              {kpis.reworkTotalSar > 0 ? ` (${Math.round(kpis.reworkTotalSar / 1000)}k rework)` : ''}
            </p>
          </div>

          {/* 2. Annual Cooling Load */}
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Projected Cooling Load</p>
            <p className="text-base sm:text-lg font-mono font-semibold tabular-nums text-slate-900 leading-tight">
              {kpis.coolingLoadKwhM2} <span className="text-xs font-normal text-slate-500">kWh/m²·yr</span>
            </p>
            <p className="text-xs font-mono tabular-nums text-[#047857] mt-0.5">
              {coolingSaved > 0 ? `-${coolingSaved} kWh/m² reduced` : 'Riyadh baseline'}
            </p>
          </div>

          {/* 3. Mostadam Score */}
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Mostadam Score</p>
            <p className="text-base sm:text-lg font-mono font-semibold tabular-nums text-slate-900 leading-tight">
              {kpis.mostadamScore}
              <span className="text-xs font-normal text-slate-500"> / 100</span>{' '}
              <span
                className={`text-xs font-sans font-semibold ml-1 ${
                  kpis.mostadamScore >= 65 ? 'text-[#047857]' : 'text-slate-700'
                }`}
              >
                {kpis.mostadamRating}
              </span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Target: Gold (≥ 65 pts)</p>
          </div>

          {/* 4. SBC 602 & Salmani Index */}
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Code & Salmani Index</p>
            <p className="text-base sm:text-lg font-mono font-semibold tabular-nums text-slate-900 leading-tight">
              {kpis.complianceIndexPct}%
            </p>
            <p
              className={`text-xs mt-0.5 ${
                deficiencyCount > 0 ? 'text-[#B45309]' : 'text-[#047857]'
              }`}
            >
              {deficiencyCount === 0
                ? 'Zero audit flags'
                : `${deficiencyCount} deficiency ${deficiencyCount === 1 ? 'flag' : 'flags'}`}
            </p>
          </div>

          {/* 5. Delivery Timeline */}
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs text-slate-500 mb-0.5">Delivery Timeline</p>
            <p className="text-base sm:text-lg font-mono font-semibold tabular-nums text-slate-900 leading-tight">
              {kpis.totalScheduleWeeks} <span className="text-xs font-normal text-slate-500">Weeks</span>
            </p>
            <p
              className={`text-xs font-mono tabular-nums mt-0.5 ${
                kpis.scheduleDelayWeeks > 0 ? 'text-[#B45309]' : 'text-[#047857]'
              }`}
            >
              {kpis.scheduleDelayWeeks > 0
                ? `+${kpis.scheduleDelayWeeks} wks rework delay`
                : 'On baseline schedule'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
