import React, { useState } from 'react';
import { DWLRStation, CropRecommendation } from '../../types';
import { useApp } from '../../context/AppContext';
import { getCropAdvisories } from '../../services/cropAdvisoryEngine';
import { 
  Sprout, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Droplet, 
  IndianRupee 
} from 'lucide-react';

interface CropAdvisoryCardProps {
  station: DWLRStation;
}

export const CropAdvisoryCard: React.FC<CropAdvisoryCardProps> = ({ station }) => {
  const { language, t } = useApp();
  const [selectedSeason, setSelectedSeason] = useState<'All' | 'Kharif' | 'Rabi'>('All');

  const { recommendedCrops, highRiskCrops } = getCropAdvisories(station);

  const filteredRecommended = recommendedCrops.filter(
    (c) => selectedSeason === 'All' || c.season === selectedSeason || c.season === 'Perennial'
  );

  const filteredHighRisk = highRiskCrops.filter(
    (c) => selectedSeason === 'All' || c.season === selectedSeason || c.season === 'Perennial'
  );

  const getWaterBadge = (req: CropRecommendation['waterRequirement']) => {
    switch (req) {
      case 'very_low':
        return { label: 'Very Low (<300mm)', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'low':
        return { label: 'Low (300-500mm)', class: 'bg-teal-50 text-teal-700 border-teal-200' };
      case 'medium':
        return { label: 'Medium (500-750mm)', class: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'high':
      case 'very_high':
      default:
        return { label: 'Heavy (>1200mm)', class: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-5">
      
      {/* Header & Season Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sprout className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t('cropAdvisoryTitle')}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('cropAdvisorySubtitle')}
          </p>
        </div>

        {/* Season Filter Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          {(['All', 'Kharif', 'Rabi'] as const).map((season) => (
            <button
              key={season}
              onClick={() => setSelectedSeason(season)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedSeason === season
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {season === 'All' ? 'All Seasons' : season}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Crops Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{t('recommendedCrops')} ({filteredRecommended.length})</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecommended.map((crop) => {
            const waterBadge = getWaterBadge(crop.waterRequirement);
            const cropName = crop.name[language] || crop.name.en;
            const advisory = crop.advisoryNote[language] || crop.advisoryNote.en;

            return (
              <div
                key={crop.id}
                className="bg-slate-50/70 border border-slate-200/90 hover:border-emerald-500/50 rounded-2xl p-4 transition shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{cropName}</h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Season: {crop.season} • {crop.durationDays} Days
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${waterBadge.class}`}>
                      {waterBadge.label}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                    {advisory}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-200/80 pt-2.5">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t('profitEstimate')}</span>
                    <span className="font-bold text-emerald-700 text-xs">
                      {crop.estimatedNetProfitPerAcre}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t('irrigationMethod')}</span>
                    <span className="font-medium text-slate-700 text-[11px] truncate block" title={crop.irrigationMethod}>
                      {crop.irrigationMethod}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* High-Risk / Discouraged Crops */}
      {filteredHighRisk.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-rose-600">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>{t('highRiskCrops')} — Strictly Discouraged for this Groundwater Level</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHighRisk.map((crop) => {
              const cropName = crop.name[language] || crop.name.en;
              const advisory = crop.advisoryNote[language] || crop.advisoryNote.en;

              return (
                <div
                  key={crop.id}
                  className="bg-rose-50/50 border border-rose-200 rounded-2xl p-4 space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-bold text-rose-900">{cropName}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                      High Risk ({crop.waterRequirementMm}mm)
                    </span>
                  </div>

                  <p className="text-xs text-rose-800 leading-relaxed bg-white p-3 rounded-xl border border-rose-100">
                    {advisory}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
