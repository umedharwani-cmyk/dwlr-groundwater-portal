import React, { useState } from 'react';
import { DWLRStation, PolicySimulationState } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Sliders, 
  RotateCcw, 
  Sparkles, 
  TrendingUp, 
  Droplets 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

interface PolicySimulatorSandboxProps {
  station: DWLRStation;
}

export const PolicySimulatorSandbox: React.FC<PolicySimulatorSandboxProps> = ({ station }) => {
  const { t } = useApp();

  const [policy, setPolicy] = useState<PolicySimulationState>({
    rainwaterHarvestingIncreasePct: 35,
    microIrrigationConversionPct: 40,
    artificialRechargeStructuresCount: 12,
    groundwaterExtractionCapReductionPct: 20,
    monsoonRainfallAnomalyPct: 0
  });

  const handleReset = () => {
    setPolicy({
      rainwaterHarvestingIncreasePct: 0,
      microIrrigationConversionPct: 0,
      artificialRechargeStructuresCount: 0,
      groundwaterExtractionCapReductionPct: 0,
      monsoonRainfallAnomalyPct: 0
    });
  };

  const currentDepth = station.currentDepthMgl;
  const currentTrend = station.depthTrendPerYearM;

  const rwhBonus = (policy.rainwaterHarvestingIncreasePct / 100) * 0.45;
  const microIrrigationBonus = (policy.microIrrigationConversionPct / 100) * 0.85;
  const rechargeStructuresBonus = (policy.artificialRechargeStructuresCount / 10) * 0.55;
  const capBonus = (policy.groundwaterExtractionCapReductionPct / 100) * 0.75;
  const monsoonBonus = (policy.monsoonRainfallAnomalyPct / 100) * 0.6;

  const totalAnnualRemediationDelta = rwhBonus + microIrrigationBonus + rechargeStructuresBonus + capBonus + monsoonBonus;
  const netAnnualChange = currentTrend - totalAnnualRemediationDelta;

  const years = [2026, 2027, 2028, 2029, 2030, 2031];

  const projectionData = years.map((year, idx) => {
    const baselineDepth = currentDepth + (currentTrend * idx);
    const simulatedDepth = Math.max(
      station.baselineDepthMgl * 0.85,
      currentDepth + (netAnnualChange * idx)
    );

    return {
      year: year.toString(),
      'Current Trajectory (No Action)': Math.round(baselineDepth * 10) / 10,
      'Projected with Interventions': Math.round(simulatedDepth * 10) / 10,
      'Safe Baseline Target': Math.round(station.baselineDepthMgl * 10) / 10
    };
  });

  const netWaterGainedM = (
    projectionData[projectionData.length - 1]['Current Trajectory (No Action)'] -
    projectionData[projectionData.length - 1]['Projected with Interventions']
  ).toFixed(1);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t('whatIfTitle')}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulate policy interventions on {station.name} ({station.district}, {station.state === 'rajasthan' ? 'Rajasthan' : 'Tamil Nadu'})
          </p>
        </div>

        <button
          onClick={handleReset}
          className="self-start sm:self-auto flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sliders</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sliders Panel */}
        <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>{t('rainwaterHarvesting')}</span>
              <span className="text-blue-600 font-mono font-bold">+{policy.rainwaterHarvestingIncreasePct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={policy.rainwaterHarvestingIncreasePct}
              onChange={(e) => setPolicy({ ...policy, rainwaterHarvestingIncreasePct: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>{t('microIrrigation')}</span>
              <span className="text-emerald-600 font-mono font-bold">+{policy.microIrrigationConversionPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              value={policy.microIrrigationConversionPct}
              onChange={(e) => setPolicy({ ...policy, microIrrigationConversionPct: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>{t('rechargeStructures')}</span>
              <span className="text-amber-600 font-mono font-bold">{policy.artificialRechargeStructuresCount} Units</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={policy.artificialRechargeStructuresCount}
              onChange={(e) => setPolicy({ ...policy, artificialRechargeStructuresCount: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>{t('pumpingRestrictions')}</span>
              <span className="text-rose-600 font-mono font-bold">-{policy.groundwaterExtractionCapReductionPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={policy.groundwaterExtractionCapReductionPct}
              onChange={(e) => setPolicy({ ...policy, groundwaterExtractionCapReductionPct: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>{t('rainfallAnomaly')}</span>
              <span className="text-sky-600 font-mono font-bold">{policy.monsoonRainfallAnomalyPct > 0 ? `+${policy.monsoonRainfallAnomalyPct}` : policy.monsoonRainfallAnomalyPct}%</span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              value={policy.monsoonRainfallAnomalyPct}
              onChange={(e) => setPolicy({ ...policy, monsoonRainfallAnomalyPct: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
          </div>

        </div>

        {/* Projection Chart */}
        <div className="lg:col-span-7 space-y-3 flex flex-col justify-between">
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                5-Year Aquifer Response Simulation (mbgl)
              </h4>
              <span className="text-[10px] text-slate-400">Lower depth = better water availability</span>
            </div>

            <div className="h-[240px] w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={['auto', 'auto']} reversed />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                  <Line
                    type="monotone"
                    dataKey="Current Trajectory (No Action)"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Projected with Interventions"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Safe Baseline Target"
                    stroke="#0284c7"
                    strokeWidth={1.5}
                    strokeDasharray="2 2"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Outcome Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
              <span className="text-[10px] text-slate-500 uppercase font-medium block">Net Water Elevation Gain</span>
              <span className="text-lg font-extrabold text-emerald-700 mt-0.5 block">
                +{netWaterGainedM} Meters Saved
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">By 2031 vs Unchecked Depletion</span>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl">
              <span className="text-[10px] text-slate-500 uppercase font-medium block">Annual Aquifer Balance</span>
              <span className={`text-lg font-extrabold mt-0.5 block ${netAnnualChange <= 0 ? 'text-blue-700' : 'text-amber-600'}`}>
                {netAnnualChange <= 0 ? `${Math.abs(netAnnualChange).toFixed(2)} m/yr Recharge` : `-${netAnnualChange.toFixed(2)} m/yr Deficit`}
              </span>
              <span className="text-[10px] text-slate-500">
                {netAnnualChange <= 0 ? 'Surplus Inflow Restored' : 'Depletion Slowed'}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
