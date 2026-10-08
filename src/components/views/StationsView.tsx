import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DWLRStation } from '../../types';
import { getSeverityBadgeStyle } from '../../services/severityEngine';
import { 
  Search, 
  ArrowUpDown, 
  FileText, 
  Activity, 
  Download, 
  ShieldAlert, 
  Filter, 
  MapPin 
} from 'lucide-react';
import { exportStationsCSV } from '../../services/reportGenerator';

interface StationsViewProps {
  onOpenActionPlan: (station: DWLRStation) => void;
  onOpenTelemetry: (station: DWLRStation) => void;
}

export const StationsView: React.FC<StationsViewProps> = ({
  onOpenActionPlan,
  onOpenTelemetry
}) => {
  const { stations, activeState, setActiveState, setSelectedStationId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [sortField, setSortField] = useState<'urgencyPriorityScore' | 'currentDepthMgl' | 'stageOfExtractionPct'>('urgencyPriorityScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredStations = useMemo(() => {
    return stations
      .filter((s) => {
        if (activeState !== 'all' && s.state !== activeState) return false;
        if (selectedSeverity !== 'all' && s.status !== selectedSeverity) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            s.name.toLowerCase().includes(q) ||
            s.district.toLowerCase().includes(q) ||
            s.block.toLowerCase().includes(q) ||
            s.code.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
  }, [stations, activeState, selectedSeverity, searchQuery, sortField, sortOrder]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              DWLR Groundwater Reserves Priority Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated ranking of depleting reserves sorted by Urgency Priority Score (UPS)
          </p>
        </div>

        <button
          onClick={() => exportStationsCSV(filteredStations)}
          className="self-start md:self-auto flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition"
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search station, district, block..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="over-exploited">Over-Exploited / Emergency</option>
            <option value="critical">Critical</option>
            <option value="semi-critical">Semi-Critical</option>
            <option value="safe">Safe</option>
          </select>
        </div>

        <div>
          <select
            value={activeState}
            onChange={(e) => setActiveState(e.target.value as any)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none"
          >
            <option value="all">All States (Rajasthan & Tamil Nadu)</option>
            <option value="rajasthan">Rajasthan Only</option>
            <option value="tamil_nadu">Tamil Nadu Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Station & Location</th>
                <th className="py-3 px-3">Aquifer Type</th>
                <th 
                  onClick={() => handleSort('currentDepthMgl')} 
                  className="py-3 px-3 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center space-x-1">
                    <span>Depth (mbgl)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('stageOfExtractionPct')} 
                  className="py-3 px-3 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center space-x-1">
                    <span>SOE Extraction %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('urgencyPriorityScore')} 
                  className="py-3 px-3 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center space-x-1">
                    <span>Urgency Score (UPS)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Priority Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredStations.map((station) => {
                const badge = getSeverityBadgeStyle(station.status);

                return (
                  <tr key={station.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 leading-tight">{station.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {station.code} • {station.district}, {station.state === 'rajasthan' ? 'Rajasthan' : 'Tamil Nadu'}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {station.aquiferType}
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {station.currentDepthMgl.toFixed(2)} m
                    </td>

                    <td className="py-3 px-3 font-mono font-bold">
                      <span className={station.stageOfExtractionPct > 100 ? 'text-rose-500' : 'text-slate-700'}>
                        {station.stageOfExtractionPct.toFixed(1)}%
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-extrabold text-slate-900">
                          {station.urgencyPriorityScore}
                        </span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              station.urgencyPriorityScore >= 80 ? 'bg-rose-500' : station.urgencyPriorityScore >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${station.urgencyPriorityScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${badge.bgClass} ${badge.textClass}`}>
                        <span>{badge.label}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedStationId(station.id);
                            onOpenTelemetry(station);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-600 transition"
                          title="View Telemetry Hydrograph"
                        >
                          <Activity className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedStationId(station.id);
                            onOpenActionPlan(station);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition flex items-center space-x-1"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Plan</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
