import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { DWLRStation, SeverityCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { getSeverityBadgeStyle } from '../../services/severityEngine';
import { 
  Layers, 
  Eye, 
  FileText, 
  MapPin, 
  Activity, 
  TrendingDown, 
  Maximize2,
  Compass
} from 'lucide-react';

// Custom SVG Leaflet Pin Generator
function createCustomIcon(status: SeverityCategory, isSelected: boolean) {
  let color = '#10b981'; // Safe
  let glow = 'rgba(16, 185, 129, 0.4)';
  if (status === 'over-exploited') {
    color = '#f43f5e';
    glow = 'rgba(244, 63, 94, 0.6)';
  } else if (status === 'critical') {
    color = '#f97316';
    glow = 'rgba(249, 115, 22, 0.5)';
  } else if (status === 'semi-critical') {
    color = '#eab308';
    glow = 'rgba(234, 179, 8, 0.5)';
  }

  const size = isSelected ? 34 : 26;

  const svgHtml = `
    <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
      ${status === 'over-exploited' ? `<div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${color}; opacity: 0.75; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle at 30% 30%, #ffffff, ${color});
        border-radius: 50%;
        border: ${isSelected ? '3px solid #ffffff' : '2px solid rgba(255,255,255,0.85)'};
        box-shadow: 0 0 12px ${glow}, 0 4px 6px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-dwlr-pin',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
}

// Map Camera Transition Controller
function MapViewController({ 
  center, 
  zoom 
}: { 
  center: [number, number]; 
  zoom: number; 
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

interface RealLeafletMapProps {
  stations: DWLRStation[];
  onSelectStation: (station: DWLRStation) => void;
  onOpenActionPlan: (station: DWLRStation) => void;
  onOpenTelemetry: (station: DWLRStation) => void;
}

export const RealLeafletMap: React.FC<RealLeafletMapProps> = ({
  stations,
  onSelectStation,
  onOpenActionPlan,
  onOpenTelemetry
}) => {
  const { activeState, setActiveState, selectedStationId, setSelectedStationId } = useApp();
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [tileTheme, setTileTheme] = useState<'dark' | 'osm'>('dark');

  // Filter stations by severity
  const filteredStations = stations.filter((s) => {
    if (severityFilter === 'all') return true;
    return s.status === severityFilter;
  });

  // Calculate Map Camera Center & Zoom
  let mapCenter: [number, number] = [19.5, 76.5];
  let mapZoom = 5;

  if (activeState === 'rajasthan') {
    mapCenter = [26.6, 74.2];
    mapZoom = 7;
  } else if (activeState === 'tamil_nadu') {
    mapCenter = [10.9, 78.5];
    mapZoom = 7;
  }

  // Real Map Tiles URL
  const tileUrl = tileTheme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png' // high contrast voyager
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
      
      {/* Map Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              GIS Aquifer Telemetry & Severity Map
            </h3>
            <p className="text-xs text-slate-400">
              Live spatial coordinates for DWLR stations in Rajasthan & Tamil Nadu
            </p>
          </div>
        </div>

        {/* Filters: State Jump & Severity */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Quick State Camera Jumps */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveState('all')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                activeState === 'all' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveState('rajasthan')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                activeState === 'rajasthan' ? 'bg-amber-950/80 text-amber-300 border border-amber-600/40' : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              Rajasthan
            </button>
            <button
              onClick={() => setActiveState('tamil_nadu')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                activeState === 'tamil_nadu' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40' : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              Tamil Nadu
            </button>
          </div>

          {/* Severity Filter Dropdown */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="over-exploited">Over-Exploited Only (Emergency)</option>
            <option value="critical">Critical Only</option>
            <option value="semi-critical">Semi-Critical Only</option>
            <option value="safe">Safe Only</option>
          </select>

        </div>

      </div>

      {/* Real Leaflet Map Container */}
      <div className="relative w-full h-[450px] rounded-xl overflow-hidden border border-slate-800">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapViewController center={mapCenter} zoom={mapZoom} />
          
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={tileUrl}
          />

          {/* Station Markers */}
          {filteredStations.map((station) => {
            const isSelected = selectedStationId === station.id;
            const badge = getSeverityBadgeStyle(station.status);

            return (
              <Marker
                key={station.id}
                position={[station.lat, station.lng]}
                icon={createCustomIcon(station.status, isSelected)}
                eventHandlers={{
                  click: () => {
                    setSelectedStationId(station.id);
                    onSelectStation(station);
                  }
                }}
              >
                <Popup>
                  <div className="p-1 space-y-2 min-w-[240px]">
                    
                    {/* Popup Header */}
                    <div className="border-b border-slate-800 pb-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold">
                          {station.code}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badge.bgClass} ${badge.textClass}`}>
                          {badge.label}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1 leading-snug">
                        {station.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {station.village}, {station.district} ({station.state === 'rajasthan' ? 'Rajasthan' : 'Tamil Nadu'})
                      </p>
                    </div>

                    {/* Telemetry Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-xs py-1">
                      <div className="bg-slate-950/80 p-1.5 rounded">
                        <span className="text-[9px] text-slate-400 block">Water Depth</span>
                        <span className="font-bold text-white text-xs">{station.currentDepthMgl.toFixed(2)} m</span>
                      </div>
                      <div className="bg-slate-950/80 p-1.5 rounded">
                        <span className="text-[9px] text-slate-400 block">SOE Extraction</span>
                        <span className={`font-bold text-xs ${station.stageOfExtractionPct > 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {station.stageOfExtractionPct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="bg-slate-950/80 p-1.5 rounded">
                        <span className="text-[9px] text-slate-400 block">Priority Rank</span>
                        <span className="font-bold text-amber-400 text-xs">Priority {station.urgencyPriorityRank}</span>
                      </div>
                      <div className="bg-slate-950/80 p-1.5 rounded">
                        <span className="text-[9px] text-slate-400 block">Aquifer Type</span>
                        <span className="font-medium text-slate-300 text-[10px] truncate block">{station.aquiferType}</span>
                      </div>
                    </div>

                    {/* Actions Inside Popup */}
                    <div className="flex items-center space-x-1.5 pt-1">
                      <button
                        onClick={() => onOpenTelemetry(station)}
                        className="flex-1 py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold flex items-center justify-center space-x-1 transition"
                      >
                        <Activity className="w-3 h-3" />
                        <span>Telemetry</span>
                      </button>

                      <button
                        onClick={() => onOpenActionPlan(station)}
                        className="flex-1 py-1 px-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-semibold flex items-center justify-center space-x-1 transition"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Action Plan</span>
                      </button>
                    </div>

                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Overlay Legend */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-slate-950/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1.5 shadow-2xl">
          <div className="font-bold text-slate-300 text-[10px] uppercase tracking-wider">Severity Legend</div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">Safe (SOE &le;70%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-slate-300">Semi-Critical (70-90%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-slate-300">Critical (90-100%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-rose-300 font-semibold">Over-Exploited / Urgent (&gt;100%)</span>
          </div>
        </div>

      </div>

    </div>
  );
};
