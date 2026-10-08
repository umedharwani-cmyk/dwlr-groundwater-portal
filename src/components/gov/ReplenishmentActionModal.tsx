import React from 'react';
import { DWLRStation } from '../../types';
import { generateReplenishmentPlan } from '../../services/replenishmentEngine';
import { exportStationReportPDF } from '../../services/reportGenerator';
import { 
  X, 
  Droplets, 
  CheckCircle2, 
  FileDown, 
  Sparkles, 
  Landmark 
} from 'lucide-react';
import { getSeverityBadgeStyle } from '../../services/severityEngine';

interface ReplenishmentActionModalProps {
  station: DWLRStation | null;
  onClose: () => void;
}

export const ReplenishmentActionModal: React.FC<ReplenishmentActionModalProps> = ({
  station,
  onClose
}) => {
  if (!station) return null;

  const plan = generateReplenishmentPlan(station);
  const badge = getSeverityBadgeStyle(station.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">
                  Aquifer Replenishment & Restoration Action Plan
                </h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                  {station.code}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Zone: {station.district} ({station.state === 'rajasthan' ? 'Rajasthan' : 'Tamil Nadu'}) • Aquifer: {station.aquiferType}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-500 uppercase font-medium block">Annual Groundwater Deficit</span>
              <span className="text-2xl font-extrabold text-rose-500 mt-1 block">
                {plan.annualDeficitMcm} MCM
              </span>
              <span className="text-[10px] text-slate-400">Million Cubic Meters / Year</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-500 uppercase font-medium block">Total Recharge Potential</span>
              <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
                {plan.totalRechargePotentialMcm} MCM
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">
                {plan.deficitOffsetPct}% Deficit Offset
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-500 uppercase font-medium block">Total Estimated Investment</span>
              <span className="text-2xl font-extrabold text-blue-600 mt-1 block">
                ₹{plan.totalEstimatedCostLakhs} Lakhs
              </span>
              <span className="text-[10px] text-slate-400">State / Center Sponsored</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-500 uppercase font-medium block">Projected Safe Recovery</span>
              <span className="text-2xl font-extrabold text-amber-500 mt-1 block">
                {plan.projectedRecoveryYears} Years
              </span>
              <span className="text-[10px] text-slate-400">To Reach Safe Zone</span>
            </div>
          </div>

          {/* Remediation Structures */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. Recommended Hydrogeological & Recharge Structures
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {plan.recommendedInterventions.map((item) => (
                <div
                  key={item.intervention.id}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">
                          {item.intervention.title}
                        </h5>
                        {item.intervention.traditionalName && (
                          <span className="text-[11px] text-blue-700 font-semibold mt-0.5 block">
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

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-200 pt-2 bg-white -mx-4 -mb-4 p-3 rounded-b-2xl">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Annual Recharge</span>
                      <span className="font-bold text-emerald-600 text-xs">
                        +{item.subtotalRechargeMcm} MCM/yr
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Estimated Budget</span>
                      <span className="font-bold text-slate-900 text-xs">
                        ₹{item.subtotalCostLakhs} Lakhs
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mandates */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center space-x-2">
              <Landmark className="w-4 h-4 text-slate-700" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Regulatory Directives & Demand Management Policies
              </h4>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700">
              {plan.policyMandates.map((mandate, idx) => (
                <div key={idx} className="flex items-start space-x-2 bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="font-mono font-bold text-blue-600 shrink-0">[{idx + 1}]</span>
                  <span>{mandate}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-xs text-slate-500">
            Compliant with Central Ground Water Board (CGWB) norms.
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Close
            </button>
            <button
              onClick={() => exportStationReportPDF(station, plan)}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Official CGWB PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
