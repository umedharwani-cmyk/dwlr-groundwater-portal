import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DWLRStation } from '../../types';
import { CommandCenterKPIs } from './CommandCenterKPIs';
import { RealLeafletMap } from './RealLeafletMap';
import { PriorityMatrixTable } from './PriorityMatrixTable';
import { StationDetailModal } from './StationDetailModal';
import { ReplenishmentActionModal } from './ReplenishmentActionModal';
import { PolicySimulatorSandbox } from './PolicySimulatorSandbox';
import { 
  Layers, 
  ShieldAlert, 
  Sliders, 
  MapPin, 
  Activity, 
  FileText,
  Radio
} from 'lucide-react';

export const GovDashboard: React.FC = () => {
  const { stations, activeState, selectedStation, setSelectedStationId } = useApp();

  const [activeTab, setActiveTab] = useState<'map_and_matrix' | 'policy_simulator'>('map_and_matrix');
  const [telemetryModalStation, setTelemetryModalStation] = useState<DWLRStation | null>(null);
  const [actionPlanModalStation, setActionPlanModalStation] = useState<DWLRStation | null>(null);

  const filteredStations = stations.filter((s) => {
    if (activeState === 'all') return true;
    return s.state === activeState;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Macro KPIs */}
      <CommandCenterKPIs stations={filteredStations} />

      {/* Navigation Sub-Tabs: Surveillance vs Policy Sandbox */}
      <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 self-start">
        <button
          onClick={() => setActiveTab('map_and_matrix')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'map_and_matrix'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>GIS Telemetry Map & Priority Ranking Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('policy_simulator')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'policy_simulator'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Policy & Replenishment "What-If" Simulator</span>
        </button>
      </div>

      {/* Tab 1: GIS Map + Priority Matrix */}
      {activeTab === 'map_and_matrix' && (
        <div className="space-y-6">
          {/* Interactive Leaflet Map */}
          <RealLeafletMap
            stations={filteredStations}
            onSelectStation={(station) => setSelectedStationId(station.id)}
            onOpenActionPlan={(station) => setActionPlanModalStation(station)}
            onOpenTelemetry={(station) => setTelemetryModalStation(station)}
          />

          {/* Urgent Priority Ranking Table */}
          <PriorityMatrixTable
            stations={stations}
            onOpenActionPlan={(station) => setActionPlanModalStation(station)}
            onOpenTelemetry={(station) => setTelemetryModalStation(station)}
          />
        </div>
      )}

      {/* Tab 2: Policy Simulation Sandbox */}
      {activeTab === 'policy_simulator' && (
        <div className="space-y-6">
          <PolicySimulatorSandbox station={selectedStation} />
        </div>
      )}

      {/* Telemetry Hydrograph Modal */}
      {telemetryModalStation && (
        <StationDetailModal
          station={telemetryModalStation}
          onClose={() => setTelemetryModalStation(null)}
          onOpenActionPlan={(station) => {
            setTelemetryModalStation(null);
            setActionPlanModalStation(station);
          }}
        />
      )}

      {/* Replenishment Action Plan Modal */}
      {actionPlanModalStation && (
        <ReplenishmentActionModal
          station={actionPlanModalStation}
          onClose={() => setActionPlanModalStation(null)}
        />
      )}

    </div>
  );
};
