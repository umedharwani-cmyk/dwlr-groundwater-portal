import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DWLRStation } from '../../types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getSeverityBadgeStyle } from '../../services/severityEngine';
import { 
  MapPin, 
  Layers, 
  Activity, 
  FileText, 
  Filter, 
  Droplets, 
  Gauge, 
  TrendingDown, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  Compass
} from 'lucide-react';

function createCleanMapPin(status: DWLRStation['status'], isSelected: boolean) {
  let bg = '#10b981'; // green
  if (status === 'over-exploited') bg = '#f43f5e'; // red
  else if (status === 'critical') bg = '#f97316'; // orange
  else if (status === 'semi-critical') bg = '#f59e0b'; // amber

  const size = isSelected ? 34 : 26;

  const html = `
    <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
      ${status === 'over-exploited' ? `<div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${bg}; opacity: 0.6; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${bg};
        border-radius: 50%;
        border: ${isSelected ? '3px solid #ffffff' : '2px solid #ffffff'};
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'clean-dwlr-pin',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
}

function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.0 });
  }, [center, zoom, map]);
  return null;
}

interface MapViewProps {
  onOpenTelemetry: (station: DWLRStation) => void;
  onOpenActionPlan: (station: DWLRStation) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  onOpenTelemetry,
  onOpenActionPlan
}) => {
  const { 
    stations, 
    activeState, 
    setActiveState, 
    selectedStationId, 
    setSelectedStationId, 
    selectedStation 
  } = useApp();

  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredStations = stations.filter((s) => {
    if (activeState !== 'all' && s.state !== activeState) return false;
    if (severityFilter !== 'all' && s.status !== severityFilter) return false;
    return true;
  });

  // Center coordinates
  let mapCenter: [number, number] = [19.5, 76.5];
  let mapZoom = 5;

  if (activeState === 'rajasthan') {
    mapCenter = [26.6, 74.2];
    mapZoom = 7;
  } else if (activeState === 'tamil_nadu') {
    mapCenter = [10.9, 78.5];
    mapZoom = 7;
  }

  const selectedBadge = getSeverityBadgeStyle(selectedStation.status);

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      
      {/* Map Header & Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              DWLR Station GIS Map — Rajasthan & Tamil Nadu
            </h2>
            <p className="text-xs text-slate-500">
              Real-time spatial telemetry & groundwater reserve severity
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* State Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium border border-slate-200">
            <button
              onClick={() => setActiveState('all')}
              className={`px-3 py-1 rounded-lg transition ${
                activeState === 'all' ? 'bg-white text-blue-600 font-semibold shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All States
            </button>
            <button
              onClick={() => setActiveState('rajasthan')}
              className={`px-3 py-1 rounded-lg transition ${
                activeState === 'rajasthan' ? 'bg-white text-blue-600 font-semibold shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Rajasthan
            </button>
            <button
              onClick={() => setActiveState('tamil_nadu')}
              className={`px-3 py-1 rounded-lg transition ${
                activeState === 'tamil_nadu' ? 'bg-white text-blue-600 font-semibold shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tamil Nadu
            </button>
          </div>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="over-exploited">Over-Exploited Only</option>
            <option value="critical">Critical Only</option>
            <option value="semi-critical">Semi-Critical Only</option>
            <option value="safe">Safe Only</option>
          </select>

        </div>

      </div>

      {/* Grid: Map Container (Left 8 cols) + Selected Station Drawer (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Leaflet Map */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-2 border border-slate-200/90 shadow-xs relative">
          <div className="h-[520px] w-full rounded-xl overflow-hidden">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%' }}
            >
              <MapViewController center={mapCenter} zoom={mapZoom} />
              
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />

              {filteredStations.map((station) => {
                const isSelected = selectedStationId === station.id;
                const badge = getSeverityBadgeStyle(station.status);

                return (
                  <Marker
                    key={station.id}
                    position={[station.lat, station.lng]}
                    icon={createCleanMapPin(station.status, isSelected)}
                    eventHandlers={{
                      click: () => setSelectedStationId(station.id)
                    }}
                  >
                    <Popup>
                      <div className="p-1 space-y-2 min-w-[220px]">
                        <div className="border-b border-slate-100 pb-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-blue-600 font-bold">
                              {station.code}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.bgClass} ${badge.textClass}`}>
                              {badge.label}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 mt-1">
                            {station.name}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            {station.district}, {station.state === 'rajasthan' ? 'Rajasthan' : 'Tamil Nadu'}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 text-xs py-1">
                          <div className="bg-slate-50 p-1.5 rounded-lg">
                            <span className="text-[9px] text-slate-400 block">Water Depth</span>
                            <span className="font-bold text-slate-800 text-xs">{station.currentDepthMgl.toFixed(2)} m</span>
                          </div>
                          <div className="bg-slate-50 p-1.5 rounded-lg">
                            <span className="text-[9px] text-slate-400 block">SOE Extraction</span>
                            <span className="font-bold text-xs text-rose-500">{station.stageOfExtractionPct.toFixed(1)}%</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 pt-1">
                          <button
                            onClick={() => onOpenTelemetry(station)}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center justify-center space-x-1 transition"
                          >
                            <Activity className="w-3 h-3" />
                            <span>Telemetry</span>
                          </button>
                          <button
                            onClick={() => onOpenActionPlan(station)}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold flex items-center justify-center space-x-1 transition"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Plan</span>
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          {/* Map Legend Overlay */}
          <div className="absolute bottom-5 left-5 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-md text-xs space-y-1">
            <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wider">Severity Legend</div>
            <div className="flex items-center space-x-2 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600">Safe (&le;70% SOE)</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-600">Semi-Critical (70-90%)</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span className="text-slate-600">Critical (90-100%)</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-rose-600 font-semibold">Over-Exploited (&gt;100%)</span>
            </div>
          </div>
        </div>

        {/* Right: Station Telemetry Detail Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          
          <div className="space-y-4">
            
            {/* Station Header */}
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                  {selectedStation.code}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${selectedBadge.bgClass} ${selectedBadge.textClass}`}>
                  {selectedBadge.label}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-2 leading-tight">
                {selectedStation.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedStation.village}, {selectedStation.district} ({selectedStation.state === 'rajasthan' ? 'Rajasthan' : 'Tamil Nadu'})
              </p>
            </div>

            {/* Depth & Trend Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Current Water Depth</span>
                <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
                  {selectedStation.currentDepthMgl.toFixed(2)} m
                </span>
                <span className="text-[10px] text-slate-500">10-yr: {selectedStation.baselineDepthMgl.toFixed(1)}m</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Decline Velocity</span>
                <span className="text-xl font-extrabold text-rose-500 mt-0.5 block">
                  +{selectedStation.depthTrendPerYearM.toFixed(2)} m/yr
                </span>
                <span className="text-[10px] text-slate-500">SOE: {selectedStation.stageOfExtractionPct.toFixed(1)}%</span>
              </div>
            </div>

            {/* Aquifer & Salinity Info */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Aquifer System:</span>
                <span className="font-bold text-slate-800">{selectedStation.aquiferType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Water Salinity (TDS):</span>
                <span className="font-bold text-slate-800">{selectedStation.salinityTdsPpm} ppm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Urgency Priority Score:</span>
                <span className="font-extrabold text-rose-600">
                  {selectedStation.urgencyPriorityScore}/100 (Priority {selectedStation.urgencyPriorityRank})
                </span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => onOpenActionPlan(selectedStation)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center space-x-1.5 transition"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Replenishment Plan</span>
            </button>

            <button
              onClick={() => onOpenTelemetry(selectedStation)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-1.5 transition"
            >
              <Activity className="w-4 h-4 text-blue-600" />
              <span>View Full Hydrograph Telemetry</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
