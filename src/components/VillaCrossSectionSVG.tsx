import { useState } from 'react';
import { Layers, Sun, Thermometer, Wind } from 'lucide-react';
import { SIMULATION_STAGES } from '../data/stages';
import { StageOutcome } from '../types/simulation';

interface VillaCrossSectionSVGProps {
  stageOutcomes: Record<number, StageOutcome>;
  activeStageId: number;
  viewingStageId: number;
  onSelectStage: (stageId: number) => void;
}

export function VillaCrossSectionSVG({
  stageOutcomes,
  activeStageId,
  viewingStageId,
  onSelectStage,
}: VillaCrossSectionSVGProps) {
  const [showSolar, setShowSolar] = useState(true);
  const [showWind, setShowWind] = useState(true);
  const [showThermal, setShowThermal] = useState(true);
  const [inspectedLayer, setInspectedLayer] = useState<string | null>(null);

  const mastered = (id: number) => Boolean(stageOutcomes[id]?.completed);

  const s1Bedrock = mastered(1);
  const s2Massing = mastered(2);
  const s3Zoning = mastered(3);
  const s4Foundation = mastered(4);
  const s5WallInsul = mastered(5);
  const s6Fenestration = mastered(6);
  const s7Roof = mastered(7);
  const s8Hvac = mastered(8);
  const s9WaterPv = mastered(9);
  const s10VeLock = mastered(10);
  const s11AirQa = mastered(11);
  const s12Handover = mastered(12);

  const masteredCount = SIMULATION_STAGES.filter((s) => mastered(s.id)).length;

  const activeLayerText =
    inspectedLayer ??
    (masteredCount === 0
      ? 'Baseline Riyadh villa envelope prior to Stage 1 geotechnical & site engineering.'
      : SIMULATION_STAGES.filter((s) => mastered(s.id))
          .slice(-1)[0]
          ?.svgLayerLabel ?? 'Progressive Architectural Cross-Section');

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
      {/* Header & Physics Overlay Controls */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Interactive Architectural Cross-Section
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {masteredCount} of 12 verified assemblies built · Click layers to inspect
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#F8F7F4] border border-slate-200 rounded-lg">
          <button
            type="button"
            onClick={() => setShowSolar((v) => !v)}
            aria-pressed={showSolar}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              showSolar ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-[#B45309]" aria-hidden="true" />
            <span>Sun</span>
          </button>
          <button
            type="button"
            onClick={() => setShowWind((v) => !v)}
            aria-pressed={showWind}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              showWind ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
            <span>Shamal</span>
          </button>
          <button
            type="button"
            onClick={() => setShowThermal((v) => !v)}
            aria-pressed={showThermal}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              showThermal ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5 text-[#047857]" aria-hidden="true" />
            <span>Thermal</span>
          </button>
        </div>
      </div>

      {/* Main Dynamic SVG Drawing */}
      <div className="p-4 bg-[#FCFBF9] border-b border-slate-100">
        <svg
          viewBox="0 0 640 420"
          className="w-full h-auto block select-none"
          role="img"
          aria-label="Dynamic Riyadh NHC architectural cross-section updating across 12 engineering stages"
        >
          <defs>
            <pattern id="bedrockHatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
              <line x1="0" y1="0" x2="0" y2="12" stroke="#94A3B8" strokeWidth="1" opacity="0.45" />
            </pattern>
            <pattern id="rockwoolHatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#047857" strokeWidth="1.4" opacity="0.65" />
            </pattern>
            <pattern id="xpsHatch" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M0 8 L8 0 M-2 2 L2 -2 M6 10 L10 6" stroke="#0284C7" strokeWidth="1" opacity="0.55" />
            </pattern>
            <pattern id="mashrabiyaGrid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M0 2.5 L2.5 0 L5 2.5 L2.5 5 Z" fill="none" stroke="#92400E" strokeWidth="0.85" />
            </pattern>
            <marker id="arrowAmber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#D97706" />
            </marker>
            <marker id="arrowSky" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284C7" />
            </marker>
            <marker id="arrowEmerald" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#047857" />
            </marker>
          </defs>

          {/* Architectural Grid Backdrop */}
          <rect x="0" y="0" width="640" height="335" fill="#F8FAFC" />
          <g stroke="#E2E8F0" strokeWidth="0.6" opacity="0.7">
            {[60, 120, 180, 240, 300].map((y) => (
              <line key={y} x1="0" y1={y} x2="640" y2={y} />
            ))}
            {[80, 160, 240, 320, 400, 480, 560].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="335" />
            ))}
          </g>

          {/* Orientation Datum */}
          <text x="20" y="22" fontSize="9.5" fill="#64748B" fontFamily="IBM Plex Mono, monospace">
            NORTH / SHAMAL (330°) ←
          </text>
          <text x="488" y="22" fontSize="9.5" fill="#64748B" fontFamily="IBM Plex Mono, monospace">
            → SOUTH / SOLAR PEAK
          </text>

          {/* STAGE 1: Terrain & Bedrock Subsurface */}
          <g
            className="cursor-pointer"
            onClick={() =>
              setInspectedLayer(
                s1Bedrock
                  ? 'Stage 01 Verified: Competent Jubaila Limestone (320 kPa) with 35 m wadi flood buffer & detention swale.'
                  : 'Stage 01 Pending: Unverified alluvial/fill substrate — select competent bedrock parcel.'
              )
            }
          >
            {/* Subsurface soil layer */}
            <rect
              x="0"
              y="335"
              width="640"
              height="85"
              fill={s1Bedrock ? '#E7E2D8' : '#F1E6D6'}
            />
            {s1Bedrock ? (
              <>
                <rect x="0" y="352" width="640" height="68" fill="url(#bedrockHatch)" />
                <line x1="0" y1="352" x2="640" y2="352" stroke="#64748B" strokeWidth="1.2" strokeDasharray="6 3" />
                {/* Rock-lined detention swale on far right */}
                <path d="M 555 335 Q 585 352 615 335" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.3" />
                <text x="18" y="405" fontSize="9.5" fill="#334155" fontFamily="IBM Plex Mono, monospace">
                  JUBAILA LIMESTONE BEDROCK (320 kPa) · +4.2 m ABOVE WADI FLOOD LINE
                </text>
                <text x="550" y="328" fontSize="8.5" fill="#0369A1" fontFamily="IBM Plex Mono, monospace">
                  BIO-SWALE
                </text>
              </>
            ) : (
              <text x="18" y="382" fontSize="9.5" fill="#B45309" fontFamily="IBM Plex Mono, monospace">
                UNVERIFIED SUBGRADE / WADI FLOOD RISK (STAGE 01 PENDING)
              </text>
            )}
            <line x1="0" y1="335" x2="640" y2="335" stroke="#475569" strokeWidth="1.6" />
          </g>

          {/* STAGE 2: Neighboring Salmani Cluster & Shaded Sikka (Left side) */}
          <g
            className="cursor-pointer"
            onClick={() =>
              setInspectedLayer(
                s2Massing
                  ? 'Stage 02 Verified: East–West cluster massing with 4.5 m shaded Sikka (H/W = 2.0, 74% peak shade).'
                  : 'Stage 02 Pending: Sikka corridor width & mutual self-shading orientation not yet finalized.'
              )
            }
          >
            {/* Neighboring villa mass creating Sikka canyon */}
            <rect
              x="16"
              y={s2Massing ? 128 : 190}
              width="72"
              height={s2Massing ? 207 : 145}
              fill={s2Massing ? '#E8E3D9' : '#E2E8F0'}
              stroke="#94A3B8"
              strokeWidth="1.2"
            />
            {s2Massing && (
              <>
                {/* Shaded Sikka volume */}
                <polygon points="88,128 164,185 164,335 88,335" fill="#0F172A" opacity="0.07" />
                <line x1="92" y1="322" x2="160" y2="322" stroke="#047857" strokeWidth="1.2" />
                <text x="95" y="316" fontSize="8.5" fill="#047857" fontFamily="IBM Plex Mono, monospace">
                  SIKKA H/W 2.0
                </text>
              </>
            )}
            <text x="24" y="250" fontSize="8.5" fill="#64748B" fontFamily="IBM Plex Mono, monospace">
              CLUSTER
            </text>
          </g>

          {/* STAGE 4: Foundation & Slab-Edge Thermal Break */}
          <g
            className="cursor-pointer"
            onClick={() =>
              setInspectedLayer(
                s4Foundation
                  ? 'Stage 04 Verified: Type V Sulfate-Resistant concrete footings (w/c ≤ 0.45) + 50 mm XPS slab-edge thermal break.'
                  : 'Stage 04 Pending: Standard concrete foundation — perimeter slab thermal break not installed.'
              )
            }
          >
            {/* Footings */}
            <rect x="158" y="335" width="38" height="24" fill={s4Foundation ? '#64748B' : '#94A3B8'} stroke="#334155" strokeWidth="1" />
            <rect x="330" y="335" width="32" height="24" fill={s4Foundation ? '#64748B' : '#94A3B8'} stroke="#334155" strokeWidth="1" />
            <rect x="492" y="335" width="38" height="24" fill={s4Foundation ? '#64748B' : '#94A3B8'} stroke="#334155" strokeWidth="1" />
            {/* Ground floor slab */}
            <rect x="164" y="325" width="360" height="12" fill="#94A3B8" stroke="#334155" strokeWidth="1" />

            {s4Foundation && (
              <>
                {/* 50 mm XPS Perimeter Thermal Break */}
                <rect x="156" y="322" width="8" height="36" fill="#0284C7" opacity="0.85" />
                <rect x="524" y="322" width="8" height="36" fill="#0284C7" opacity="0.85" />
                {/* SBS Waterproofing Tanking line */}
                <path d="M 157 359 L 531 359" stroke="#0F172A" strokeWidth="2" />
              </>
            )}
          </g>

          {/* MAIN VILLA STRUCTURAL SHELL (Ground + First Floor + Hosh Courtyard) */}
          {/* Left Wing (Majlis Ground + Master Upper) */}
          <rect x="164" y="138" width="166" height="187" fill="#FFFFFF" stroke="#334155" strokeWidth="1.5" />
          {/* Right Wing (Family Living Ground + Bedrooms Upper) */}
          <rect x="386" y="138" width="138" height="187" fill="#FFFFFF" stroke="#334155" strokeWidth="1.5" />
          {/* Central Hosh Courtyard Bridge / Clerestory */}
          <rect x="330" y="218" width="56" height="107" fill={s3Zoning ? '#F0FDF4' : '#F8FAFC'} stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 2" />
          {/* First floor structural slab */}
          <rect x="164" y="226" width="166" height="10" fill="#CBD5E1" stroke="#475569" strokeWidth="1" />
          <rect x="386" y="226" width="138" height="10" fill="#CBD5E1" stroke="#475569" strokeWidth="1" />
          {/* Roof structural slab */}
          <rect x="164" y="132" width="166" height="12" fill="#CBD5E1" stroke="#475569" strokeWidth="1" />
          <rect x="386" y="132" width="138" height="12" fill="#CBD5E1" stroke="#475569" strokeWidth="1" />
          {/* Parapet Walls */}
          <rect x="164" y="108" width="10" height="24" fill="#CBD5E1" stroke="#475569" strokeWidth="1" />
          <rect x="320" y="108" width="10" height="24" fill="#CBD5E1" stroke="#475569" strokeWidth="1" />
          <rect x="386" y="108" width="10" height="24" fill="#CBD5E1" stroke="#475569" strokeWidth="1" />
          <rect x="514" y="108" width="10" height="24" fill="#CBD5E1" stroke="#475569" strokeWidth="1" />

          {/* STAGE 3: Spatial Zoning Labels & Acoustic Vestibule */}
          <g
            className="cursor-pointer"
            onClick={() =>
              setInspectedLayer(
                s3Zoning
                  ? 'Stage 03 Verified: Acoustic STC 52 Majlis vestibule with independent HVAC zone + inward shaded Hosh stack core.'
                  : 'Stage 03 Pending: Interior Majlis privacy buffer and Hosh passive stack ventilation not finalized.'
              )
            }
          >
            <text x="192" y="286" fontSize="9.5" fontWeight="600" fill="#334155" fontFamily="Plus Jakarta Sans, sans-serif">
              MAJLIS
            </text>
            <text x="414" y="286" fontSize="9.5" fontWeight="600" fill="#334155" fontFamily="Plus Jakarta Sans, sans-serif">
              FAMILY LIVING
            </text>
            <text x="192" y="186" fontSize="9" fill="#64748B" fontFamily="Plus Jakarta Sans, sans-serif">
              UPPER SUITE
            </text>
            <text x="414" y="186" fontSize="9" fill="#64748B" fontFamily="Plus Jakarta Sans, sans-serif">
              BEDROOMS
            </text>

            {s3Zoning && (
              <>
                {/* Acoustic vestibule double partition */}
                <rect x="292" y="236" width="12" height="89" fill="#E2E8F0" stroke="#047857" strokeWidth="1.2" />
                <text x="268" y="316" fontSize="7.5" fill="#047857" fontFamily="IBM Plex Mono, monospace">
                  STC 52
                </text>
                {/* Hosh label + stack draft */}
                <text x="342" y="302" fontSize="8.5" fontWeight="600" fill="#047857" fontFamily="IBM Plex Mono, monospace">
                  HOSH
                </text>
                {showWind && (
                  <path
                    d="M 358 290 C 358 250, 358 215, 358 168"
                    fill="none"
                    stroke="#047857"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    markerEnd="url(#arrowEmerald)"
                  />
                )}
              </>
            )}
          </g>

          {/* STAGE 5: Continuous Exterior 100 mm Rockwool Thermal Envelope */}
          {s5WallInsul && (
            <g
              className="cursor-pointer"
              onClick={() =>
                setInspectedLayer(
                  'Stage 05 Verified: Continuous 100 mm exterior Rockwool (U_eff = 0.312 W/m²·K ≤ 0.342) wrapping all RC columns & slab edges.'
                )
              }
            >
              {/* Left outer continuous insulation */}
              <rect x="155" y="108" width="9" height="218" fill="url(#rockwoolHatch)" stroke="#047857" strokeWidth="1.1" />
              {/* Right outer continuous insulation */}
              <rect x="524" y="108" width="9" height="218" fill="url(#rockwoolHatch)" stroke="#047857" strokeWidth="1.1" />
              {/* Courtyard walls continuous insulation */}
              <rect x="330" y="108" width="6" height="217" fill="url(#rockwoolHatch)" stroke="#047857" strokeWidth="0.9" />
              <rect x="380" y="108" width="6" height="217" fill="url(#rockwoolHatch)" stroke="#047857" strokeWidth="0.9" />
            </g>
          )}

          {/* STAGE 6: Recessed Low-E Fenestration & Bronze Salmani Mashrabiya */}
          <g
            className="cursor-pointer"
            onClick={() =>
              setInspectedLayer(
                s6Fenestration
                  ? 'Stage 06 Verified: 19% WWR thermally broken low-E IGU (SHGC 0.22, U 1.75), 300 mm deep reveals & bronze Salmani mashrabiya.'
                  : 'Stage 06 Pending: Flush unshaded apertures — solar heat gain & WWR not yet controlled.'
              )
            }
          >
            {s6Fenestration ? (
              <>
                {/* Deep recessed low-E windows */}
                <rect x="155" y="160" width="12" height="44" fill="#BAE6FD" stroke="#0369A1" strokeWidth="1.2" />
                <rect x="151" y="158" width="6" height="48" fill="url(#mashrabiyaGrid)" stroke="#92400E" strokeWidth="1" />
                <rect x="521" y="160" width="12" height="44" fill="#BAE6FD" stroke="#0369A1" strokeWidth="1.2" />
                <rect x="531" y="158" width="6" height="48" fill="url(#mashrabiyaGrid)" stroke="#92400E" strokeWidth="1" />
                {/* Ground recessed windows */}
                <rect x="521" y="255" width="12" height="42" fill="#BAE6FD" stroke="#0369A1" strokeWidth="1.2" />
                <line x1="518" y1="255" x2="540" y2="255" stroke="#475569" strokeWidth="2.5" />
              </>
            ) : (
              <>
                {/* Unshaded baseline glazing */}
                <rect x="162" y="156" width="5" height="58" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                <rect x="522" y="156" width="5" height="58" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                <rect x="522" y="250" width="5" height="54" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
              </>
            )}
          </g>

          {/* STAGE 7: Inverted Roof Assembly (SBS + 150 mm XPS + High-SRI 82 Tiles + Parapet Cap) */}
          {s7Roof && (
            <g
              className="cursor-pointer"
              onClick={() =>
                setInspectedLayer(
                  'Stage 07 Verified: Inverted roof with dual SBS membrane, 150 mm XPS (U = 0.185 W/m²·K ≤ 0.202), SRI 82 tiles & insulated parapet caps.'
                )
              }
            >
              {/* Left wing roof layers */}
              <line x1="174" y1="131" x2="320" y2="131" stroke="#0F172A" strokeWidth="2" />
              <rect x="174" y="119" width="146" height="11" fill="url(#xpsHatch)" stroke="#0284C7" strokeWidth="1" />
              <rect x="174" y="114" width="146" height="5" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="0.8" />
              {/* Parapet thermal caps */}
              <rect x="155" y="103" width="22" height="5" fill="#047857" />
              <rect x="318" y="103" width="18" height="5" fill="#047857" />

              {/* Right wing roof layers */}
              <line x1="396" y1="131" x2="514" y2="131" stroke="#0F172A" strokeWidth="2" />
              <rect x="396" y="119" width="118" height="11" fill="url(#xpsHatch)" stroke="#0284C7" strokeWidth="1" />
              <rect x="396" y="114" width="118" height="5" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="0.8" />
              <rect x="380" y="103" width="18" height="5" fill="#047857" />
              <rect x="512" y="103" width="22" height="5" fill="#047857" />
            </g>
          )}

          {/* STAGE 8: Right-Sized T3 Inverter HVAC & MERV-13 ERV */}
          {s8Hvac && (
            <g
              className="cursor-pointer"
              onClick={() =>
                setInspectedLayer(
                  'Stage 08 Verified: Right-sized 12.5 TR T3 Inverter VRF (EER 11.8 @ 46°C) + MERV-13 ERV dust-filtration fresh air.'
                )
              }
            >
              {/* Rooftop condenser unit behind left parapet (clear of PV) */}
              <rect x="184" y="88" width="38" height="25" rx="2" fill="#334155" stroke="#0F172A" strokeWidth="1" />
              <circle cx="203" cy="100" r="7" fill="none" stroke="#94A3B8" strokeWidth="1.2" />
              <text x="183" y="83" fontSize="8" fill="#334155" fontFamily="IBM Plex Mono, monospace">
                T3 VRF + ERV
              </text>
              {/* Plenum supply duct indicators */}
              <line x1="203" y1="113" x2="203" y2="150" stroke="#0284C7" strokeWidth="1.8" strokeDasharray="3 2" />
              <rect x="234" y="144" width="44" height="8" rx="1" fill="#E0F2FE" stroke="#0284C7" strokeWidth="0.9" />
              <text x="237" y="150.5" fontSize="6.5" fill="#0369A1" fontFamily="IBM Plex Mono, monospace">
                MERV-13
              </text>
            </g>
          )}

          {/* STAGE 9: Elevated 24° South Solar PV Canopy & Greywater Xeriscape */}
          {s9WaterPv && (
            <g
              className="cursor-pointer"
              onClick={() =>
                setInspectedLayer(
                  'Stage 09 Verified: Shade-free 5.4 kWp 24° South PV canopy (~9,400 kWh/yr) + greywater membrane feeding native Acacia xeriscape.'
                )
              }
            >
              {/* Elevated 24° South PV Array on right roof (zero condenser shading) */}
              <line x1="412" y1="114" x2="412" y2="96" stroke="#475569" strokeWidth="1.5" />
              <line x1="498" y1="114" x2="498" y2="82" stroke="#475569" strokeWidth="1.5" />
              <line x1="404" y1="98" x2="508" y2="78" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
              <line x1="404" y1="98" x2="508" y2="78" stroke="#38BDF8" strokeWidth="1.8" strokeDasharray="8 3" />
              <text x="415" y="72" fontSize="8" fill="#0369A1" fontFamily="IBM Plex Mono, monospace">
                5.4 kWp PV (24° S)
              </text>

              {/* Compact Greywater Unit & Native Acacia in Hosh courtyard */}
              <rect x="344" y="339" width="28" height="16" rx="2" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.1" />
              <text x="347" y="349.5" fontSize="6.5" fill="#0369A1" fontFamily="IBM Plex Mono, monospace">
                GW-U
              </text>
              {/* Native Acacia tree */}
              <line x1="358" y1="325" x2="358" y2="306" stroke="#78350F" strokeWidth="2" />
              <ellipse cx="358" cy="300" rx="14" ry="7" fill="#047857" opacity="0.82" />
              <path d="M 358 339 L 358 326" stroke="#0284C7" strokeWidth="1.2" strokeDasharray="2 2" />
            </g>
          )}

          {/* STAGE 10: VE Defense Integrity Lock */}
          {s10VeLock && (
            <g
              className="cursor-pointer"
              onClick={() =>
                setInspectedLayer(
                  'Stage 10 Verified: Contractor VE envelope downgrade rejected — continuous Rockwool & thermal-break frames preserved.'
                )
              }
            >
              <rect x="242" y="238" width="38" height="14" rx="2" fill="#ECFDF5" stroke="#047857" strokeWidth="1" />
              <text x="246" y="247.5" fontSize="7" fontWeight="600" fill="#047857" fontFamily="IBM Plex Mono, monospace">
                VE LOCK
              </text>
            </g>
          )}

          {/* STAGE 11: Blower-Door Airtightness Perimeter & IR Verification */}
          {s11AirQa && (
            <g
              className="cursor-pointer"
              onClick={() =>
                setInspectedLayer(
                  'Stage 11 Verified: Blower-door 1.18 L/s·m² (≤ 1.50 limit), zero IR thermography voids & 48-hr flood test passed.'
                )
              }
            >
              <rect
                x="151"
                y="101"
                width="385"
                height="236"
                fill="none"
                stroke="#047857"
                strokeWidth="1.4"
                strokeDasharray="6 4"
                opacity="0.7"
              />
              <text x="156" y="96" fontSize="7.5" fill="#047857" fontFamily="IBM Plex Mono, monospace">
                AIRTIGHTNESS VERIFIED: 1.18 L/s·m² @ 75 Pa
              </text>
            </g>
          )}

          {/* STAGE 12: Digital Twin Commissioning & Handover */}
          {s12Handover && (
            <g
              className="cursor-pointer"
              onClick={() =>
                setInspectedLayer(
                  'Stage 12 Verified: Full HVAC TAB commissioning, bilingual Digital Twin O&M portal & Mostadam Gold handover complete.'
                )
              }
            >
              <rect x="444" y="238" width="66" height="16" rx="2" fill="#047857" />
              <text x="450" y="248.5" fontSize="7" fontWeight="600" fill="#FFFFFF" fontFamily="IBM Plex Mono, monospace">
                HANDOVER OK
              </text>
            </g>
          )}

          {/* PHYSICS OVERLAYS */}
          {/* Solar Rays */}
          {showSolar && (
            <g opacity="0.88">
              <circle cx="585" cy="44" r="14" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
              <line x1="572" y1="56" x2="538" y2="96" stroke="#D97706" strokeWidth="1.4" markerEnd="url(#arrowAmber)" />
              <line x1="568" y1="48" x2="482" y2="78" stroke="#D97706" strokeWidth="1.4" markerEnd="url(#arrowAmber)" />
              {s6Fenestration && (
                <path
                  d="M 548 168 L 537 176 L 548 184"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="1.2"
                />
              )}
              {s7Roof && (
                <path
                  d="M 465 112 L 452 98"
                  stroke="#D97706"
                  strokeWidth="1.1"
                  strokeDasharray="2 2"
                />
              )}
            </g>
          )}

          {/* Shamal Wind Vectors */}
          {showWind && (
            <g opacity="0.85">
              <path
                d="M 18 68 C 58 68, 86 78, 126 112"
                fill="none"
                stroke="#0284C7"
                strokeWidth="1.6"
                markerEnd="url(#arrowSky)"
              />
              <path
                d="M 24 88 C 68 88, 98 102, 128 148"
                fill="none"
                stroke="#0284C7"
                strokeWidth="1.3"
                strokeDasharray="4 3"
                markerEnd="url(#arrowSky)"
              />
            </g>
          )}

          {/* Thermal Flux Callout */}
          {showThermal && (
            <g>
              <rect x="16" y="346" width="218" height="22" rx="3" fill="#FFFFFF" opacity="0.92" stroke="#CBD5E1" strokeWidth="0.8" />
              <text x="24" y="360" fontSize="8.5" fontWeight="600" fill={s5WallInsul ? '#047857' : '#B45309'} fontFamily="IBM Plex Mono, monospace">
                {s5WallInsul ? 'WALL U: 0.312 W/m²·K (PASS)' : 'WALL U: ~1.05 W/m²·K (UNINSULATED)'}
              </text>

              <rect x="406" y="346" width="218" height="22" rx="3" fill="#FFFFFF" opacity="0.92" stroke="#CBD5E1" strokeWidth="0.8" />
              <text x="414" y="360" fontSize="8.5" fontWeight="600" fill={s7Roof ? '#047857' : '#B45309'} fontFamily="IBM Plex Mono, monospace">
                {s7Roof ? 'ROOF U: 0.185 W/m²·K (PASS)' : 'ROOF U: ~0.95 W/m²·K (EXPOSED)'}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Layer Inspector Caption */}
      <div className="px-5 py-3 bg-[#F8F7F4] border-b border-slate-100 flex items-start gap-2.5 text-xs text-slate-700">
        <Layers className="w-4 h-4 text-[#047857] shrink-0 mt-0.5" aria-hidden="true" />
        <span className="leading-relaxed">{activeLayerText}</span>
      </div>

      {/* 12-Stage Interactive Progress Strip */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-slate-800">12-Stage Lifecycle Roadmap</span>
          <span className="text-xs text-slate-500">Click mastered stages to review</span>
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-12 lg:grid-cols-6 gap-1.5">
          {SIMULATION_STAGES.map((stage) => {
            const done = mastered(stage.id);
            const isCurrent = stage.id === activeStageId;
            const isViewing = stage.id === viewingStageId;
            const clickable = done || isCurrent;
            const hadRework = (stageOutcomes[stage.id]?.wrongSelections.length ?? 0) > 0;

            return (
              <button
                key={stage.id}
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onSelectStage(stage.id)}
                title={`Stage ${stage.id}: ${stage.title}`}
                className={`h-9 rounded-md border text-xs font-mono font-semibold tabular-nums transition-colors flex flex-col items-center justify-center ${
                  isViewing
                    ? 'border-slate-900 bg-slate-900 text-white cursor-pointer'
                    : done
                    ? hadRework
                      ? 'border-[#B45309]/40 bg-[#B45309]/[0.06] text-[#92400e] hover:bg-[#B45309]/12 cursor-pointer'
                      : 'border-[#047857]/40 bg-[#047857]/[0.07] text-[#047857] hover:bg-[#047857]/15 cursor-pointer'
                    : isCurrent
                    ? 'border-slate-400 bg-white text-slate-900 hover:border-slate-900 cursor-pointer'
                    : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{String(stage.id).padStart(2, '0')}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
