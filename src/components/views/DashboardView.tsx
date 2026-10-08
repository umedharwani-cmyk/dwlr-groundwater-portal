import React from 'react';
import { useApp } from '../../context/AppContext';
import { DWLRStation } from '../../types';
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
import { ArrowUp, Activity, ExternalLink, MapPin } from 'lucide-react';

interface DashboardViewProps {
  onOpenTelemetry: (station: DWLRStation) => void;
  onOpenActionPlan: (station: DWLRStation) => void;
}

// Hydrograph trend data for 2024 vs 2023 (Mean depth in mbgl)
const nationalTrendData = [
  { month: 'Jan', '2024': -4.2, '2023': -3.8 },
  { month: 'Feb', '2024': -4.8, '2023': -4.3 },
  { month: 'Mar', '2024': -5.2, '2023': -4.7 },
  { month: 'Apr', '2024': -5.6, '2023': -5.1 },
  { month: 'May', '2024': -5.9, '2023': -5.2 }, // Peak summer depletion
  { month: 'Jun', '2024': -5.4, '2023': -4.8 },
  { month: 'Jul', '2024': -4.6, '2023': -4.3 },
  { month: 'Aug', '2024': -3.9, '2023': -3.9 },
  { month: 'Sep', '2024': -3.6, '2023': -3.7 }, // Peak monsoon recharge
  { month: 'Oct', '2024': -4.0, '2023': -3.9 },
  { month: 'Nov', '2024': -4.3, '2023': -4.1 },
  { month: 'Dec', '2024': -4.6, '2023': -4.2 }
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenTelemetry,
  onOpenActionPlan
}) => {
  const { stations, liveAlerts, setActiveTab, setSelectedStationId } = useApp();

  const criticalCount = stations.filter((s) => s.status === 'over-exploited' || s.status === 'critical').length;
  const safeCount = stations.filter((s) => s.status === 'safe').length;
  const semiCriticalCount = stations.filter((s) => s.status === 'semi-critical').length;

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      
      {/* 4 Top KPI Metric Cards (Matching Screenshot Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Wells monitored */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 tracking-tight">
            Wells monitored
          </span>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              4,812
            </span>
            <span className="text-xs text-slate-400 block mt-1">
              Rajasthan & Tamil Nadu (20 DWLR Active)
            </span>
          </div>
        </div>

        {/* Card 2: Critical alerts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 tracking-tight">
            Critical alerts
          </span>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-rose-500 tracking-tight">
              23
            </span>
            <div className="flex items-center space-x-1 text-xs text-slate-500 mt-1">
              <span className="text-rose-500 font-semibold flex items-center">
                <ArrowUp className="w-3 h-3 inline mr-0.5" /> 4
              </span>
              <span>vs yesterday</span>
            </div>
          </div>
        </div>

        {/* Card 3: Avg recharge (mm) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 tracking-tight">
            Avg recharge (mm)
          </span>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
              142.6
            </span>
            <span className="text-xs text-slate-400 block mt-1">
              monsoon 2024 / 2025
            </span>
          </div>
        </div>

        {/* Card 4: Data freshness */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 tracking-tight">
            Data freshness
          </span>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">
              Live
            </span>
            <span className="text-xs text-slate-400 block mt-1">
              4,791 reporting in real-time
            </span>
          </div>
        </div>

      </div>

      {/* Main Grid: Left Chart (2/3) + Right Recent Alerts (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Card: National / State water level trend chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                National water level trend
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Mean depth mbgl — 2024 vs 2023
              </p>
            </div>

            {/* Custom Legend */}
            <div className="flex items-center space-x-4 text-xs font-medium">
              <div className="flex items-center space-x-1.5">
                <span className="w-4 h-0.5 bg-blue-600 rounded-full" />
                <span className="text-slate-700">2024</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-4 h-0.5 border-b-2 border-dotted border-blue-400" />
                <span className="text-slate-400">2023</span>
              </div>
            </div>
          </div>

          {/* Chart Container */}
          <div className="h-[280px] w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={nationalTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  domain={[-7, -3]} 
                  ticks={[-3, -4, -5, -6, -7]}
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: any) => [`${value} mbgl`, '']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="2024"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#2563eb' }}
                />
                <Line
                  type="monotone"
                  dataKey="2023"
                  stroke="#93c5fd"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quick link to Map */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <span className="text-slate-500">
              Showing aggregated telemetry across Rajasthan & Tamil Nadu basins
            </span>
            <button
              onClick={() => setActiveTab('map')}
              className="text-blue-600 font-semibold hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Explore Interactive GIS Map</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Right Card: Recent Alerts (Matching Screenshot) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Recent alerts
              </h2>
              
              {/* Category Dot Counters (🔴 3, 🟡 8, 🟢 12) */}
              <div className="flex items-center space-x-3 text-xs font-semibold text-slate-600">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>3</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>8</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>12</span>
                </span>
              </div>
            </div>

            {/* List of Alerts */}
            <div className="divide-y divide-slate-100 mt-1">
              {liveAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  onClick={() => {
                    const st = stations.find((s) => s.code.includes(alert.code) || s.district === alert.district);
                    if (st) {
                      setSelectedStationId(st.id);
                      onOpenTelemetry(st);
                    }
                  }}
                  className="py-3 hover:bg-slate-50/80 -mx-2 px-2 rounded-xl cursor-pointer transition space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <span 
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        alert.severity === 'critical' 
                          ? 'bg-rose-500' 
                          : alert.severity === 'warning' 
                          ? 'bg-amber-500' 
                          : 'bg-emerald-500'
                      }`} 
                    />
                    <span className="font-mono font-bold text-xs text-slate-900 tracking-tight">
                      {alert.code}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-snug pl-4">
                    {alert.message}
                  </p>

                  <div className="text-[11px] text-slate-400 pl-4 font-medium">
                    {alert.state === 'rajasthan' ? 'Rajasthan' : 'Tamil Nadu'} • {alert.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('stations')}
            className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 transition"
          >
            View All DWLR Stations
          </button>

        </div>

      </div>

    </div>
  );
};
