import { ReplenishmentIntervention } from '../types';

export const masterRechargeInterventions: ReplenishmentIntervention[] = [
  // --- RAJASTHAN SPECIFIC & ARID ENGINEERING ---
  {
    id: 'int-johad-khadin',
    title: 'Traditional Johad & Khadin Water Harvesting Bunds',
    category: 'engineering',
    suitableAquifer: ['Sandstone / Limestone', 'Alluvial', 'Hard Rock / Crystalline'],
    suitableStates: ['rajasthan'],
    description: 'Earthen check dams and crescent-shaped bunds across dry seasonal nallahs in arid Rajasthan to impound monsoon runoff and accelerate deep infiltration.',
    rechargeCapacityMcmPerYear: 0.35,
    estimatedCostLakhs: 8.5,
    implementationDurationMonths: 2,
    expectedWaterTableRiseMeters: 1.4,
    lifespanYears: 20,
    traditionalName: 'जोहड़ एवं खड़ीन (Johad & Khadin)',
    keyBenefits: [
      'Captures 85% of desert flash runoff',
      'Revives traditional indigenous community water governance',
      'Provides supplemental soil moisture for winter Rabi crops'
    ]
  },
  {
    id: 'int-recharge-shaft',
    title: 'Direct Aquifer Recharge Shafts with Filtration Beds',
    category: 'engineering',
    suitableAquifer: ['Sandstone / Limestone', 'Alluvial'],
    suitableStates: ['rajasthan'],
    description: 'Bored vertical shafts (100-150m deep) with graded inverted gravel/sand filtration chambers to directly bypass impermeable top clay layers into deep dry aquifers.',
    rechargeCapacityMcmPerYear: 0.65,
    estimatedCostLakhs: 14.0,
    implementationDurationMonths: 3,
    expectedWaterTableRiseMeters: 2.2,
    lifespanYears: 15,
    traditionalName: 'भूजल पुनर्भरण शाफ्ट (Recharge Shaft)',
    keyBenefits: [
      'Direct injection into deep fossil aquifers in Jodhpur & Jaisalmer',
      'Multi-layer geotextile filter prevents silt clogging and contamination',
      'High recharge velocity during short episodic cloudbursts'
    ]
  },
  {
    id: 'int-anicut-rj',
    title: 'Masonry Check Dams & Anicuts on Ephemeral Streams',
    category: 'engineering',
    suitableAquifer: ['Hard Rock / Crystalline', 'Alluvial'],
    suitableStates: ['rajasthan', 'tamil_nadu'],
    description: 'Permanent cement-masonry weir structures across 2nd & 3rd order streams in Aravalli foothills and Deccan tablelands to retard velocity and enhance percolation.',
    rechargeCapacityMcmPerYear: 0.80,
    estimatedCostLakhs: 22.0,
    implementationDurationMonths: 4,
    expectedWaterTableRiseMeters: 1.8,
    lifespanYears: 30,
    traditionalName: 'एनिकट एवं चेकडैम (Anicut)',
    keyBenefits: [
      'Recharges radius of 2.5 km surrounding agricultural tube-wells',
      'Controls riverbed sand erosion and soil scouring',
      'Serves as critical livestock drinking reservoir'
    ]
  },

  // --- TAMIL NADU SPECIFIC & CASCADE TANKS ---
  {
    id: 'int-eri-desilting',
    title: 'Cascade Tank (Eri) De-silting & Supply Channel Rejuvenation',
    category: 'rejuvenation',
    suitableAquifer: ['Hard Rock / Crystalline', 'Cauvery Delta Alluvial', 'Coastal Sedimentary'],
    suitableStates: ['tamil_nadu'],
    description: 'Desilting ancient Chola/Pandya cascade reservoir tanks (Eri systems) and clearing feeder channels to restore dead storage capacity and recharge weathered crystalline rocks.',
    rechargeCapacityMcmPerYear: 1.20,
    estimatedCostLakhs: 18.5,
    implementationDurationMonths: 3,
    expectedWaterTableRiseMeters: 2.5,
    lifespanYears: 25,
    traditionalName: 'ஏரி தூர்வாருதல் (Eri / Cascade Tank Rejuvenation)',
    keyBenefits: [
      'Increases water storage volume by over 40% per tank',
      'Nutrient-rich silt used as organic fertilizer for adjacent farmlands',
      'Restores historical interconnectivity between upstream and downstream tanks'
    ]
  },
  {
    id: 'int-oorani-recharge',
    title: 'Oorani Traditional Pond Rehabilitation & Percolation Pit',
    category: 'rejuvenation',
    suitableAquifer: ['Coastal Sedimentary', 'Hard Rock / Crystalline'],
    suitableStates: ['tamil_nadu'],
    description: 'Deepening and bund stabilization of community village ponds (Ooranis) equipped with peripheral recharge ring-wells to boost sweet-water lens recharge in coastal/saline belts.',
    rechargeCapacityMcmPerYear: 0.45,
    estimatedCostLakhs: 7.2,
    implementationDurationMonths: 2,
    expectedWaterTableRiseMeters: 1.2,
    lifespanYears: 20,
    traditionalName: 'ஊரணி புனரமைப்பு (Oorani Revival)',
    keyBenefits: [
      'Maintains fresh-water hydrostatic pressure to prevent sea-water intrusion',
      'Guarantees community drought security in Ramanathapuram & Thiruvallur',
      'Low cost, high community engagement'
    ]
  },
  {
    id: 'int-subsurface-dyke',
    title: 'Sub-surface Dykes (Underground Groundwater Dams)',
    category: 'engineering',
    suitableAquifer: ['Hard Rock / Crystalline', 'Alluvial'],
    suitableStates: ['tamil_nadu', 'rajasthan'],
    description: 'Impermeable underground clay/concrete diaphragm cutoff walls constructed across valley bottlenecks to arrest subterranean water flow and create an underground reservoir.',
    rechargeCapacityMcmPerYear: 1.85,
    estimatedCostLakhs: 45.0,
    implementationDurationMonths: 6,
    expectedWaterTableRiseMeters: 3.5,
    lifespanYears: 50,
    traditionalName: 'நிலத்தடி தடுப்பணை (Sub-surface Dyke)',
    keyBenefits: [
      'Zero evaporation loss (all water stored safely underground)',
      'No land submergence or rehabilitation required',
      'Maintains stable year-round water table for upstream farmers'
    ]
  },
  {
    id: 'int-coastal-injection-barrier',
    title: 'Coastal Salinity Barrier Injection Well Battery',
    category: 'engineering',
    suitableAquifer: ['Coastal Sedimentary'],
    suitableStates: ['tamil_nadu'],
    description: 'Pressurized treated storm-water injection well batteries installed parallel to coastline (Minjur/Chennai/Ramanathapuram) creating a freshwater hydraulic ridge against saline seawater intrusion.',
    rechargeCapacityMcmPerYear: 2.10,
    estimatedCostLakhs: 68.0,
    implementationDurationMonths: 8,
    expectedWaterTableRiseMeters: 2.8,
    lifespanYears: 30,
    traditionalName: 'உவர்நீர் தடுப்பு அமைப்பு (Coastal Salinity Barrier)',
    keyBenefits: [
      'Halts irreversible sea-water encroachment into municipal and farm aquifers',
      'Decreases groundwater TDS from >2500 ppm down to drinkable <800 ppm',
      'Protects coastal agrarian livelihoods'
    ]
  },

  // --- DEMAND MANAGEMENT & POLICY ---
  {
    id: 'int-micro-irrigation-subsidy',
    title: '100% Subsidized Drip & Micro-Irrigation Transition Program',
    category: 'demand_management',
    suitableAquifer: ['Hard Rock / Crystalline', 'Sandstone / Limestone', 'Alluvial', 'Coastal Sedimentary', 'Cauvery Delta Alluvial', 'Basaltic'],
    suitableStates: ['rajasthan', 'tamil_nadu'],
    description: 'State-sponsored fast-track distribution of automated drip and micro-sprinkler kits to convert flood-irrigated farmland to precision micro-irrigation.',
    rechargeCapacityMcmPerYear: 1.50, // Equivalent water savings
    estimatedCostLakhs: 35.0,
    implementationDurationMonths: 3,
    expectedWaterTableRiseMeters: 2.0,
    lifespanYears: 12,
    keyBenefits: [
      'Saves 45% - 60% agricultural groundwater consumption immediately',
      'Improves crop yield by 25% due to uniform root fertigation',
      'Eliminates over-pumping of agricultural feeder grids'
    ]
  },
  {
    id: 'int-pumping-smart-metering',
    title: 'Smart Agricultural Tube-Well Pumping Quotas & Power Rationing',
    category: 'policy',
    suitableAquifer: ['Sandstone / Limestone', 'Hard Rock / Crystalline', 'Alluvial'],
    suitableStates: ['rajasthan', 'tamil_nadu'],
    description: 'IoT telemetry-linked agricultural electricity distribution limiting farm pump runtime to 4-5 hours during non-peak solar hours in Over-Exploited blocks.',
    rechargeCapacityMcmPerYear: 2.80, // Offset extraction
    estimatedCostLakhs: 25.0,
    implementationDurationMonths: 2,
    expectedWaterTableRiseMeters: 3.0,
    lifespanYears: 10,
    keyBenefits: [
      'Curbs destructive continuous tube-well over-draft',
      'Coordinates with solar irrigation pump (PM-KUSUM) schedules',
      'Provides real-time tamper-proof extraction telemetry to CGWB'
    ]
  }
];
