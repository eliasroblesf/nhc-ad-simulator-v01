import React, { useState } from 'react';
import { ArrowRight, Building2, Check, Compass, ShieldCheck } from 'lucide-react';
import { RESIDENTIAL_TYPOLOGIES } from '../data/typologies';
import { ParticipantProfile, TypologyId } from '../types/simulation';
import { formatSar } from '../utils/pdfReport';

interface OnboardingGateProps {
  onStartSimulation: (profile: ParticipantProfile) => void;
}

export function OnboardingGate({ onStartSimulation }: OnboardingGateProps) {
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [selectedTypology, setSelectedTypology] = useState<TypologyId>('al_fursan_townhouse');
  const [errorMsg, setErrorMsg] = useState('');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const activeTypology =
    RESIDENTIAL_TYPOLOGIES.find((t) => t.id === selectedTypology) ?? RESIDENTIAL_TYPOLOGIES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = fullName.trim();
    if (trimmedName.length < 2) {
      setErrorMsg('Enter your full name (at least 2 characters) to register your session and final PDF certificate.');
      return;
    }
    setErrorMsg('');
    onStartSimulation({
      fullName: trimmedName,
      organization: organization.trim() || 'NHC Architecture Cohort',
      typologyId: selectedTypology,
      startedAtIso: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-slate-900 flex flex-col">
      {/* Executive Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-[1360px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            NHC Development Simulator
          </span>
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
            <span>Riyadh Climate Zone 1</span>
            <span aria-hidden="true">·</span>
            <span>SBC 2024 / SBC 602</span>
            <span aria-hidden="true">·</span>
            <span>Salmani Urban Code</span>
            <span aria-hidden="true">·</span>
            <span>Mostadam Gold Target</span>
          </div>
          <span className="text-xs font-mono text-slate-600 whitespace-nowrap shrink-0">
            12 Lifecycle Stages
          </span>
        </div>
      </header>

      {/* Main Two-Column Executive Onboarding Grid */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-6 lg:px-10 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Mandate & Identification Form */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white border border-slate-200 rounded-xl p-6 sm:p-8 lg:p-10">
            <div>
              <p className="text-xs font-medium text-[#047857] tracking-wide mb-2">
                NHC Architecture Foundations · Executive Decision Simulation
              </p>
              <h1
                className="text-2xl sm:text-3xl lg:text-[2.15rem] font-bold tracking-tight text-slate-900 leading-tight mb-3"
                style={{ textWrap: 'balance' }}
              >
                From Terrain to Handover: Riyadh Residential Cluster Studio
              </h1>
              <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed max-w-2xl mb-7">
                Step into the role of Lead Development Architect for a flagship National Housing Company
                residential cluster in Riyadh. Across 12 sequential lifecycle stages, cross-reference
                SBC 602 Zone 1 thermal limits, Salmani urban ratios, and Mostadam water/energy rules to
                deliver a compliant, zero-defect handover.
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Participant Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="participant-name"
                      className="block text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      Full Name <span className="text-[#B45309]">*</span>
                    </label>
                    <input
                      id="participant-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="e.g., Eng. Sara Al-Qahtani"
                      autoComplete="name"
                      className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#047857]/25 focus:border-[#047857] transition-colors ${
                        errorMsg ? 'border-[#B45309]' : 'border-slate-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="participant-org"
                      className="block text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      Participant ID / Department / Org
                    </label>
                    <input
                      id="participant-org"
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Defaults to NHC Architecture Cohort"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#047857]/25 focus:border-[#047857] transition-colors"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p role="alert" className="text-xs font-medium text-[#B45309] -mt-3">
                    {errorMsg}
                  </p>
                )}

                {/* Residential Typology Selection */}
                <div>
                  <div className="flex items-baseline justify-between mb-2.5">
                    <span className="text-sm font-semibold text-slate-800">
                      Select Residential Typology
                    </span>
                    <span className="text-xs text-slate-500">
                      Sets CapEx baseline, exposed envelope & cooling load
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {RESIDENTIAL_TYPOLOGIES.map((typ) => {
                      const isSelected = selectedTypology === typ.id;
                      return (
                        <button
                          key={typ.id}
                          type="button"
                          onClick={() => setSelectedTypology(typ.id)}
                          aria-pressed={isSelected}
                          className={`group text-left rounded-lg border p-3.5 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857] ${
                            isSelected
                              ? 'border-[#047857] bg-[#047857]/[0.03] ring-1 ring-[#047857]'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="relative aspect-[4/3] w-full rounded-md overflow-hidden bg-slate-100 mb-3">
                            {!failedImages[typ.id] ? (
                              <img
                                src={typ.imagePath}
                                alt={typ.imageAlt}
                                referrerPolicy="no-referrer"
                                onError={() =>
                                  setFailedImages((prev) => ({ ...prev, [typ.id]: true }))
                                }
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-slate-500 p-4 text-center">
                                <Building2 className="w-7 h-7 mb-1.5 text-slate-400" />
                                <span className="text-xs font-medium">{typ.name}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h2 className="text-sm font-semibold text-slate-900 leading-snug">
                              {typ.name}
                            </h2>
                            <span
                              className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center border ${
                                isSelected
                                  ? 'bg-[#047857] border-[#047857] text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                              aria-hidden="true"
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed mb-2.5">
                            {typ.subtitle}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums text-slate-600">
                            <span>Plot {typ.plotAreaM2} m²</span>
                            <span aria-hidden="true">·</span>
                            <span>GFA {typ.gfaM2} m²</span>
                            <span aria-hidden="true">·</span>
                            <span>{typ.exposedFacades} Facades</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Session progress saves locally in your browser and populates your final PDF Audit Report.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#047857] hover:bg-[#065f46] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857]"
                  >
                    <span>Start Simulation</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Selected Typology Architectural Dossier */}
          <aside className="lg:col-span-5 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="relative h-56 sm:h-64 lg:h-72 bg-slate-100 shrink-0">
              {!failedImages[`hero_${activeTypology.id}`] ? (
                <img
                  src={activeTypology.imagePath}
                  alt={activeTypology.imageAlt}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setFailedImages((prev) => ({ ...prev, [`hero_${activeTypology.id}`]: true }))
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-200 text-slate-600">
                  <Building2 className="w-10 h-10" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <p className="text-xs text-slate-200 mb-0.5">{activeTypology.district}</p>
                <p className="text-lg font-bold tracking-tight leading-snug">
                  {activeTypology.name}
                </p>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between gap-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  Project Brief & Baseline Parameters
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {activeTypology.architecturalContext}
                </p>

                <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5 pt-4 border-t border-slate-100 text-sm">
                  <div>
                    <dt className="text-xs text-slate-500">Baseline CapEx</dt>
                    <dd className="font-mono font-semibold text-slate-900 tabular-nums mt-0.5">
                      {formatSar(activeTypology.baselineCapExSar)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Baseline Cooling Load</dt>
                    <dd className="font-mono font-semibold text-slate-900 tabular-nums mt-0.5">
                      {activeTypology.baselineCoolingKwhM2} kWh/m²·yr
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Delivery Schedule</dt>
                    <dd className="font-mono font-semibold text-slate-900 tabular-nums mt-0.5">
                      {activeTypology.baselineScheduleWeeks} Weeks
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Certification Mandate</dt>
                    <dd className="font-semibold text-[#047857] mt-0.5">
                      {activeTypology.targetMostadam}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#047857] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong className="text-slate-800 font-semibold">Strict Mastery Gate:</strong>{' '}
                    Suboptimal choices incur SAR rework penalties, schedule delays, and Architectural
                    Review Board deficiency flags until resolved.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Compass className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong className="text-slate-800 font-semibold">Code Reference & Calculators:</strong>{' '}
                    Cross-check SBC 602 U-values, SHGC, WWR, and Mostadam weights in the reference
                    drawer at every stage.
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
