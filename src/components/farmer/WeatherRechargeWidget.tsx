import React from 'react';
import { DWLRStation } from '../../types';
import { CloudRain, CheckCircle2 } from 'lucide-react';

interface WeatherRechargeWidgetProps {
  station: DWLRStation;
}

export const WeatherRechargeWidget: React.FC<WeatherRechargeWidgetProps> = ({ station }) => {
  const rainfallDeficitPct = Math.round(
    ((station.annualRainfallNormalMm - station.annualRainfallActualMm) / station.annualRainfallNormalMm) * 100
  );

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <CloudRain className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Catchment Rainfall & Monsoon Recharge Advisory
          </h3>
        </div>

        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
          IMD Hydro-Met Telemetry
        </span>
      </div>

      {/* Rainfall Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-medium block">Normal Annual Rainfall</span>
          <span className="text-xl font-extrabold text-slate-900 mt-1 block">
            {station.annualRainfallNormalMm} mm
          </span>
          <span className="text-[10px] text-slate-400">Long-term 30-yr baseline</span>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-medium block">Actual Recorded Rainfall</span>
          <span className="text-xl font-extrabold text-blue-600 mt-1 block">
            {station.annualRainfallActualMm} mm
          </span>
          <span className="text-[10px] text-slate-400">Current hydrological cycle</span>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-medium block">Catchment Rainfall Status</span>
          <div className="flex items-center space-x-1.5 mt-1">
            <span className={`text-xl font-extrabold ${rainfallDeficitPct > 15 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {rainfallDeficitPct > 0 ? `-${rainfallDeficitPct}% Deficit` : `+${Math.abs(rainfallDeficitPct)}% Surplus`}
            </span>
          </div>
          <span className="text-[10px] text-slate-400">
            {rainfallDeficitPct > 15 ? 'Subdued Aquifer Inflow' : 'Normal Aquifer Inflow'}
          </span>
        </div>
      </div>

      {/* Action Checklist */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
        <h4 className="text-xs font-bold text-slate-800">Recommended Farm Water Conservation Actions:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Construct farm pond (Khet Talai) or rooftop filter pit to trap monsoon runoff.</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Apply organic mulch over soil to reduce evaporative moisture loss by 35%.</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Install check-valves and air release vents to protect borewell casing.</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Use tensiometers / soil moisture sensors before turning on irrigation pumps.</span>
          </div>
        </div>
      </div>

    </div>
  );
};
