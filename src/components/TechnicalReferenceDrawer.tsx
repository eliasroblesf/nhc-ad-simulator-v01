import { useState } from 'react';
import { Calculator, CheckCircle2, X, XCircle } from 'lucide-react';
import {
  MATERIAL_THERMAL_CONDUCTIVITY,
  MOSTADAM_CATEGORIES,
  MOSTADAM_RATING_TIERS,
  SALMANI_URBAN_GUIDELINES,
  SBC_602_ZONE1_LIMITS,
} from '../data/referenceData';

interface TechnicalReferenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type RefTab = 'sbc602' | 'mostadam' | 'salmani' | 'calculators';

export function TechnicalReferenceDrawer({ isOpen, onClose }: TechnicalReferenceDrawerProps) {
  const [activeTab, setActiveTab] = useState<RefTab>('sbc602');

  // Interactive U-Value Calculator state
  const [assemblyType, setAssemblyType] = useState<'wall' | 'roof'>('wall');
  const [structThickMm, setStructThickMm] = useState(200);
  const [structLambda, setStructLambda] = useState(0.85); // Concrete block default
  const [insulThickMm, setInsulThickMm] = useState(100);
  const [insulLambda, setInsulLambda] = useState(0.036); // Rockwool default
  const [claddingThickMm, setCladdingThickMm] = useState(30);

  // Interactive WWR Calculator state
  const [glazingAreaM2, setGlazingAreaM2] = useState(64.6);
  const [grossWallAreaM2, setGrossWallAreaM2] = useState(340);

  // Interactive Simple Payback Calculator state
  const [netCapExSar, setNetCapExSar] = useState(38000);
  const [annualSavingsSar, setAnnualSavingsSar] = useState(5600);

  if (!isOpen) return null;

  // U-Value Calculation (ISO 6946)
  const surfaceFilmsR = assemblyType === 'wall' ? 0.17 : 0.14;
  const rStruct = structThickMm / 1000 / Math.max(0.01, structLambda);
  const rInsul = insulThickMm / 1000 / Math.max(0.01, insulLambda);
  const rClad = claddingThickMm / 1000 / 1.3;
  const rTotal = surfaceFilmsR + rStruct + rInsul + rClad;
  const uValue = rTotal > 0 ? 1 / rTotal : 0;
  const uLimit = assemblyType === 'wall' ? 0.342 : 0.202;
  const uPasses = uValue <= uLimit;

  // WWR Calculation
  const wwrPct = grossWallAreaM2 > 0 ? (glazingAreaM2 / grossWallAreaM2) * 100 : 0;
  const wwrPasses = wwrPct <= 25;

  // Payback Calculation
  const paybackYears = annualSavingsSar > 0 ? netCapExSar / annualSavingsSar : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Technical Data Drawer and Code Reference Sheet"
    >
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />

      <aside className="w-full max-w-2xl bg-white h-full border-l border-slate-200 shadow-2xl flex flex-col">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Technical Data Drawer & Code Reference Sheet
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Riyadh Climate Zone 1 · SBC 602 / 501 / 304 · Mostadam Residential · Salmani Code
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close technical reference drawer"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented Tab Controls */}
        <div className="px-6 py-3 bg-[#F8F7F4] border-b border-slate-200">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg overflow-x-auto">
            {[
              { id: 'sbc602' as RefTab, label: 'SBC 602 Zone 1' },
              { id: 'mostadam' as RefTab, label: 'Mostadam' },
              { id: 'salmani' as RefTab, label: 'Salmani & Climate' },
              { id: 'calculators' as RefTab, label: 'Calculators' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'sbc602' && (
            <>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  SBC 602 Prescriptive Envelope & Mechanical Limits (Riyadh — Zone 1)
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F8F7F4] border-b border-slate-200 text-slate-600">
                        <th className="py-2.5 px-3 font-semibold">Parameter</th>
                        <th className="py-2.5 px-3 font-semibold">Zone 1 Limit</th>
                        <th className="py-2.5 px-3 font-semibold">Engineering Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {SBC_602_ZONE1_LIMITS.map((row) => (
                        <tr key={row.parameter} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 font-medium text-slate-900 align-top">
                            {row.parameter}
                            <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                              {row.clauseRef}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-[#047857] tabular-nums align-top whitespace-nowrap">
                            {row.sbc602Limit}
                            <div className="text-[11px] font-normal text-slate-500">{row.units}</div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 leading-relaxed align-top">
                            {row.engineeringNote}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  Material Thermal Conductivity Reference (λ in W/m·K)
                </h3>
                <p className="text-xs text-slate-500 mb-2.5">
                  Formula: <span className="font-mono text-slate-800">R = d (m) / λ</span> ·{' '}
                  <span className="font-mono text-slate-800">U = 1 / (R_si + ΣR + R_so)</span>
                </p>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F8F7F4] border-b border-slate-200 text-slate-600">
                        <th className="py-2 px-3 font-semibold">Material</th>
                        <th className="py-2 px-3 font-semibold text-right">λ (W/m·K)</th>
                        <th className="py-2 px-3 font-semibold text-right">Typ. R</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MATERIAL_THERMAL_CONDUCTIVITY.map((mat) => (
                        <tr key={mat.material}>
                          <td className="py-2 px-3">
                            <div className="font-medium text-slate-900">{mat.material}</div>
                            <div className="text-[11px] text-slate-500">{mat.application}</div>
                          </td>
                          <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-800">
                            {mat.lambdaWmk > 0 ? mat.lambdaWmk.toFixed(3) : '—'}
                          </td>
                          <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                            {mat.rValueAtTypical.toFixed(3)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'mostadam' && (
            <>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  Mostadam Residential Certification Tiers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {MOSTADAM_RATING_TIERS.map((tier) => (
                    <div
                      key={tier.rating}
                      className={`p-3 rounded-lg border ${
                        tier.rating === 'Gold'
                          ? 'border-[#047857] bg-[#047857]/[0.04]'
                          : 'border-slate-200 bg-[#F8F7F4]'
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-900">{tier.rating}</p>
                      <p className="text-xs font-mono tabular-nums text-[#047857] font-semibold mt-0.5">
                        {tier.range}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">{tier.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  Category Weights & Riyadh Design Priorities
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F8F7F4] border-b border-slate-200 text-slate-600">
                        <th className="py-2.5 px-3 font-semibold">Category</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Weight</th>
                        <th className="py-2.5 px-3 font-semibold">Riyadh Credit Strategy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MOSTADAM_CATEGORIES.map((cat) => (
                        <tr key={cat.category}>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 align-top">
                            {cat.category}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-[#047857] align-top">
                            {cat.weightPct}%
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 leading-relaxed align-top">
                            {cat.keyRiyadhCreditFocus}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'salmani' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Salmani Architectural Code & Riyadh Microclimate Standards
                </h3>
                <p className="text-xs text-slate-500">
                  Core physical and cultural benchmarks evaluated by the NHC Architectural Review Board.
                </p>
              </div>
              <div className="space-y-3">
                {SALMANI_URBAN_GUIDELINES.map((item) => (
                  <div
                    key={item.principle}
                    className="p-4 rounded-lg border border-slate-200 bg-[#FCFBF9]"
                  >
                    <h4 className="text-xs font-bold text-slate-900 mb-1">{item.principle}</h4>
                    <p className="text-xs text-slate-700 leading-relaxed mb-2">
                      {item.requirement}
                    </p>
                    <p className="text-[11px] text-[#047857] font-medium">
                      Climate Link: {item.climatePerformanceLink}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'calculators' && (
            <div className="space-y-6">
              {/* 1. U-Value Calculator */}
              <div className="p-4 rounded-lg border border-slate-200 bg-[#FCFBF9] space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-[#047857]" aria-hidden="true" />
                    <h3 className="text-sm font-bold text-slate-900">
                      SBC 602 Assembly U-Value Calculator
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 rounded-md">
                    <button
                      type="button"
                      onClick={() => {
                        setAssemblyType('wall');
                        setStructThickMm(200);
                        setStructLambda(0.85);
                        setInsulThickMm(100);
                        setInsulLambda(0.036);
                      }}
                      className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                        assemblyType === 'wall' ? 'bg-white text-slate-900' : 'text-slate-600'
                      }`}
                    >
                      Wall (≤ 0.342)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAssemblyType('roof');
                        setStructThickMm(220);
                        setStructLambda(1.75);
                        setInsulThickMm(150);
                        setInsulLambda(0.03);
                      }}
                      className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                        assemblyType === 'roof' ? 'bg-white text-slate-900' : 'text-slate-600'
                      }`}
                    >
                      Roof (≤ 0.202)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <label className="block">
                    <span className="text-slate-600 font-medium">Structure Thickness (mm)</span>
                    <input
                      type="number"
                      min={0}
                      max={600}
                      value={structThickMm}
                      onChange={(e) => setStructThickMm(Number(e.target.value) || 0)}
                      className="mt-1 w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono tabular-nums"
                    />
                  </label>
                  <label className="block">
                    <span className="text-slate-600 font-medium">Structure λ (W/m·K)</span>
                    <select
                      value={structLambda}
                      onChange={(e) => setStructLambda(Number(e.target.value))}
                      className="mt-1 w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono"
                    >
                      <option value={1.75}>RC Concrete (1.75)</option>
                      <option value={0.85}>Hollow Block (0.85)</option>
                      <option value={0.14}>AAC Block (0.14)</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-slate-600 font-medium">Insulation Thickness (mm)</span>
                    <input
                      type="number"
                      min={0}
                      max={300}
                      value={insulThickMm}
                      onChange={(e) => setInsulThickMm(Number(e.target.value) || 0)}
                      className="mt-1 w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono tabular-nums"
                    />
                  </label>
                  <label className="block">
                    <span className="text-slate-600 font-medium">Insulation λ (W/m·K)</span>
                    <select
                      value={insulLambda}
                      onChange={(e) => setInsulLambda(Number(e.target.value))}
                      className="mt-1 w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono"
                    >
                      <option value={0.036}>Rockwool ETICS (0.036)</option>
                      <option value={0.03}>XPS Rigid Board (0.030)</option>
                      <option value={0.026}>Fresh SPF Foam (0.026)</option>
                    </select>
                  </label>

                  <label className="block col-span-2">
                    <span className="text-slate-600 font-medium">
                      Cladding / Screed Thickness (mm, λ = 1.30)
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={150}
                      value={claddingThickMm}
                      onChange={(e) => setCladdingThickMm(Number(e.target.value) || 0)}
                      className="mt-1 w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono tabular-nums"
                    />
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-4">
                  <div className="font-mono tabular-nums text-xs space-y-0.5">
                    <p className="text-slate-500">
                      Total R-Value: <strong className="text-slate-900">{rTotal.toFixed(2)} m²·K/W</strong>
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      Computed U = {uValue.toFixed(3)} W/m²·K
                    </p>
                  </div>
                  <div
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      uPasses ? 'text-[#047857]' : 'text-[#B45309]'
                    }`}
                  >
                    {uPasses ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>
                      {uPasses
                        ? `PASSES Zone 1 (≤ ${uLimit})`
                        : `FAILS Zone 1 (> ${uLimit})`}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. WWR Calculator */}
              <div className="p-4 rounded-lg border border-slate-200 bg-[#FCFBF9] space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Window-to-Wall Ratio (WWR) Check
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <label className="block">
                    <span className="text-slate-600 font-medium">Total Glazing Area (m²)</span>
                    <input
                      type="number"
                      min={0}
                      step="0.5"
                      value={glazingAreaM2}
                      onChange={(e) => setGlazingAreaM2(Number(e.target.value) || 0)}
                      className="mt-1 w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono tabular-nums"
                    />
                  </label>
                  <label className="block">
                    <span className="text-slate-600 font-medium">Gross Exterior Wall Area (m²)</span>
                    <input
                      type="number"
                      min={1}
                      step="1"
                      value={grossWallAreaM2}
                      onChange={(e) => setGrossWallAreaM2(Number(e.target.value) || 1)}
                      className="mt-1 w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono tabular-nums"
                    />
                  </label>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    WWR = {wwrPct.toFixed(1)}%
                  </span>
                  <span className={`font-semibold ${wwrPasses ? 'text-[#047857]' : 'text-[#B45309]'}`}>
                    {wwrPasses ? 'PASSES SBC 602 (≤ 25%)' : 'EXCEEDS 25% Prescriptive Cap'}
                  </span>
                </div>
              </div>

              {/* 3. Simple Lifecycle Payback Calculator */}
              <div className="p-4 rounded-lg border border-slate-200 bg-[#FCFBF9] space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  VE & Energy Lifecycle Payback Check
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <label className="block">
                    <span className="text-slate-600 font-medium">Net Upfront CapEx Delta (SAR)</span>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={netCapExSar}
                      onChange={(e) => setNetCapExSar(Number(e.target.value) || 0)}
                      className="mt-1 w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono tabular-nums"
                    />
                  </label>
                  <label className="block">
                    <span className="text-slate-600 font-medium">Annual Energy Saving (SAR/yr)</span>
                    <input
                      type="number"
                      min={1}
                      step={200}
                      value={annualSavingsSar}
                      onChange={(e) => setAnnualSavingsSar(Number(e.target.value) || 1)}
                      className="mt-1 w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono tabular-nums"
                    />
                  </label>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-mono tabular-nums">
                  <span className="text-slate-600">
                    Simple Payback: <strong className="text-slate-900">{paybackYears.toFixed(1)} years</strong>
                  </span>
                  <span className="text-slate-600">
                    15-Yr Net Return:{' '}
                    <strong className="text-[#047857]">
                      {(annualSavingsSar * 15 - netCapExSar).toLocaleString('en-US')} SAR
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
