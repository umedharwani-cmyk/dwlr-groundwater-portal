import React from 'react';
import { DWLRStation } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  TrendingDown, 
  TrendingUp, 
  Gauge, 
  Activity, 
  Zap, 
  AlertTriangle 
} from 'lucide-react';
import { getSeverityBadgeStyle } from '../../services/severityEngine';

interface WellVisualizerProps {
  station: DWLRStation;
}

export const WellVisualizer: React.FC<WellVisualizerProps> = ({ station }) => {
  const { t } = useApp();
  const badgeStyle = getSeverityBadgeStyle(station.status);

  const maxDepthM = station.depthCapacityM || 120;
  const currentDepth = station.currentDepthMgl;
  const baselineDepth = station.baselineDepthMgl;

  const waterTopY = Math.min(260, Math.max(40, (currentDepth / maxDepthM) * 260));
  const baselineY = Math.min(260, Math.max(40, (baselineDepth / maxDepthM) * 260));
  const waterHeight = 300 - waterTopY;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Gauge className="w-4 h-4 text-blue-600" />
            <span>Digital Water Level Recorder (DWLR) Live Well Meter</span>
          </h3>
          <p className="text-xs text-slate-500">
            Real-time subsurface hydrostatic pressure & depth telemetry
          </p>
        </div>

        <div className="flex items-center space-x-1.5 text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sensor Online</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* SVG Well Cross-Section */}
        <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-4 border border-slate-200 flex justify-center relative overflow-hidden">
          <svg viewBox="0 0 320 300" className="w-full max-w-[290px] h-[260px]">
            {/* Ground surface */}
            <rect x="0" y="0" width="320" height="24" fill="#e2e8f0" />
            <path d="M0 24 Q 40 20, 80 24 T 160 24 T 240 24 T 320 24" stroke="#cbd5e1" strokeWidth="2" fill="none" />
            <text x="10" y="16" fill="#475569" fontSize="10" fontWeight="bold">GROUND SURFACE (0.0 m bgl)</text>

            {/* Geological Strata */}
            <rect x="10" y="24" width="70" height="90" fill="#cbd5e1" opacity="0.4" />
            <rect x="240" y="24" width="70" height="90" fill="#cbd5e1" opacity="0.4" />
            <text x="15" y="60" fill="#64748b" fontSize="8">Top Soil / Sand</text>

            <rect x="10" y="114" width="70" height="186" fill="#94a3b8" opacity="0.3" />
            <rect x="240" y="114" width="70" height="186" fill="#94a3b8" opacity="0.3" />
            <text x="15" y="180" fill="#64748b" fontSize="8">{station.aquiferType}</text>

            {/* Well Casing Tube */}
            <rect x="90" y="20" width="140" height="270" rx="6" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />

            {/* Water column inside well */}
            <rect 
              x="92" 
              y={waterTopY} 
              width="136" 
              height={waterHeight} 
              fill="url(#waterGradientLight)" 
              opacity="0.9"
            />

            {/* Water Surface Line */}
            <line x1="92" y1={waterTopY} x2="228" y2={waterTopY} stroke="#0284c7" strokeWidth="3" strokeDasharray="4 2" />

            {/* Baseline Marker */}
            <line x1="75" y1={baselineY} x2="245" y2={baselineY} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="248" y={baselineY + 3} fill="#d97706" fontSize="8" fontWeight="bold">10-Yr Mean</text>

            {/* Submersible Pump */}
            <rect x="156" y="20" width="8" height={waterTopY + 35} fill="#64748b" />
            <rect x="148" y={waterTopY + 35} width="24" height="30" rx="3" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1.5" />
            <circle cx="160" cy={waterTopY + 50} r="4" fill="#ffffff" />

            {/* Depth Tag */}
            <g transform={`translate(95, ${Math.max(35, waterTopY - 25)})`}>
              <rect width="130" height="22" rx="4" fill="#ffffff" stroke={badgeStyle.dotColor} strokeWidth="1.5" />
              <text x="65" y="15" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="bold">
                {currentDepth.toFixed(2)} m bgl
              </text>
            </g>

            <defs>
              <linearGradient id="waterGradientLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute bottom-2 left-3 text-[10px] text-slate-500 font-mono">
            Well Capacity: {station.depthCapacityM}m
          </div>
        </div>

        {/* Right: Key Telemetry Statistics */}
        <div className="lg:col-span-6 space-y-3.5">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('currentDepth')}
              </span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {currentDepth.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  meters below ground (mbgl)
                </span>
              </div>
            </div>

            <div className={`text-right px-3 py-1.5 rounded-xl border ${badgeStyle.bgClass} ${badgeStyle.borderClass}`}>
              <div className={`text-xs font-bold ${badgeStyle.textClass}`}>
                {badgeStyle.label}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Baseline: {baselineDepth.toFixed(1)}m
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 text-[10px] font-medium">
                <span>Annual Trend</span>
                {station.depthTrendPerYearM > 0 ? (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                )}
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1">
                +{station.depthTrendPerYearM.toFixed(2)} m/yr
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5">
                {station.depthTrendPerYearM > 0.5 ? 'Rapid Decline' : 'Moderate'}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 text-[10px] font-medium">
                <span>Water Salinity</span>
                <Activity className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {station.salinityTdsPpm} ppm
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5">
                {station.salinityTdsPpm > 1500 ? 'Saline' : 'Sweet / Irrigation'}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 text-[10px] font-medium">
                <span>DWLR Health</span>
                <Zap className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-sm font-bold text-emerald-600 mt-1">
                {station.lastTelemetry.batteryPct}% Solar
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5">
                Signal: {station.lastTelemetry.signalDbm} dBm
              </p>
            </div>
          </div>

          {station.status === 'over-exploited' && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800">
                <span className="font-bold">Aquifer Depletion Alert:</span> Water table in {station.district} is severely depleted. Switch to low-water crops (Bajra/Mustard/Pulses) immediately.
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
