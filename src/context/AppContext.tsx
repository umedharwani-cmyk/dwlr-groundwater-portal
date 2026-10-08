import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, DWLRStation, Language, StateSelection, UserRole } from '../types';
import { initialDWLRStations } from '../data/dwlrStationsData';
import { translations } from '../data/translations';

const AUTH_STORAGE_KEY = 'jaldrishti_auth_user';

export type NavTab = 'dashboard' | 'map' | 'stations' | 'recharge' | 'alerts' | 'farmer';

export interface LiveAlertItem {
  id: string;
  code: string;
  stationName: string;
  district: string;
  state: 'rajasthan' | 'tamil_nadu' | 'madhya_pradesh' | 'gujarat';
  message: string;
  severity: 'critical' | 'warning' | 'safe';
  timestamp: string;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  activeState: StateSelection;
  setActiveState: (state: StateSelection) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  stations: DWLRStation[];
  selectedStation: DWLRStation;
  setSelectedStation: (station: DWLRStation) => void;
  selectedStationId: string;
  setSelectedStationId: (id: string) => void;
  liveAlerts: LiveAlertItem[];
  dismissAlert: (id: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isLiveSimulationActive: boolean;
  setIsLiveSimulationActive: (active: boolean) => void;
  farmerDistrict: string;
  setFarmerDistrict: (d: string) => void;
  farmerStation: DWLRStation;
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('government');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [activeState, setActiveState] = useState<StateSelection>('all');
  const [language, setLanguage] = useState<Language>('en');
  const [stations, setStations] = useState<DWLRStation[]>(initialDWLRStations);
  const [selectedStationId, setSelectedStationId] = useState<string>(initialDWLRStations[0].id);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isLiveSimulationActive, setIsLiveSimulationActive] = useState<boolean>(true);
  const [farmerDistrict, setFarmerDistrict] = useState<string>('Jodhpur');

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!currentUser);

  useEffect(() => {
    if (currentUser) {
      setRole(currentUser.role);
      if (currentUser.role === 'farmer') {
        setActiveTab('farmer');
        if (currentUser.state) setActiveState(currentUser.state);
        if (currentUser.district) setFarmerDistrict(currentUser.district);
      } else {
        setActiveTab('dashboard');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (user: AuthUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setRole(user.role);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch {
      /* ignore storage errors */
    }
    if (user.role === 'farmer') {
      setActiveTab('farmer');
      if (user.state) setActiveState(user.state);
      if (user.district) setFarmerDistrict(user.district);
    } else {
      setActiveTab('dashboard');
      setActiveState('all');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsAuthModalOpen(false);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      /* ignore storage errors */
    }
  };
  
  const [liveAlerts, setLiveAlerts] = useState<LiveAlertItem[]>([
    {
      id: 'alert-1',
      code: 'RJ-DWL-0104',
      stationName: 'Osian Hydro Station',
      district: 'Jodhpur',
      state: 'rajasthan',
      message: 'Level below critical threshold — pumping advisory active (78.4 m bgl)',
      severity: 'critical',
      timestamp: '12 min ago'
    },
    {
      id: 'alert-2',
      code: 'RJ-DWL-0019',
      stationName: 'Pokhran Deep Aquifer Node',
      district: 'Jaisalmer',
      state: 'rajasthan',
      message: 'Rapid drawdown 2.1 m over 72-hour agricultural pumping window',
      severity: 'warning',
      timestamp: '41 min ago'
    },
    {
      id: 'alert-3',
      code: 'TN-DWL-0005',
      stationName: 'Ponneri Coastal Station',
      district: 'Thiruvallur',
      state: 'tamil_nadu',
      message: 'Saline intrusion detected — TDS spiked past 2,450 ppm threshold',
      severity: 'warning',
      timestamp: '1 hr ago'
    },
    {
      id: 'alert-4',
      code: 'TN-DWL-0018',
      stationName: 'Tamirabarani River Basin Monitor',
      district: 'Tirunelveli',
      state: 'tamil_nadu',
      message: 'Level stable, post-monsoon groundwater recovery on track',
      severity: 'safe',
      timestamp: '2 hr ago'
    }
  ]);

  const selectedStation = stations.find((s) => s.id === selectedStationId) || stations[0];

  const farmerStation =
    stations.find((s) => s.district.toLowerCase() === farmerDistrict.toLowerCase()) ||
    stations.find((s) => s.state === (activeState === 'tamil_nadu' ? 'tamil_nadu' : 'rajasthan')) ||
    stations[0];

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const dismissAlert = (id: string) => {
    setLiveAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // IoT Simulation Ticker
  useEffect(() => {
    if (!isLiveSimulationActive) return;

    const interval = setInterval(() => {
      setStations((prev) =>
        prev.map((s) => {
          const delta = (Math.random() - 0.49) * 0.02;
          const newDepth = Math.max(2.0, Math.round((s.currentDepthMgl + delta) * 100) / 100);
          return {
            ...s,
            currentDepthMgl: newDepth,
            lastTelemetry: {
              ...s.lastTelemetry,
              depthMgl: newDepth,
              timestamp: new Date().toISOString()
            }
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveSimulationActive]);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        activeState,
        setActiveState,
        language,
        setLanguage,
        t,
        stations,
        selectedStation,
        setSelectedStation: (st) => setSelectedStationId(st.id),
        selectedStationId,
        setSelectedStationId,
        liveAlerts,
        dismissAlert,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isLiveSimulationActive,
        setIsLiveSimulationActive,
        farmerDistrict,
        setFarmerDistrict,
        farmerStation,
        isAuthenticated,
        currentUser,
        login,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
