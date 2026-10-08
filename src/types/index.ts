export type UserRole = 'farmer' | 'government';
export type StateSelection = 'all' | 'rajasthan' | 'tamil_nadu';
export type Language = 'en' | 'hi' | 'ta';

export interface AuthUser {
  role: UserRole;
  name: string;
  phone?: string;
  employeeId?: string;
  department?: string;
  state?: 'rajasthan' | 'tamil_nadu';
  district?: string;
}

export type SeverityCategory = 'safe' | 'semi-critical' | 'critical' | 'over-exploited';

export type AquiferType = 
  | 'Alluvial' 
  | 'Hard Rock / Crystalline' 
  | 'Basaltic' 
  | 'Sandstone / Limestone' 
  | 'Coastal Sedimentary'
  | 'Cauvery Delta Alluvial';

export interface TelemetryReading {
  timestamp: string;
  depthMgl: number; // meters below ground level (higher number = deeper water table)
  temperatureC: number;
  batteryPct: number;
  tdsPpm: number; // Total Dissolved Solids / Salinity
  signalDbm: number;
}

export interface HistoricalDataPoint {
  year: number;
  preMonsoonDepth: number; // May/June
  postMonsoonDepth: number; // Oct/Nov
  annualRainfallMm: number;
  extractionMcm: number; // Million Cubic Meters
  rechargeMcm: number;
}

export interface DWLRStation {
  id: string;
  code: string;
  name: string;
  village: string;
  block: string;
  district: string;
  state: 'rajasthan' | 'tamil_nadu';
  lat: number;
  lng: number;
  altitudeM: number;
  aquiferType: AquiferType;
  installedDate: string;
  depthCapacityM: number;
  currentDepthMgl: number; // Live depth
  baselineDepthMgl: number; // 10-year mean
  depthTrendPerYearM: number; // positive = water table dropping (declining)
  stageOfExtractionPct: number; // SOE % (>100% is Over-Exploited)
  annualRainfallNormalMm: number;
  annualRainfallActualMm: number;
  salinityTdsPpm: number;
  status: SeverityCategory;
  urgencyPriorityScore: number; // 0 to 100
  urgencyPriorityRank: 1 | 2 | 3; // 1: Urgent (<30d), 2: Medium (<90d), 3: Monitoring
  populationDependent: number;
  agriculturalAreaHa: number;
  lastTelemetry: TelemetryReading;
  historicalData: HistoricalDataPoint[];
}

export interface CropRecommendation {
  id: string;
  name: {
    en: string;
    hi: string;
    ta: string;
  };
  category: 'cereal' | 'pulse' | 'oilseed' | 'cash_crop' | 'horticulture' | 'millet';
  waterRequirement: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'; // e.g. <300mm, 300-500, 500-800, 800-1200, >1200mm
  waterRequirementMm: number;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial';
  suitableStates: ('rajasthan' | 'tamil_nadu')[];
  suitableSeverity: SeverityCategory[];
  durationDays: number;
  irrigationMethod: string;
  expectedYieldPerAcre: string;
  estimatedNetProfitPerAcre: string;
  suitableSoil: string[];
  advisoryNote: {
    en: string;
    hi: string;
    ta: string;
  };
  riskLevel: 'safe' | 'moderate' | 'high_risk';
}

export interface ReplenishmentIntervention {
  id: string;
  title: string;
  category: 'engineering' | 'rejuvenation' | 'policy' | 'demand_management';
  suitableAquifer: AquiferType[];
  suitableStates: ('rajasthan' | 'tamil_nadu')[];
  description: string;
  rechargeCapacityMcmPerYear: number;
  estimatedCostLakhs: number;
  implementationDurationMonths: number;
  expectedWaterTableRiseMeters: number;
  lifespanYears: number;
  keyBenefits: string[];
  traditionalName?: string; // e.g. "Johad" / "Khadin" for RJ, "Eri" / "Oorani" for TN
}

export interface ReplenishmentActionPlan {
  stationId: string;
  stationName: string;
  district: string;
  state: 'rajasthan' | 'tamil_nadu';
  currentCategory: SeverityCategory;
  urgencyScore: number;
  urgencyPriorityRank: 1 | 2 | 3;
  annualDeficitMcm: number;
  recommendedInterventions: {
    intervention: ReplenishmentIntervention;
    recommendedUnits: number;
    subtotalCostLakhs: number;
    subtotalRechargeMcm: number;
  }[];
  totalEstimatedCostLakhs: number;
  totalRechargePotentialMcm: number;
  deficitOffsetPct: number;
  projectedRecoveryYears: number;
  policyMandates: string[];
}

export interface PolicySimulationState {
  rainwaterHarvestingIncreasePct: number; // 0-100%
  microIrrigationConversionPct: number; // 0-100%
  artificialRechargeStructuresCount: number; // 0-50
  groundwaterExtractionCapReductionPct: number; // 0-50%
  monsoonRainfallAnomalyPct: number; // -40% to +40%
}
