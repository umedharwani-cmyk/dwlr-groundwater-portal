import { DWLRStation, SeverityCategory } from '../types';

export function calculateSeverityCategory(
  stageOfExtractionPct: number,
  depthTrendPerYearM: number,
  currentDepthMgl: number
): SeverityCategory {
  if (stageOfExtractionPct > 100 || (depthTrendPerYearM > 1.0 && currentDepthMgl > 40)) {
    return 'over-exploited';
  }
  if (stageOfExtractionPct > 90 || depthTrendPerYearM > 0.6) {
    return 'critical';
  }
  if (stageOfExtractionPct > 70 || depthTrendPerYearM > 0.3) {
    return 'semi-critical';
  }
  return 'safe';
}

export function calculateUrgencyPriorityScore(station: {
  stageOfExtractionPct: number;
  depthTrendPerYearM: number;
  currentDepthMgl: number;
  annualRainfallNormalMm: number;
  annualRainfallActualMm: number;
  salinityTdsPpm: number;
  populationDependent: number;
}): { score: number; rank: 1 | 2 | 3 } {
  // 1. Extraction factor (0-35 pts)
  const extractionFactor = Math.min(35, (station.stageOfExtractionPct / 200) * 35);

  // 2. Trend / Depletion Velocity factor (0-25 pts)
  const trendFactor = Math.min(25, (Math.max(0, station.depthTrendPerYearM) / 2.0) * 25);

  // 3. Absolute Depth Stress (0-20 pts)
  const depthFactor = Math.min(20, (station.currentDepthMgl / 100) * 20);

  // 4. Rainfall Deficit factor (0-10 pts)
  const rainfallDeficit = Math.max(0, (station.annualRainfallNormalMm - station.annualRainfallActualMm) / station.annualRainfallNormalMm);
  const rainfallFactor = Math.min(10, rainfallDeficit * 20);

  // 5. Salinity / Quality Stress (0-10 pts)
  const salinityFactor = station.salinityTdsPpm > 1500 ? 10 : station.salinityTdsPpm > 1000 ? 6 : 2;

  const rawScore = extractionFactor + trendFactor + depthFactor + rainfallFactor + salinityFactor;
  const score = Math.min(100, Math.round(rawScore * 10) / 10);

  let rank: 1 | 2 | 3 = 3;
  if (score >= 80) {
    rank = 1; // Urgent (< 30 days)
  } else if (score >= 60) {
    rank = 2; // Medium (< 90 days)
  } else {
    rank = 3; // Routine Monitoring
  }

  return { score, rank };
}

export function getSeverityBadgeStyle(category: SeverityCategory): {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  dotColor: string;
} {
  switch (category) {
    case 'over-exploited':
      return {
        label: 'Over-Exploited (Emergency)',
        bgClass: 'bg-rose-950/80',
        textClass: 'text-rose-400',
        borderClass: 'border-rose-600/50',
        dotColor: '#f43f5e'
      };
    case 'critical':
      return {
        label: 'Critical Priority',
        bgClass: 'bg-orange-950/80',
        textClass: 'text-orange-400',
        borderClass: 'border-orange-600/50',
        dotColor: '#f97316'
      };
    case 'semi-critical':
      return {
        label: 'Semi-Critical',
        bgClass: 'bg-amber-950/80',
        textClass: 'text-amber-400',
        borderClass: 'border-amber-600/50',
        dotColor: '#eab308'
      };
    case 'safe':
    default:
      return {
        label: 'Safe Aquifer',
        bgClass: 'bg-emerald-950/80',
        textClass: 'text-emerald-400',
        borderClass: 'border-emerald-600/50',
        dotColor: '#10b981'
      };
  }
}
