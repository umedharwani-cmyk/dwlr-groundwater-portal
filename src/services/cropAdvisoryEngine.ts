import { CropRecommendation, DWLRStation, SeverityCategory } from '../types';
import { cropDatabase } from '../data/cropDatabase';

export interface PumpingCalculationResult {
  safeDailyHours: number;
  maxWeeklyHours: number;
  recommendedTimeSlot: string;
  riskNotice: string;
  floodWaterVolumeLiters: number;
  dripWaterVolumeLiters: number;
  waterSavedLitersPerSeason: number;
  electricityCostSavedRs: number;
  aquiferSafetyIndexPct: number;
}

export function getCropAdvisories(station: DWLRStation): {
  recommendedCrops: CropRecommendation[];
  highRiskCrops: CropRecommendation[];
} {
  const stateCrops = cropDatabase.filter((crop) => crop.suitableStates.includes(station.state));

  const recommendedCrops: CropRecommendation[] = [];
  const highRiskCrops: CropRecommendation[] = [];

  for (const crop of stateCrops) {
    if (station.status === 'over-exploited') {
      if (crop.waterRequirement === 'very_low' || crop.waterRequirement === 'low') {
        recommendedCrops.push(crop);
      } else {
        highRiskCrops.push(crop);
      }
    } else if (station.status === 'critical') {
      if (crop.waterRequirement === 'very_low' || crop.waterRequirement === 'low' || crop.category === 'pulse') {
        recommendedCrops.push(crop);
      } else if (crop.waterRequirement === 'very_high') {
        highRiskCrops.push(crop);
      } else {
        recommendedCrops.push(crop);
      }
    } else if (station.status === 'semi-critical') {
      if (crop.waterRequirement === 'very_high') {
        highRiskCrops.push(crop);
      } else {
        recommendedCrops.push(crop);
      }
    } else {
      // Safe
      recommendedCrops.push(crop);
    }
  }

  return { recommendedCrops, highRiskCrops };
}

export function calculateSafePumping(
  station: DWLRStation,
  farmAcres: number,
  pumpHp: number
): PumpingCalculationResult {
  // Base flow rate based on HP (approx 15,000 liters/hr per 5HP)
  const pumpDischargeLitersPerHr = pumpHp * 3000;

  // Maximum allowed daily abstraction factor based on severity
  let severityFactor = 1.0;
  let riskNotice = 'Water table is currently stable. Practice standard irrigation scheduling.';
  let aquiferSafetyIndexPct = 90;

  if (station.status === 'over-exploited') {
    severityFactor = 0.35; // strict rationing
    riskNotice = 'CRITICAL WARNING: Water table is dropping at ' + station.depthTrendPerYearM.toFixed(1) + 'm/yr. Pumping beyond recommended limit will lead to dry borewell & pump burnout.';
    aquiferSafetyIndexPct = 28;
  } else if (station.status === 'critical') {
    severityFactor = 0.55;
    riskNotice = 'WARNING: Aquifer is under significant stress. Restrict pumping to essential crop stages only.';
    aquiferSafetyIndexPct = 48;
  } else if (station.status === 'semi-critical') {
    severityFactor = 0.75;
    riskNotice = 'CAUTION: Water table is moderate. Use micro-irrigation to maintain sustainability.';
    aquiferSafetyIndexPct = 68;
  }

  // Base safe hours calculation
  const safeDailyHours = Math.max(1.5, Math.min(8.0, Math.round(((4.5 * severityFactor) / Math.max(1, farmAcres / 3)) * 10) / 10));
  const maxWeeklyHours = Math.round(safeDailyHours * 6 * 10) / 10;

  const recommendedTimeSlot = station.state === 'rajasthan' 
    ? '05:00 AM - 08:30 AM (Low evaporation & solar feeder hours)'
    : '06:00 AM - 09:30 AM & 05:00 PM - 07:00 PM (Optimal soil absorption)';

  // Water volume comparison for a standard 100-day season
  const floodWaterVolumeLiters = Math.round(farmAcres * 3500000); // ~3.5M liters per acre flood
  const dripWaterVolumeLiters = Math.round(floodWaterVolumeLiters * 0.45); // 55% savings
  const waterSavedLitersPerSeason = floodWaterVolumeLiters - dripWaterVolumeLiters;
  const electricityCostSavedRs = Math.round((waterSavedLitersPerSeason / pumpDischargeLitersPerHr) * 4.5 * 3.2);

  return {
    safeDailyHours,
    maxWeeklyHours,
    recommendedTimeSlot,
    riskNotice,
    floodWaterVolumeLiters,
    dripWaterVolumeLiters,
    waterSavedLitersPerSeason,
    electricityCostSavedRs,
    aquiferSafetyIndexPct
  };
}
