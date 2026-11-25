export interface CodeThresholdRow {
  parameter: string;
  sbc602Limit: string;
  units: string;
  clauseRef: string;
  engineeringNote: string;
}

export interface MaterialThermalRow {
  material: string;
  lambdaWmk: number;
  typicalThicknessMm: number;
  rValueAtTypical: number;
  application: string;
}

export interface MostadamCategoryRow {
  category: string;
  weightPct: number;
  maxPoints: number;
  keyRiyadhCreditFocus: string;
}

export interface SalmaniGuidelineRow {
  principle: string;
  requirement: string;
  climatePerformanceLink: string;
}

export const SBC_602_ZONE1_LIMITS: CodeThresholdRow[] = [
  {
    parameter: 'Exterior Opaque Wall (Mass / Cavity)',
    sbc602Limit: 'U ≤ 0.342',
    units: 'W/m²·K',
    clauseRef: 'SBC 602 Table 402.1.2 (Zone 1)',
    engineeringNote: 'Equivalent minimum total assembly R-value ≥ 2.92 m²·K/W including surface films.',
  },
  {
    parameter: 'Roof Assembly (Above Conditioned Space)',
    sbc602Limit: 'U ≤ 0.202',
    units: 'W/m²·K',
    clauseRef: 'SBC 602 Table 402.1.2 (Zone 1)',
    engineeringNote: 'Equivalent minimum total assembly R-value ≥ 4.95 m²·K/W; continuous insulation prevents slab bridging.',
  },
  {
    parameter: 'Slab-on-Grade / Exposed Floor',
    sbc602Limit: 'U ≤ 0.320',
    units: 'W/m²·K',
    clauseRef: 'SBC 602 Section 402.2.8',
    engineeringNote: 'Perimeter slab-edge thermal break (≥ 50 mm XPS) eliminates ground-coupled summer heat conduction.',
  },
  {
    parameter: 'Vertical Fenestration U-Factor',
    sbc602Limit: 'U ≤ 2.668',
    units: 'W/m²·K',
    clauseRef: 'SBC 602 Table 402.1.2',
    engineeringNote: 'Requires thermally broken aluminum frame + double low-E argon-filled IGU.',
  },
  {
    parameter: 'Solar Heat Gain Coefficient (SHGC)',
    sbc602Limit: 'SHGC ≤ 0.25',
    units: 'Dimensionless',
    clauseRef: 'SBC 602 Table 402.1.2 (Zone 1)',
    engineeringNote: 'Applies to all glazed orientations; high-SHGC clear glass fails even with low U-value.',
  },
  {
    parameter: 'Maximum Window-to-Wall Ratio (WWR)',
    sbc602Limit: 'WWR ≤ 25%',
    units: '% of gross facade',
    clauseRef: 'SBC 602 Prescriptive Envelope Cap',
    engineeringNote: 'Exceeding 25% requires full dynamic energy modeling trade-off and rarely passes in Zone 1.',
  },
  {
    parameter: 'Roof Solar Reflectance Index (SRI)',
    sbc602Limit: 'SRI ≥ 50 (Flat ≥ 78 preferred)',
    units: 'ASTM E1980',
    clauseRef: 'SBC 602 & Mostadam Cool Roof',
    engineeringNote: 'High-albedo pale limestone/reflective tiles cut roof sol-air peak from 78°C down to ~49°C.',
  },
  {
    parameter: 'Building Envelope Air Leakage',
    sbc602Limit: '≤ 1.50 (NHC QA target)',
    units: 'L/s·m² @ 75 Pa',
    clauseRef: 'SBC 602 §402.4 / NHC Spec',
    engineeringNote: 'Verified by blower-door pressurization testing; controls latent infiltration & Shamal fine dust ingress.',
  },
  {
    parameter: 'Cooling Equipment Efficiency (Split/VRF)',
    sbc602Limit: 'EER ≥ 11.0 (SASO Tier 1)',
    units: 'BTU/W·h @ T3 (46°C)',
    clauseRef: 'SBC 602 §403 / SASO 2663',
    engineeringNote: 'Must be rated at T3 desert ambient condition (46°C), not temperate T1 (35°C).',
  },
];

export const MATERIAL_THERMAL_CONDUCTIVITY: MaterialThermalRow[] = [
  {
    material: 'Reinforced Concrete (Columns/Beams/Slabs)',
    lambdaWmk: 1.75,
    typicalThicknessMm: 200,
    rValueAtTypical: 0.114,
    application: 'Structural frame — severe thermal bridge if uninsulated on exterior face',
  },
  {
    material: 'Hollow Concrete Masonry Block (200 mm)',
    lambdaWmk: 0.85,
    typicalThicknessMm: 200,
    rValueAtTypical: 0.235,
    application: 'Standard masonry infill — requires continuous insulation to meet SBC 602',
  },
  {
    material: 'Autoclaved Aerated Concrete (AAC Block)',
    lambdaWmk: 0.14,
    typicalThicknessMm: 200,
    rValueAtTypical: 1.429,
    application: 'Lightweight insulating block — note mortar joints & RC columns reduce effective assembly R',
  },
  {
    material: 'Extruded Polystyrene (XPS Rigid Board)',
    lambdaWmk: 0.03,
    typicalThicknessMm: 100,
    rValueAtTypical: 3.333,
    application: 'Inverted roof insulation & below-grade foundation thermal break (closed-cell, moisture resistant)',
  },
  {
    material: 'High-Density Stone Wool / Rockwool (ETICS)',
    lambdaWmk: 0.036,
    typicalThicknessMm: 100,
    rValueAtTypical: 2.778,
    application: 'Continuous exterior wall insulation (non-combustible A1 fire class under SBC 801)',
  },
  {
    material: 'Riyadh Limestone Cladding / Cement Plaster',
    lambdaWmk: 1.3,
    typicalThicknessMm: 30,
    rValueAtTypical: 0.023,
    application: 'Durable Salmani exterior finish & thermal mass; negligible thermal resistance alone',
  },
  {
    material: 'Interior + Exterior Surface Air Films (Rsi + Rso)',
    lambdaWmk: 0,
    typicalThicknessMm: 0,
    rValueAtTypical: 0.17,
    application: 'Standard ISO 6946 horizontal heat flow sum: Rsi (0.13) + Rso (0.04) = 0.17 m²·K/W',
  },
];

