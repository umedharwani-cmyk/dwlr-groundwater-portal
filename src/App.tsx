import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomDock } from './components/BottomDock';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardView } from './components/views/DashboardView';
import { MapView } from './components/views/MapView';
import { StationsView } from './components/views/StationsView';
import { RechargeView } from './components/views/RechargeView';
import { AlertsView } from './components/views/AlertsView';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { StationDetailModal } from './components/gov/StationDetailModal';
import { ReplenishmentActionModal } from './components/gov/ReplenishmentActionModal';
import { DWLRStation } from './types';

const MainLayout: React.FC = () => {
  const { activeTab, role, isAuthenticated } = useApp();

  const [telemetryModalStation, setTelemetryModalStation] = useState<DWLRStation | null>(null);
  const [actionPlanModalStation, setActionPlanModalStation] = useState<DWLRStation | null>(null);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    if (activeTab === 'farmer' || role === 'farmer') {
      return <FarmerDashboard />;
    }

    switch (activeTab) {
      case 'map':
        return (
          <MapView
            onOpenTelemetry={(s) => setTelemetryModalStation(s)}
            onOpenActionPlan={(s) => setActionPlanModalStation(s)}
          />
        );
      case 'stations':
        return (
          <StationsView
            onOpenTelemetry={(s) => setTelemetryModalStation(s)}
            onOpenActionPlan={(s) => setActionPlanModalStation(s)}
          />
        );
      case 'recharge':
        return (
          <RechargeView
            onOpenActionPlanModal={(s) => setActionPlanModalStation(s)}
          />
        );
      case 'alerts':
        return (
          <AlertsView
            onOpenTelemetry={(s) => setTelemetryModalStation(s)}
            onOpenActionPlan={(s) => setActionPlanModalStation(s)}
          />
        );
      case 'dashboard':
      default:
        return (
          <DashboardView
            onOpenTelemetry={(s) => setTelemetryModalStation(s)}
            onOpenActionPlan={(s) => setActionPlanModalStation(s)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      {/* Top Navbar matching the design */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderActiveView()}
      </main>

      {/* Floating Bottom Dock Navigation */}
      <BottomDock />

      {/* Hydrograph Telemetry Modal */}
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

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
