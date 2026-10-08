import React from 'react';
import { useApp, NavTab } from '../context/AppContext';
import { AccountMenu } from './AccountMenu';
import { LayoutDashboard, Map as MapIcon, Radio, Droplet, Bell, Sprout } from 'lucide-react';

export const BottomDock: React.FC = () => {
  const { activeTab, setActiveTab, liveAlerts, role, currentUser } = useApp();
  const isGov = role === 'government';

  const govItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'map', label: 'Map', icon: <MapIcon className="w-4 h-4" /> },
    { id: 'stations', label: 'Stations', icon: <Radio className="w-4 h-4" /> },
    { id: 'recharge', label: 'Recharge', icon: <Droplet className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <Bell className="w-4 h-4" />, badge: liveAlerts.length }
  ];

  const farmerItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'farmer', label: 'Advisory', icon: <Sprout className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <Bell className="w-4 h-4" />, badge: liveAlerts.length }
  ];

  const navItems = isGov ? govItems : farmerItems;
  const accentActive = isGov ? 'bg-blue-600 shadow-blue-500/20' : 'bg-emerald-600 shadow-emerald-500/20';

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-2xl border border-slate-200/90 shadow-xl floating-dock-shadow space-x-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive ? `${accentActive} text-white shadow-md` : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <span>{item.icon}</span>
              <span className="tracking-tight">{item.label}</span>

              {item.badge !== undefined && item.badge > 0 && !isActive && (
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          );
        })}

        {/* Account Menu */}
        <AccountMenu
          align="right"
          direction="up"
          trigger={
            <button
              className={`ml-1 w-8 h-8 rounded-full border font-bold text-xs flex items-center justify-center transition ${
                isGov
                  ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'
              }`}
              title="Account"
            >
              {(currentUser?.name || (isGov ? 'GO' : 'FM')).slice(0, 2).toUpperCase()}
            </button>
          }
        />
      </nav>
    </div>
  );
};
