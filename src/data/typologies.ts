import { ResidentialTypology } from '../types/simulation';

export const RESIDENTIAL_TYPOLOGIES: ResidentialTypology[] = [
  {
    id: 'al_fursan_townhouse',
    name: 'Najdi Courtyard Townhouse — Al Fursan',
    district: 'Al Fursan Suburb, North-East Riyadh',
    subtitle: 'Attached 2-party-wall courtyard townhouse along a shaded Sikka spine',
    plotAreaM2: 250,
    gfaM2: 310,
    exposedFacades: 2,
    baselineCapExSar: 1380000,
    baselineCoolingKwhM2: 162,
    baselineMostadamScore: 22,
    baselineCompliancePct: 34,
    baselineScheduleWeeks: 52,
    targetMostadam: 'Mostadam Gold (≥ 65 pts)',
    imagePath: '/src/assets/images/al_fursan_townhouse_1795635551603.jpg',
    imageAlt: 'Contemporary Najdi courtyard townhouse cluster in Riyadh Al Fursan with pale limestone cladding and shaded pedestrian sikka',
    architecturalContext:
      'High-density NHC masterplan typology maximizing mutual self-shading through narrow party-wall lots, internal Hosh microclimate courtyards, and continuous Salmani street-wall edges along 15-minute pedestrian corridors.',
  },
  {
    id: 'khuzam_salmani_villa',
    name: 'Salmani Semi-Detached Villa — Khuzam',
    district: 'Khuzam Destination, North Riyadh',
    subtitle: 'Duplex semi-detached villa with 3 exposed facades and deep-reveal shading',
    plotAreaM2: 320,
    gfaM2: 385,
    exposedFacades: 3,
    baselineCapExSar: 1720000,
    baselineCoolingKwhM2: 174,
    baselineMostadamScore: 20,
    baselineCompliancePct: 32,
    baselineScheduleWeeks: 58,
    targetMostadam: 'Mostadam Gold (≥ 65 pts)',
    imagePath: '/src/assets/images/khuzam_salmani_villa_1795635550054.jpg',
    imageAlt: 'Contemporary Salmani semi-detached residential villa in Khuzam Riyadh with layered sandstone planes and recessed perforated screens',
    architecturalContext:
      'Flagship NHC multi-generational semi-detached residence with greater envelope exposure requiring rigorous SBC 602 Zone 1 continuous insulation, disciplined east/west fenestration ratios, and dust-resilient HVAC filtration.',
  },
];

export function getTypologyById(id: string): ResidentialTypology {
  return RESIDENTIAL_TYPOLOGIES.find((t) => t.id === id) ?? RESIDENTIAL_TYPOLOGIES[0];
}
