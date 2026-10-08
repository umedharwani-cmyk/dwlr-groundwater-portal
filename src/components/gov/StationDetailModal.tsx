import React from 'react';
import { DWLRStation } from '../../types';
import { 
  X, 
  Activity, 
  TrendingDown, 
  Droplets, 
  Zap, 
  MapPin, 
  Calendar, 
  CloudRain 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import { getSeverityBadgeStyle } from '../../services/severityEngine';

interface StationDetailModalProps {
  station: DWLRStation | null;
  onClose: () => void;
  onOpenActionPlan: (station: DWLRStation) => void;
}

export const StationDetailModal: React.FC<StationDetailModalProps> = ({
  station,
  onClose,
  onOpenActionPlan
}) => {
  if (!station) return null;

  const badge = getSeverityBadgeStyle(station.status);

  const chartData = station.historicalData.map((d) => ({
    year: d.year.toString(),
    'Pre-Monsoon Depth (mbgl)': d.preMonsoonDepth,
    'Post-Monsoon Depth (mbgl)': d.postMonsoonDepth,
    'Annual Extraction (MCM)': d.extractionMcm,
    'Annual Recharge (MCM)': d.rechargeMcm,
    'Rainfall (mm)': d.annualRainfallMm
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">{station.name}</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
                  {station.code}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badge.bgClass} ${badge.textClass}`}>
                  {badge.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {station.village}, {station.block} Block, {station.district} ({station.state === 'rajasthan' ? 'Rajasthan' : 'Tamil Nadu'}) • Aquifer: {station.aquiferType}
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
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block uppercase font-medium">Live Water Depth</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                {station.currentDepthMgl.toFixed(2)} m
              </span>
              <span className="text-[10px] text-slate-400">Below ground level</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block uppercase font-medium">Annual Depletion</span>
              <span className="text-2xl font-extrabold text-rose-500 mt-1 block">
                +{station.depthTrendPerYearM.toFixed(2)} m/yr
              </span>
              <span className="text-[10px] text-slate-400">Rate of decline</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block uppercase font-medium">Extraction Stage</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
                {station.stageOfExtractionPct.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400">SOE Rate</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block uppercase font-medium">Salinity (TDS)</span>
              <span className="text-2xl font-extrabold text-blue-600 mt-1 block">
                {station.salinityTdsPpm} ppm
              </span>
              <span className="text-[10px] text-slate-400">Total dissolved solids</span>
            </div>
          </div>

          {/* Hydrograph Chart */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                10-Year Groundwater Hydrograph (Pre-Monsoon vs Post-Monsoon)
              </h4>
              <span className="text-[11px] text-slate-400">Higher depth = deeper water table</span>
            </div>

            <div className="h-[220px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPreLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorPostLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Area
                    type="monotone"
                    dataKey="Pre-Monsoon Depth (mbgl)"
                    stroke="#f43f5e"
                    fillOpacity={1}
                    fill="url(#colorPreLight)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="Post-Monsoon Depth (mbgl)"
                    stroke="#2563eb"
                    fillOpacity={1}
                    fill="url(#colorPostLight)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Extraction vs Recharge Balance */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Extraction vs Natural Recharge Balance (MCM)
            </h4>

            <div className="h-[200px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Bar dataKey="Annual Extraction (MCM)" fill="#f97316" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Annual Recharge (MCM)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-xs text-slate-500">
            Station Status: <strong className="text-slate-800">{badge.label}</strong> • Urgency Score: <strong className="text-rose-600">{station.urgencyPriorityScore}/100</strong>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenActionPlan(station);
              }}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <Droplets className="w-4 h-4" />
              <span>Generate Replenishment Plan</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
