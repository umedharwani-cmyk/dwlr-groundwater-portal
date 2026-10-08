import { DWLRStation, ReplenishmentActionPlan } from '../types';
import { masterRechargeInterventions } from '../data/rechargeInterventions';

export function generateReplenishmentPlan(station: DWLRStation): ReplenishmentActionPlan {
  // Estimate annual deficit in MCM based on extraction and baseline
  const annualExtractionEst = (station.agriculturalAreaHa * 0.0018) * (station.stageOfExtractionPct / 100);
  const annualRechargeEst = annualExtractionEst / (station.stageOfExtractionPct / 100);
  const annualDeficitMcm = Math.max(0.2, Math.round((annualExtractionEst - annualRechargeEst) * 100) / 100);

  // Filter interventions suitable for station's state and aquifer
  const matchingInterventions = masterRechargeInterventions.filter(
    (item) =>
      item.suitableStates.includes(station.state) &&
      (item.suitableAquifer.includes(station.aquiferType) || item.category === 'demand_management' || item.category === 'policy')
  );

  let allocatedRechargeMcm = 0;
  let totalCostLakhs = 0;
  const recommendedInterventions: ReplenishmentActionPlan['recommendedInterventions'] = [];

  for (const intervention of matchingInterventions) {
    let units = 1;
    if (intervention.category === 'engineering' || intervention.category === 'rejuvenation') {
      if (station.status === 'over-exploited') {
        units = Math.max(2, Math.min(8, Math.ceil((annualDeficitMcm * 0.4) / intervention.rechargeCapacityMcmPerYear)));
      } else if (station.status === 'critical') {
        units = Math.max(1, Math.min(4, Math.ceil((annualDeficitMcm * 0.3) / intervention.rechargeCapacityMcmPerYear)));
      } else {
        units = 1;
      }
    } else {
      units = 1; // policy / micro-irrigation program
    }

    const subtotalCost = units * intervention.estimatedCostLakhs;
    const subtotalRecharge = units * intervention.rechargeCapacityMcmPerYear;

    allocatedRechargeMcm += subtotalRecharge;
    totalCostLakhs += subtotalCost;

    recommendedInterventions.push({
      intervention,
      recommendedUnits: units,
      subtotalCostLakhs: Math.round(subtotalCost * 10) / 10,
      subtotalRechargeMcm: Math.round(subtotalRecharge * 100) / 100
    });
  }

  const deficitOffsetPct = Math.min(180, Math.round((allocatedRechargeMcm / Math.max(0.5, annualDeficitMcm)) * 100));

  // Projected recovery timeline in years
  let projectedRecoveryYears = 3;
  if (station.status === 'over-exploited') {
    projectedRecoveryYears = Math.max(2.5, Math.round((station.currentDepthMgl - station.baselineDepthMgl) / 2.2 * 10) / 10);
  } else if (station.status === 'critical') {
    projectedRecoveryYears = Math.max(1.5, Math.round((station.currentDepthMgl - station.baselineDepthMgl) / 2.0 * 10) / 10);
  } else {
    projectedRecoveryYears = 1.0;
  }

  // Policy mandates tailored to state
  const policyMandates: string[] = [];
  if (station.state === 'rajasthan') {
    policyMandates.push('Mandatory registration of all deep agricultural borewells exceeding 60m depth with State Ground Water Authority (SGWA).');
    policyMandates.push('Priority execution under Jal Jeevan Mission & Atal Bhujal Yojana for community Khadin / Johad rejuvenation.');
    policyMandates.push('Incentivize shift from wheat/flood irrigation to low-water Mustard, Moong, and Isabgol.');
    if (station.status === 'over-exploited') {
      policyMandates.push('Impose moratorium on new private commercial/industrial borewell drilling in ' + station.block + ' block.');
    }
  } else {
    policyMandates.push('State-sponsored Eri (cascade tank) desilting drive through Water Resources Department (WRD) Tamil Nadu.');
    policyMandates.push('Enforce 100% micro-irrigation (drip/sprinkler) for sugarcane and banana plantations under TN-IAMP.');
    policyMandates.push('Establish coastal sweet-water injection barrier wells to prevent sea-water intrusion in ' + station.district + '.');
    if (station.status === 'over-exploited') {
      policyMandates.push('Notify ' + station.block + ' as a Regulated Groundwater Extraction Zone with night-time solar agricultural power scheduling.');
    }
  }

  return {
    stationId: station.id,
    stationName: station.name,
    district: station.district,
    state: station.state,
    currentCategory: station.status,
    urgencyScore: station.urgencyPriorityScore,
    urgencyPriorityRank: station.urgencyPriorityRank,
    annualDeficitMcm: Math.round(annualDeficitMcm * 100) / 100,
    recommendedInterventions,
    totalEstimatedCostLakhs: Math.round(totalCostLakhs * 10) / 10,
    totalRechargePotentialMcm: Math.round(allocatedRechargeMcm * 100) / 100,
    deficitOffsetPct,
    projectedRecoveryYears,
    policyMandates
  };
}
