import React from 'react';
import { DWLRStation } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Activity, 
  AlertTriangle, 
  TrendingDown, 
  Gauge, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface CommandCenterKPIsProps {
  stations: DWLRStation[];
}

export const CommandCenterKPIs: React.FC<CommandCenterKPIsProps> = ({ stations }) => {
  const { t, activeState } = useApp();

  const totalStations = stations.length;
  const safeCount = stations.filter((s) => s.status === 'safe').length;
  const semiCriticalCount = stations.filter((s) => s.status === 'semi-critical').length;
  const criticalCount = stations.filter((s) => s.status === 'critical').length;
  const overExploitedCount = stations.filter((s) => s.status === 'over-exploited').length;

  const urgentCount = stations.filter((s) => s.urgencyPriorityRank === 1).length;

  const avgDepth = (
    stations.reduce((acc, s) => acc + s.currentDepthMgl, 0) / (totalStations || 1)
  ).toFixed(1);

  const avgDepletion = (
    stations.reduce((acc, s) => acc + s.depthTrendPerYearM, 0) / (totalStations || 1)
  ).toFixed(2);

  const safePct = Math.round((safeCount / totalStations) * 100);
  const overExploitedPct = Math.round((overExploitedCount / totalStations) * 100);

  return (
    <div className="space-y-4">
      
      {/* 4 Main Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Stations Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              {t('totalStations')}
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-white tracking-tight">{totalStations}</span>
              <span className="text-xs text-cyan-400 font-semibold">100% Online</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              {activeState === 'all' ? 'Rajasthan (10) & Tamil Nadu (10)' : `${activeState.toUpperCase()} Basin`}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Gauge className="w-5 h-5 text-cyan-400" />
          </div>
        </div>

        {/* Urgent Attention Needed (Priority 1) */}
        <div className="bg-slate-900/90 border border-rose-900/40 rounded-2xl p-4 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-rose-300 uppercase tracking-wider block">
              {t('criticalReservesCount')}
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-rose-400 tracking-tight">{urgentCount}</span>
              <span className="text-xs text-rose-400 font-semibold">Priority 1 (&lt;30d)</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              High Over-Draft & Rapid Decline
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
          </div>
        </div>

        {/* Average Water Table Depth */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              {t('avgDepth')}
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-white tracking-tight">{avgDepth}</span>
              <span className="text-xs text-slate-400 font-semibold">mbgl</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Surface to Hydrostatic Head
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        {/* Annual Depletion Velocity */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              {t('avgDepletionRate')}
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-amber-400 tracking-tight">+{avgDepletion}</span>
              <span className="text-xs text-slate-400 font-semibold">m / year</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Long-term Aquifer Hydrograph Trend
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-amber-400" />
          </div>
        </div>

      </div>

      {/* Severity Breakdown Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 shadow-md">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-300">Groundwater Categorization Distribution (CGWB Norms)</span>
          <span className="text-[11px] text-slate-400 font-mono">
            🟢 Safe: {safeCount} | 🟡 Semi-Crit: {semiCriticalCount} | 🟠 Crit: {criticalCount} | 🔴 Over-Exp: {overExploitedCount}
          </span>
        </div>

        <div className="w-full h-3 bg-slate-950 rounded-full flex overflow-hidden border border-slate-800">
          <div
            style={{ width: `${(safeCount / totalStations) * 100}%` }}
            className="bg-emerald-500 h-full"
            title={`Safe: ${safeCount} (${Math.round((safeCount / totalStations) * 100)}%)`}
          />
          <div
            style={{ width: `${(semiCriticalCount / totalStations) * 100}%` }}
            className="bg-amber-500 h-full"
            title={`Semi-Critical: ${semiCriticalCount}`}
          />
          <div
            style={{ width: `${(criticalCount / totalStations) * 100}%` }}
            className="bg-orange-500 h-full"
            title={`Critical: ${criticalCount}`}
          />
          <div
            style={{ width: `${(overExploitedCount / totalStations) * 100}%` }}
            className="bg-rose-600 h-full"
            title={`Over-Exploited: ${overExploitedCount}`}
          />
        </div>
      </div>

    </div>
  );
};
