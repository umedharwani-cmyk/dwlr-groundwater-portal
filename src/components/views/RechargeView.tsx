import React from 'react';
import { useApp } from '../../context/AppContext';
import { DWLRStation } from '../../types';
import { generateReplenishmentPlan } from '../../services/replenishmentEngine';
import { exportStationReportPDF } from '../../services/reportGenerator';
import { PolicySimulatorSandbox } from '../gov/PolicySimulatorSandbox';
import { 
  Droplets, 
  CheckCircle2, 
  FileDown, 
  Sparkles, 
  Landmark, 
  MapPin,
  Sliders
} from 'lucide-react';

interface RechargeViewProps {
  onOpenActionPlanModal: (station: DWLRStation) => void;
}

export const RechargeView: React.FC<RechargeViewProps> = ({ onOpenActionPlanModal }) => {
  const { selectedStation, stations, setSelectedStationId } = useApp();
  const plan = generateReplenishmentPlan(selectedStation);

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      
      {/* Header & Station Selector */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                AI & Hydrogeological Replenishment Engine
              </h2>
              <p className="text-xs text-slate-500">
                Actionable engineering structures & policies to restore depleted aquifers
              </p>
            </div>
          </div>
        </div>

        {/* Station Dropdown & Download PDF */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedStation.id}
            onChange={(e) => setSelectedStationId(e.target.value)}
            className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none"
          >
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.district} ({s.state === 'rajasthan' ? 'RJ' : 'TN'}) — {s.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => exportStationReportPDF(selectedStation, plan)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition shrink-0"
          >
            <FileDown className="w-4 h-4" />
            <span>Download CGWB PDF</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Annual Deficit</span>
          <span className="text-2xl font-extrabold text-rose-500 mt-1 block">
            {plan.annualDeficitMcm} MCM
          </span>
          <span className="text-[11px] text-slate-400">Groundwater overdraft volume</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Recharge Potential</span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
            +{plan.totalRechargePotentialMcm} MCM
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold">{plan.deficitOffsetPct}% Deficit Offset</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Estimated Budget</span>
          <span className="text-2xl font-extrabold text-blue-600 mt-1 block">
            ₹{plan.totalEstimatedCostLakhs} Lakhs
          </span>
          <span className="text-[11px] text-slate-400">Total engineered investment</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Safe Recovery Timeline</span>
          <span className="text-2xl font-extrabold text-amber-500 mt-1 block">
            {plan.projectedRecoveryYears} Years
          </span>
          <span className="text-[11px] text-slate-400">To reach safe baseline head</span>
        </div>

      </div>

      {/* Recommended Remediation Structures */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Tailored Engineering & Rejuvenation Structures ({selectedStation.state === 'rajasthan' ? 'Rajasthan' : 'Tamil Nadu'})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.recommendedInterventions.map((item) => (
            <div
              key={item.intervention.id}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.intervention.title}</h4>
                    {item.intervention.traditionalName && (
                      <span className="text-[11px] text-blue-700 font-semibold block mt-0.5">
                        {item.intervention.traditionalName}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {item.recommendedUnits} Units
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {item.intervention.description}
                </p>

                <div className="mt-2 space-y-1">
                  {item.intervention.keyBenefits.map((b, i) => (
                    <div key={i} className="flex items-start space-x-1.5 text-[11px] text-slate-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-200 pt-2 bg-white -mx-4 -mb-4 p-3 rounded-b-xl">
                <div>
                  <span className="text-[10px] text-slate-400 block">Annual Recharge</span>
                  <span className="font-bold text-emerald-600 text-xs">+{item.subtotalRechargeMcm} MCM/yr</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Estimated Cost</span>
                  <span className="font-bold text-slate-900 text-xs">₹{item.subtotalCostLakhs} Lakhs</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Policy Simulator Section */}
      <PolicySimulatorSandbox station={selectedStation} />

    </div>
  );
};
