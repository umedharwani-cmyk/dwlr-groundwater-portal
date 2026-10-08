import React, { useState } from 'react';
import { DWLRStation } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateSafePumping } from '../../services/cropAdvisoryEngine';
import { 
  Clock, 
  Droplets, 
  SunMedium, 
  ShieldCheck 
} from 'lucide-react';

interface IrrigationSchedulerProps {
  station: DWLRStation;
}

export const IrrigationScheduler: React.FC<IrrigationSchedulerProps> = ({ station }) => {
  const { t } = useApp();
  const [farmAcres, setFarmAcres] = useState<number>(4);
  const [pumpHp, setPumpHp] = useState<number>(5);

  const result = calculateSafePumping(station, farmAcres, pumpHp);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-5">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {t('pumpingCalculatorTitle')}
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('pumpingSubtitle')}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>{t('farmSize')}</span>
              <span className="text-blue-600 font-mono font-bold">{farmAcres} Acres</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={farmAcres}
              onChange={(e) => setFarmAcres(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1 Acre (Small)</span>
              <span>10 Acres</span>
              <span>25 Acres (Large)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>{t('pumpHp')}</span>
              <span className="text-blue-600 font-mono font-bold">{pumpHp} HP Submersible</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 7.5, 10].map((hp) => (
                <button
                  key={hp}
                  onClick={() => setPumpHp(hp)}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    pumpHp === hp
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {hp} HP
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-600 font-semibold">
              <SunMedium className="w-4 h-4" />
              <span>Recommended Operational Time Slot</span>
            </div>
            <p className="text-slate-600 text-[11px]">{result.recommendedTimeSlot}</p>
          </div>

          <div className="text-xs text-slate-500 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
            {result.riskNotice}
          </div>

        </div>

        {/* Right Outputs */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="bg-gradient-to-br from-blue-50 to-sky-50/50 p-6 rounded-2xl border border-blue-100 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-blue-700 tracking-wider">
                {t('safeRunningHours')}
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  {result.safeDailyHours}
                </span>
                <span className="text-sm font-semibold text-slate-600">
                  {t('hoursPerDay')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Weekly Maximum Limit: <strong className="text-slate-800">{result.maxWeeklyHours} Hours</strong> across all borewells
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-200/60">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Aquifer Safety Index</span>
                <span className="font-bold text-blue-700">{result.aquiferSafetyIndexPct}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    result.aquiferSafetyIndexPct > 70
                      ? 'bg-emerald-500'
                      : result.aquiferSafetyIndexPct > 40
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${result.aquiferSafetyIndexPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Drip Irrigation Conversion Impact</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] text-slate-500 block">Season Water Saved</span>
                <span className="text-sm font-bold text-emerald-700">
                  {(result.waterSavedLitersPerSeason / 100000).toFixed(1)} Lakh Liters
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Electricity Bill Saved</span>
                <span className="text-sm font-bold text-emerald-700">
                  ₹{result.electricityCostSavedRs.toLocaleString()} / season
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
