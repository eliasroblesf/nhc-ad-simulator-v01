import { AlertTriangle, X } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirmReset: () => void;
}

export function ResetModal({ isOpen, onCancel, onConfirmReset }: ResetModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#B45309] shrink-0" aria-hidden="true" />
            <h2 id="reset-modal-title" className="text-base font-bold text-slate-900">
              Start a New Simulation Session?
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-700 p-1 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Starting a new session will clear your current participant record, stage mastery progress,
          rework ledger, and elapsed timer from this browser and return you to the onboarding gate.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirmReset}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#B45309] hover:bg-[#92400e] rounded-lg transition-colors cursor-pointer"
          >
            Reset Session
          </button>
        </div>
      </div>
    </div>
  );
}
