import { Award, CheckCircle2, Lock } from 'lucide-react';
import { MilestoneBadge } from '../types/simulation';

interface MilestonesViewProps {
  badges: MilestoneBadge[];
}

export function MilestonesView({ badges }: MilestonesViewProps) {
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-medium text-[#047857] mb-1">
            Competency Verification Honors
          </p>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Architectural Mastery Milestones
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Unlocked milestones are recorded automatically on your downloadable Executive PDF
            Certificate.
          </p>
        </div>
        <span className="text-sm font-mono font-semibold tabular-nums text-slate-900">
          {unlockedCount} / {badges.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`rounded-xl border p-5 flex flex-col justify-between gap-4 transition-colors ${
              badge.unlocked
                ? 'border-[#047857]/45 bg-[#ECFDF5]/45'
                : 'border-slate-200 bg-[#FCFBF9]'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                    badge.unlocked
                      ? 'bg-[#047857] text-white border-[#047857]'
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  {badge.unlocked ? (
                    <Award className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Lock className="w-4 h-4" aria-hidden="true" />
                  )}
                </div>
                <span className="text-xs font-mono text-slate-500">{badge.stagesCovered}</span>
              </div>

              <h2 className="text-base font-bold text-slate-900 mb-1.5">{badge.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{badge.criteria}</p>
            </div>

            <div className="pt-3 border-t border-slate-200/70 flex items-center gap-1.5 text-xs">
              {badge.unlocked ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#047857] shrink-0" />
                  <span className="font-medium text-[#047857]">{badge.statusNote}</span>
                </>
              ) : (
                <span className="text-slate-500">{badge.statusNote}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
