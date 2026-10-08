import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const LiveAlertsBanner: React.FC = () => {
  const { liveAlerts, dismissAlert } = useApp();

  if (liveAlerts.length === 0) return null;

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto space-y-2">
        {liveAlerts.map((alert) => {
          const isCritical = alert.severity === 'critical';
          const isWarning = alert.severity === 'warning';

          return (
            <div
              key={alert.id}
              className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs border transition-all ${
                isCritical
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : isWarning
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <div className="flex items-center space-x-2.5 overflow-hidden">
                {isCritical ? (
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 animate-pulse" />
                ) : isWarning ? (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-blue-500 shrink-0" />
                )}
                
                <span className="font-mono font-bold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200">
                  {alert.code}
                </span>

                <span className="truncate font-medium">{alert.message}</span>
                <span className="text-[10px] text-slate-400 shrink-0">({alert.timestamp})</span>
              </div>

              <button
                onClick={() => dismissAlert(alert.id)}
                className="ml-3 p-1 rounded-lg hover:bg-black/5 transition shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
