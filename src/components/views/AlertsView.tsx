import React from 'react';
import { useApp } from '../../context/AppContext';
import { DWLRStation } from '../../types';
import { Bell, AlertTriangle, AlertCircle, CheckCircle2, Activity, FileText } from 'lucide-react';

interface AlertsViewProps {
  onOpenTelemetry: (station: DWLRStation) => void;
  onOpenActionPlan: (station: DWLRStation) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  onOpenTelemetry,
  onOpenActionPlan
}) => {
  const { liveAlerts, stations, setSelectedStationId } = useApp();

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Real-Time Groundwater Telemetry Alerts ({liveAlerts.length})
            </h2>
            <p className="text-xs text-slate-500">
              Live anomaly detection from DWLR sensors across Rajasthan & Tamil Nadu
            </p>
          </div>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 gap-3">
        {liveAlerts.map((alert) => {
          const matchedStation = stations.find((s) => s.code.includes(alert.code) || s.district === alert.district);

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                alert.severity === 'critical'
                  ? 'bg-rose-50/50 border-rose-200'
                  : alert.severity === 'warning'
                  ? 'bg-amber-50/50 border-amber-200'
                  : 'bg-emerald-50/50 border-emerald-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {alert.severity === 'critical' ? (
                    <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
                  ) : alert.severity === 'warning' ? (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {alert.code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      • {alert.stationName} ({alert.district}, {alert.state === 'rajasthan' ? 'Rajasthan' : 'Tamil Nadu'})
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium mt-1 leading-snug">
                    {alert.message}
                  </p>

                  <span className="text-[10px] text-slate-400 font-medium block mt-1">
                    Recorded {alert.timestamp}
                  </span>
                </div>
              </div>

              {matchedStation && (
                <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      setSelectedStationId(matchedStation.id);
                      onOpenTelemetry(matchedStation);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs transition flex items-center space-x-1"
                  >
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    <span>Telemetry</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedStationId(matchedStation.id);
                      onOpenActionPlan(matchedStation);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition flex items-center space-x-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Replenish Plan</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