export const MOSTADAM_RATING_TIERS = [
  { rating: 'Certified', minPoints: 20, range: '20 – 34 pts', note: 'Baseline mandatory compliance' },
  { rating: 'Bronze', minPoints: 35, range: '35 – 49 pts', note: 'Entry sustainability tier' },
  { rating: 'Silver', minPoints: 50, range: '50 – 64 pts', note: 'Enhanced residential efficiency' },
  { rating: 'Gold', minPoints: 65, range: '65 – 79 pts', note: 'NHC Flagship Cluster Target' },
  { rating: 'Diamond', minPoints: 80, range: '80 – 100 pts', note: 'Net-zero ready exemplary performance' },
];

export const MOSTADAM_CATEGORIES: MostadamCategoryRow[] = [
  {
    category: 'Energy Efficiency',
    weightPct: 27,
    maxPoints: 27,
    keyRiyadhCreditFocus: 'Envelope exceeding SBC 602, T3 inverter HVAC, rooftop PV readiness, metering',
  },
  {
    category: 'Water Conservation',
    weightPct: 24,
    maxPoints: 24,
    keyRiyadhCreditFocus: 'WELS ultra-low-flow fixtures, greywater reuse, 100% native arid xeriscaping (zero turf)',
  },
  {
    category: 'Health & Comfort',
    weightPct: 14,
    maxPoints: 14,
    keyRiyadhCreditFocus: 'Thermal comfort (PMV/PPD), MERV-13 dust filtration, acoustic Majlis separation, glare-free daylight',
  },
  {
    category: 'Site Sustainability',
    weightPct: 9,
    maxPoints: 9,
    keyRiyadhCreditFocus: 'Wadi flood protection, urban heat island reduction (SRI ≥ 50), shaded pedestrian Sikka',
  },
  {
    category: 'Policies, Management & O&M',
    weightPct: 9,
    maxPoints: 9,
    keyRiyadhCreditFocus: 'Seasonal commissioning, homeowner O&M manual, digital twin / sub-meter handover',
  },
  {
    category: 'Transportation & Connectivity',
    weightPct: 7,
    maxPoints: 7,
    keyRiyadhCreditFocus: '15-minute walkable cluster, shaded Sikka connectivity, EV charger rough-in',
  },
  {
    category: 'Materials & Waste',
    weightPct: 6,
    maxPoints: 6,
    keyRiyadhCreditFocus: 'Regional Riyadh limestone, low-VOC finishes, construction waste diversion ≥ 50%',
  },
  {
    category: 'Education & Innovation',
    weightPct: 4,
    maxPoints: 4,
    keyRiyadhCreditFocus: 'Homeowner energy literacy dashboard, blower-door & IR thermography QA/QC verification',
  },
];

export const SALMANI_URBAN_GUIDELINES: SalmaniGuidelineRow[] = [
  {
    principle: 'Prevailing Shamal Wind Alignment',
    requirement: 'Align Sikka corridors and courtyard intake axes toward N–NW (315°–345°) while shielding west facades from afternoon sand-laden gusts.',
    climatePerformanceLink: 'Captures cooler nocturnal/morning breezes while minimizing afternoon radiative dust load.',
  },
  {
    principle: 'Sikka Pedestrian Shading Ratio',
    requirement: 'Maintain Height-to-Width (H/W) ratio ≥ 1.5–2.0 along neighborhood pedestrian alleys with continuous street-wall setbacks.',
    climatePerformanceLink: 'Delivers > 70% peak summer pedestrian shade, lowering ambient mean radiant temperature by 6–9°C.',
  },
  {
    principle: 'Deep-Reveal Fenestration & Mashrabiya',
    requirement: 'Recess apertures ≥ 250–300 mm inside solid stone/plaster massing; apply perforated screens (20–35% open area) on East/West/South upper levels.',
    climatePerformanceLink: 'Blocks direct low-angle solar radiation and preserves visual privacy without eliminating diffuse daylight.',
  },
  {
    principle: 'Multi-Generational Privacy Thresholds',
    requirement: 'Provide separate formal Majlis access with acoustic/visual buffer from private family living and inward-facing Hosh courtyard.',
    climatePerformanceLink: 'Enables zoned HVAC operation so formal Majlis stays uncooled when unoccupied, cutting energy by 15–20%.',
  },
  {
    principle: 'Material Palette & Urban Heat Island',
    requirement: 'Use locally quarried pale Riyadh limestone, warm sand-toned lime plaster, and matte bronze metalwork; prohibit reflective mirror curtain walls.',
    climatePerformanceLink: 'Minimizes exterior glare onto neighboring villas and reduces urban canyon heat storage.',
  },
];
