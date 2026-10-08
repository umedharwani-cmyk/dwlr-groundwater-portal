import React from 'react';
import { useApp } from '../../context/AppContext';
import { LocationSelector } from './LocationSelector';
import { WellVisualizer } from './WellVisualizer';
import { CropAdvisoryCard } from './CropAdvisoryCard';
import { IrrigationScheduler } from './IrrigationScheduler';
import { WeatherRechargeWidget } from './WeatherRechargeWidget';

export const FarmerDashboard: React.FC = () => {
  const { farmerStation } = useApp();

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <LocationSelector />
      <WellVisualizer station={farmerStation} />
      <div className="grid grid-cols-1 gap-6">
        <CropAdvisoryCard station={farmerStation} />
        <IrrigationScheduler station={farmerStation} />
      </div>
      <WeatherRechargeWidget station={farmerStation} />
    </div>
  );
};
