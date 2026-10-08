import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Shield, 
  Sprout, 
  Landmark, 
  CheckCircle2, 
  X, 
  ArrowRight,
  MapPin,
  Sparkles
} from 'lucide-react';

export const RoleAuthModal: React.FC = () => {
  const { role, setRole, isAuthModalOpen, setIsAuthModalOpen, setActiveState, setFarmerDistrict, setActiveTab } = useApp();
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'government'>(role);
  const [selectedPreset, setSelectedPreset] = useState<string>('rj_farmer');

  if (!isAuthModalOpen) return null;

  const handleApply = () => {
    setRole(selectedRole);
    if (selectedRole === 'farmer') {
      setActiveTab('farmer');
      if (selectedPreset === 'rj_farmer') {
        setActiveState('rajasthan');
        setFarmerDistrict('Jodhpur');
      } else if (selectedPreset === 'tn_farmer') {
        setActiveState('tamil_nadu');
        setFarmerDistrict('Coimbatore');
      }
    } else {
      setActiveTab('dashboard');
    }
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Select User Profile & Role</h2>
              <p className="text-xs text-slate-500">Choose your profile to switch between Farmer Advisory and Government Command Center</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Farmer Card */}
            <div
              onClick={() => setSelectedRole('farmer')}
              className={`cursor-pointer relative p-5 rounded-2xl border transition-all ${
                selectedRole === 'farmer'
                  ? 'bg-emerald-50/70 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-3">
                  <Sprout className="w-6 h-6" />
                </div>
                {selectedRole === 'farmer' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900">Farmer / Krishi Mitra</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Hyper-local well depth meter, crop advisory recommendations matched to groundwater availability, and safe tube-well pumping calculator.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Crop Recommendations
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Borewell Pumping Limits
                </span>
              </div>
            </div>

            {/* Government Official Card */}
            <div
              onClick={() => setSelectedRole('government')}
              className={`cursor-pointer relative p-5 rounded-2xl border transition-all ${
                selectedRole === 'government'
                  ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-100/80 text-blue-700 flex items-center justify-center mb-3">
                  <Landmark className="w-6 h-6" />
                </div>
                {selectedRole === 'government' && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900">Government Official / Hydrologist</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                State-wide DWLR surveillance center, priority ranking matrix for running-out reserves, AI replenishment action plan generator, and policy simulator.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Priority Matrix Ranking
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Replenishment Projects
                </span>
              </div>
            </div>

          </div>

          {/* Quick Presets */}
          {selectedRole === 'farmer' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <label className="text-xs font-semibold text-slate-700">Quick Regional Farmer Persona:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedPreset('rj_farmer')}
                  className={`p-3 rounded-xl border text-left text-xs transition ${
                    selectedPreset === 'rj_farmer'
                      ? 'bg-white border-blue-500 shadow-xs'
                      : 'bg-white/60 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>Rajasthan Farmer</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Jodhpur (Osian) • Deep Water Table (78m) • Bajra/Mustard advisory
                  </p>
                </button>

                <button
                  onClick={() => setSelectedPreset('tn_farmer')}
                  className={`p-3 rounded-xl border text-left text-xs transition ${
                    selectedPreset === 'tn_farmer'
                      ? 'bg-white border-blue-500 shadow-xs'
                      : 'bg-white/60 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Tamil Nadu Farmer</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Coimbatore (Pollachi) • Hard Rock Aquifer (46m) • Ragi/Drip advisory
                  </p>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
          >
            <span>Proceed to {selectedRole === 'farmer' ? 'Farmer Portal' : 'Command Center'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
