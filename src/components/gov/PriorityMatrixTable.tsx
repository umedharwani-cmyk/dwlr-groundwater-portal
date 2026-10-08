import React, { useState, useMemo } from 'react';
import { DWLRStation, SeverityCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { getSeverityBadgeStyle } from '../../services/severityEngine';
import { 
  ShieldAlert, 
  ArrowUpDown, 
  Search, 
  FileText, 
  Activity, 
  Filter, 
  Download,
  AlertTriangle,
  TrendingDown
} from 'lucide-react';
import { exportStationsCSV } from '../../services/reportGenerator';

interface PriorityMatrixTableProps {
  stations: DWLRStation[];
  onOpenActionPlan: (station: DWLRStation) => void;
  onOpenTelemetry: (station: DWLRStation) => void;
}

export const PriorityMatrixTable: React.FC<PriorityMatrixTableProps> = ({
  stations,
  onOpenActionPlan,
  onOpenTelemetry
}) => {
  const { t, activeState, setActiveState } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedPriorityRank, setSelectedPriorityRank] = useState<string>('all');
  const [sortField, setSortField] = useState<'urgencyPriorityScore' | 'currentDepthMgl' | 'stageOfExtractionPct' | 'depthTrendPerYearM'>('urgencyPriorityScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort logic
  const filteredStations = useMemo(() => {
    return stations
      .filter((s) => {
        // State filter
        if (activeState !== 'all' && s.state !== activeState) return false;
        
        // Severity filter
        if (selectedSeverity !== 'all' && s.status !== selectedSeverity) return false;

        // Priority Rank filter
        if (selectedPriorityRank !== 'all' && s.urgencyPriorityRank.toString() !== selectedPriorityRank) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            s.name.toLowerCase().includes(q) ||
            s.district.toLowerCase().includes(q) ||
            s.block.toLowerCase().includes(q) ||
            s.code.toLowerCase().includes(q) ||
            s.aquiferType.toLowerCase().includes(q)
          );
        }

        return true;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
  }, [stations, activeState, selectedSeverity, selectedPriorityRank, searchQuery, sortField, sortOrder]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getPriorityBadge = (rank: 1 | 2 | 3, score: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-rose-950/80 text-rose-300 border border-rose-600/50 text-xs font-bold shadow-sm">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>Priority 1 (Urgent: &lt;30d)</span>
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-950/80 text-amber-300 border border-amber-600/50 text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Priority 2 (Medium: &lt;90d)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 text-xs font-medium">
        <span>Priority 3 (Monitoring)</span>
      </span>
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      
      {/* Header & Description */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('priorityMatrixTitle')}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated ranking of groundwater reserves running out based on Urgency Priority Score (UPS)
          </p>
        </div>

        {/* Quick CSV Export */}
        <button
          onClick={() => exportStationsCSV(filteredStations)}
          className="self-start md:self-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Filtered Table (CSV)</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search district, station, block..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
          />
        </div>

        {/* Priority Rank Filter */}
        <div>
          <select
            value={selectedPriorityRank}
            onChange={(e) => setSelectedPriorityRank(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Priority Ranks</option>
            <option value="1">Priority 1 (Immediate &lt;30d)</option>
            <option value="2">Priority 2 (Medium &lt;90d)</option>
            <option value="3">Priority 3 (Monitoring)</option>
          </select>
        </div>

        {/* Severity Category Filter */}
        <div>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All CGWB Statuses</option>
            <option value="over-exploited">Over-Exploited / Emergency</option>
            <option value="critical">Critical</option>
            <option value="semi-critical">Semi-Critical</option>
            <option value="safe">Safe</option>
          </select>
        </div>

        {/* State Filter */}
        <div>
          <select
            value={activeState}
            onChange={(e) => setActiveState(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All States (RJ & TN)</option>
            <option value="rajasthan">Rajasthan Only</option>
            <option value="tamil_nadu">Tamil Nadu Only</option>
          </select>
        </div>

      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/90 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3 px-3">Station & Location</th>
              <th className="py-3 px-3">Aquifer Type</th>
              <th 
                onClick={() => handleSort('currentDepthMgl')} 
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center space-x-1">
                  <span>Water Depth (mbgl)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('depthTrendPerYearM')} 
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center space-x-1">
                  <span>Decline Rate (m/yr)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('stageOfExtractionPct')} 
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center space-x-1">
                  <span>SOE %</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('urgencyPriorityScore')} 
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center space-x-1">
                  <span>Urgency Score (UPS)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-3">Action Priority</th>
              <th className="py-3 px-3 text-right">Remediation Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
            {filteredStations.map((station) => {
              const badge = getSeverityBadgeStyle(station.status);

              return (
                <tr key={station.id} className="hover:bg-slate-800/40 transition">
                  
                  {/* Station & Location */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-white leading-tight">{station.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                      <span className="font-mono text-cyan-400">{station.code}</span>
                      <span>•</span>
                      <span>{station.district}, {station.state === 'rajasthan' ? 'Rajasthan' : 'Tamil Nadu'}</span>
                    </div>
                  </td>

                  {/* Aquifer */}
                  <td className="py-3 px-3 text-slate-300">
                    <span className="text-[11px] font-medium block truncate max-w-[140px]" title={station.aquiferType}>
                      {station.aquiferType}
                    </span>
                  </td>

                  {/* Current Depth */}
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    {station.currentDepthMgl.toFixed(2)} m
                  </td>

                  {/* Decline Rate */}
                  <td className="py-3 px-3 font-mono text-rose-400">
                    +{station.depthTrendPerYearM.toFixed(2)}
                  </td>

                  {/* SOE */}
                  <td className="py-3 px-3 font-mono font-semibold">
                    <span className={station.stageOfExtractionPct > 100 ? 'text-rose-400 font-bold' : station.stageOfExtractionPct > 70 ? 'text-amber-400' : 'text-emerald-400'}>
                      {station.stageOfExtractionPct.toFixed(1)}%
                    </span>
                  </td>

                  {/* Urgency Score */}
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-extrabold text-sm text-white">
                        {station.urgencyPriorityScore.toFixed(1)}
                      </span>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            station.urgencyPriorityScore >= 80
                              ? 'bg-rose-500'
                              : station.urgencyPriorityScore >= 60
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                          style={{ width: `${station.urgencyPriorityScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Priority Rank */}
                  <td className="py-3 px-3">
                    {getPriorityBadge(station.urgencyPriorityRank, station.urgencyPriorityScore)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => onOpenTelemetry(station)}
                        title="View Telemetry Hydrograph"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition"
                      >
                        <Activity className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onOpenActionPlan(station)}
                        title="Generate Replenishment Action Plan"
                        className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span className="hidden lg:inline">Plan</span>
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
  );
};
