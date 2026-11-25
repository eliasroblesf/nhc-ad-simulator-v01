import { BookOpen, Download } from 'lucide-react';
import { ActiveWorkspaceView } from '../types/simulation';

interface TopBarProps {
  activeView: ActiveWorkspaceView;
  isComplete: boolean;
  onSelectView: (view: ActiveWorkspaceView) => void;
  onOpenReference: () => void;
  onDownloadPdf?: () => void;
  onRequestReset: () => void;
}

export function TopBar({
  activeView,
  isComplete,
  onSelectView,
  onOpenReference,
  onDownloadPdf,
  onRequestReset,
}: TopBarProps) {
  const navItems: { id: ActiveWorkspaceView; label: string }[] = [
    { id: 'stage', label: isComplete ? 'Stage Archive' : 'Active Stage' },
    { id: 'audit', label: 'Audit Log' },
    { id: 'milestones', label: 'Milestones' },
    ...(isComplete ? [{ id: 'report' as ActiveWorkspaceView, label: 'Final Report' }] : []),
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line brand wordmark */}
        <button
          type="button"
          onClick={() => onSelectView(isComplete ? 'report' : 'stage')}
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#047857] cursor-pointer"
        >
          NHC Development Simulator
        </button>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600" aria-label="Simulation sections">
          {navItems.map((item) => {
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                  active
                    ? 'text-slate-900 border-[#047857]'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={onRequestReset}
            className="py-1 text-slate-500 hover:text-slate-900 border-b-2 border-transparent hover:border-slate-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            New Session
          </button>
        </nav>

        {/* Zone 3: Single primary action button */}
        <div className="flex items-center shrink-0">
          {isComplete && activeView === 'report' && onDownloadPdf ? (
            <button
              type="button"
              onClick={onDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#047857] hover:bg-[#065f46] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857]"
            >
              <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Download PDF</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenReference}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Code Reference</span>
            </button>
          )}
        </div>
      </div>

      {/* Compact mobile navigation row */}
      <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-5 overflow-x-auto text-xs font-medium">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectView(item.id)}
            className={`whitespace-nowrap shrink-0 py-1 ${
              activeView === item.id ? 'text-[#047857] font-semibold' : 'text-slate-600'
            }`}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onRequestReset}
          className="whitespace-nowrap shrink-0 py-1 text-slate-500 ml-auto"
        >
          New Session
        </button>
      </div>
    </header>
  );
}
