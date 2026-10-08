import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Navigation, Compass, Layers, Sprout } from 'lucide-react';
import { getSeverityBadgeStyle } from '../../services/severityEngine';

export const LocationSelector: React.FC = () => {
  const {
    activeState,
    setActiveState,
    farmerDistrict,
    setFarmerDistrict,
    farmerStation,
    setSelectedStationId,
    stations,
    t
  } = useApp();

  const currentStates = activeState === 'all' 
    ? ['rajasthan', 'tamil_nadu'] 
    : [activeState];

  const availableStations = stations.filter((s) => currentStates.includes(s.state));
  const availableDistricts = Array.from(new Set(availableStations.map((s) => s.district)));

  const handleDistrictChange = (district: string) => {
    setFarmerDistrict(district);
    const station = stations.find((s) => s.district.toLowerCase() === district.toLowerCase());
    if (station) {
      setSelectedStationId(station.id);
      setActiveState(station.state);
    }
  };

  const handleAutoLocate = () => {
    if (farmerStation.state === 'rajasthan') {
      setActiveState('tamil_nadu');
      setFarmerDistrict('Coimbatore');
      const st = stations.find((s) => s.district === 'Coimbatore');
      if (st) setSelectedStationId(st.id);
    } else {
      setActiveState('rajasthan');
      setFarmerDistrict('Jodhpur');
      const st = stations.find((s) => s.district === 'Jodhpur');
      if (st) setSelectedStationId(st.id);
    }
  };

  const badgeStyle = getSeverityBadgeStyle(farmerStation.status);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        
        {/* Farm Location Selection Controls */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Sprout className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t('selectLocation')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            
            {/* State Select */}
            <div className="min-w-0">
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                {t('state')}
              </label>
              <select
                value={activeState === 'all' ? farmerStation.state : activeState}
                onChange={(e) => {
                  const newState = e.target.value as any;
                  setActiveState(newState);
                  const firstInState = stations.find((s) => s.state === newState);
                  if (firstInState) {
                    setFarmerDistrict(firstInState.district);
                    setSelectedStationId(firstInState.id);
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 transition"
              >
                <option value="rajasthan">Rajasthan (राजस्थान)</option>
                <option value="tamil_nadu">Tamil Nadu (தமிழ்நாடு)</option>
              </select>
            </div>

            {/* District Select */}
            <div className="min-w-0">
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                {t('district')}
              </label>
              <select
                value={farmerDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 transition"
              >
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Block / Village indicator + Auto Locate */}
            <div className="min-w-0 flex items-end gap-2 sm:col-span-2 lg:col-span-1">
              <div className="min-w-0 flex-1">
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Nearest DWLR Sensor
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-blue-700 font-semibold truncate">
                  {farmerStation.name}
                </div>
              </div>

              <button
                onClick={handleAutoLocate}
                title="Switch Farm State (Rajasthan / Tamil Nadu)"
                className="shrink-0 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="hidden md:inline whitespace-nowrap">Switch Farm</span>
              </button>
            </div>

          </div>
        </div>

        {/* Current Groundwater Health Badge */}
        <div className="w-full xl:w-auto shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider whitespace-nowrap">
              {t('statusTitle')}
            </span>
            <div className="flex items-center space-x-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: badgeStyle.dotColor }}
              />
              <span className={`text-xs font-bold whitespace-nowrap ${badgeStyle.textClass}`}>
                {badgeStyle.label}
              </span>
            </div>
          </div>

          <div className="border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3 space-y-0.5 min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider whitespace-nowrap">
              Aquifer Type
            </span>
            <p className="text-xs text-slate-800 font-semibold truncate">
              {farmerStation.aquiferType}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
