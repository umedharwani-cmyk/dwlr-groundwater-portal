import React from 'react';
import { useApp } from '../context/AppContext';
import { AccountMenu } from './AccountMenu';
import { Droplet, Bell, MapPin, Landmark, Sprout } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    activeState,
    setActiveState,
    setActiveTab,
    currentUser,
    liveAlerts,
    isLiveSimulationActive,
    setIsLiveSimulationActive,
    language,
    setLanguage
  } = useApp();

  const isGov = role === 'government';

  return (
    <header
      className={`bg-white border-b sticky top-0 z-40 shadow-xs ${
        isGov ? 'border-slate-200/80' : 'border-emerald-200/70'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Jal Drishti Brand Logo */}
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-xs ${
                isGov ? 'bg-blue-500' : 'bg-emerald-500'
              }`}
            >
              <Droplet className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold text-slate-800 tracking-tight">Jal Drishti</span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full hidden sm:inline-flex items-center ${
                  isGov
                    ? 'bg-blue-50 text-blue-600 border border-blue-200/60'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                }`}
              >
                {isGov ? <Landmark className="w-3 h-3 mr-1" /> : <Sprout className="w-3 h-3 mr-1" />}
                {isGov ? 'Government Command Center' : 'Farmer Advisory Portal'}
              </span>
            </div>
          </div>

          {/* Center / Right: Status Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {isGov ? (
              /* State Switcher Tabs — Government only */
              <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium border border-slate-200">
                <button
                  onClick={() => setActiveState('all')}
                  className={`px-3 py-1 rounded-lg transition ${
                    activeState === 'all'
                      ? 'bg-white text-blue-600 font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All (RJ & TN)
                </button>
                <button
                  onClick={() => setActiveState('rajasthan')}
                  className={`px-3 py-1 rounded-lg transition ${
                    activeState === 'rajasthan'
                      ? 'bg-white text-blue-600 font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Rajasthan
                </button>
                <button
                  onClick={() => setActiveState('tamil_nadu')}
                  className={`px-3 py-1 rounded-lg transition ${
                    activeState === 'tamil_nadu'
                      ? 'bg-white text-blue-600 font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Tamil Nadu
                </button>
              </div>
            ) : (
              /* Farmer's registered location — Farmer only */
              <div className="hidden sm:flex items-center space-x-1.5 text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  {currentUser?.district || 'Jodhpur'},{' '}
                  {currentUser?.state === 'tamil_nadu' ? 'Tamil Nadu' : 'Rajasthan'}
                </span>
              </div>
            )}

            {/* Sync: Live Indicator */}
            <div
              onClick={() => setIsLiveSimulationActive(!isLiveSimulationActive)}
              className="hidden md:flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer select-none"
              title="Click to toggle live telemetry sync"
            >
              <span className="text-slate-500 font-normal">Sync:</span>
              <span
                className={`font-semibold flex items-center space-x-1 ${
                  isLiveSimulationActive ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isLiveSimulationActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`}
                />
                <span>{isLiveSimulationActive ? 'Live' : 'Paused'}</span>
              </span>
            </div>

            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 rounded-lg px-2 py-1 border border-slate-200 text-xs">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer pr-1"
              >
                <option value="en">EN</option>
                <option value="hi">हिंदी</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>

            {/* Notification Bell with Badge */}
            <button
              onClick={() => setActiveTab(isGov ? 'alerts' : 'farmer')}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition"
              title="View Alerts"
            >
              <Bell className="w-4 h-4" />
              {liveAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                  {liveAlerts.length}
                </span>
              )}
            </button>

            {/* Account Menu */}
            <AccountMenu
              align="right"
              trigger={
                <button
                  className={`flex items-center space-x-2 pl-1 pr-2.5 py-1 rounded-full border transition ${
                    isGov
                      ? 'bg-blue-50 border-blue-200 hover:bg-blue-100/80'
                      : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100/80'
                  }`}
                  title="Account"
                >
                  <div
                    className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-xs ${
                      isGov ? 'bg-blue-600' : 'bg-emerald-600'
                    }`}
                  >
                    {(currentUser?.name || (isGov ? 'GO' : 'FM')).slice(0, 2).toUpperCase()}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden md:inline ${
                      isGov ? 'text-blue-900' : 'text-emerald-900'
                    }`}
                  >
                    {isGov ? 'Gov Official' : 'Farmer Profile'}
                  </span>
                </button>
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
};
