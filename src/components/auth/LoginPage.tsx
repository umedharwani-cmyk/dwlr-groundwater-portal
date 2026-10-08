import React, { useMemo, useState } from 'react';
import { loginGov } from '../../services/govApi';
import { useApp } from '../../context/AppContext';
import { initialDWLRStations } from '../../data/dwlrStationsData';
import { AuthUser } from '../../types';
import { registerFarmer, loginFarmer } from '../../services/farmerApi';
import {
  Droplet,
  Sprout,
  Landmark,
  ArrowRight,
  Lock,
  Phone,
  User,
  MapPin,
  IdCard,
  Building2,
  CheckCircle2,
  Waves,
  Gauge,
  ShieldCheck,
  Loader2
} from 'lucide-react';

type Portal = 'farmer' | 'government';
type FarmerMode = 'login' | 'register';

const districtsByState = initialDWLRStations.reduce<Record<'rajasthan' | 'tamil_nadu', string[]>>(
  (acc, s) => {
    if (!acc[s.state].includes(s.district)) acc[s.state].push(s.district);
    return acc;
  },
  { rajasthan: [], tamil_nadu: [] }
);

const inputClasses =
  'w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition';

const fieldWrap = 'relative';
const iconWrap = 'absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none';

const HERO_COPY: Record<Portal, { title: string; blurb: string; points: string[] }> = {
  farmer: {
    title: 'Krishi Mitra, for every drop you draw.',
    blurb:
      'See your local well depth in plain language, get crop advisories matched to groundwater availability, and know your safe pumping window before you switch on the motor.',
    points: [
      'Hyper-local well depth in meters, updated live',
      'Crop & irrigation advisory for your district',
      'Alerts before your tube-well runs critical'
    ]
  },
  government: {
    title: 'State-wide DWLR command, in one screen.',
    blurb:
      'Track every telemetry station across Rajasthan and Tamil Nadu, rank blocks by extraction stress, and generate replenishment action plans backed by live data.',
    points: [
      'Live surveillance across the full DWLR network',
      'Priority ranking for over-exploited blocks',
      'AI-assisted replenishment & policy simulation'
    ]
  }
};

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [portal, setPortal] = useState<Portal>('farmer');
  const [farmerMode, setFarmerMode] = useState<FarmerMode>('login');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Farmer login fields
  const [fLoginPhone, setFLoginPhone] = useState('');
  const [fLoginPassword, setFLoginPassword] = useState('');

  // Farmer register fields
  const [fName, setFName] = useState('');
  const [fPhone, setFPhone] = useState('');
  const [fState, setFState] = useState<'rajasthan' | 'tamil_nadu'>('rajasthan');
  const [fDistrict, setFDistrict] = useState(districtsByState.rajasthan[0] || '');
  const [fPassword, setFPassword] = useState('');
  const [fConfirm, setFConfirm] = useState('');

  // Government login fields
  const [gEmployeeId, setGEmployeeId] = useState('');
  const [gDepartment, setGDepartment] = useState('Groundwater Department');
  const [gPassword, setGPassword] = useState('');

  const districtOptions = useMemo(() => districtsByState[fState] || [], [fState]);

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  // --- Farmer Login: calls the real backend (farmer_details table) ---
  const handleFarmerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (!/^\d{10}$/.test(fLoginPhone.trim())) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    if (fLoginPassword.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setLoading(true);
    try {
      const user = await loginFarmer({
        phone: fLoginPhone.trim(),
        password: fLoginPassword
      });
      login({ role: 'farmer', ...user });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- Farmer Register: calls the real backend (farmer_details table) ---
  const handleFarmerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (fName.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^\d{10}$/.test(fPhone.trim())) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    if (!fDistrict) {
      setError('Please select your district.');
      return;
    }
    if (fPassword.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    if (fPassword !== fConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const user = await registerFarmer({
        name: fName.trim(),
        phone: fPhone.trim(),
        password: fPassword,
        state: fState,
        district: fDistrict
      });
      setSuccess('Account created — signing you in…');
      login({ role: 'farmer', ...user });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- Government Login: still local/mock until the gov_officials backend is built ---
const handleGovLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  resetMessages();
  if (gEmployeeId.trim().length < 3) {
    setError('Enter your official Employee / Officer ID.');
    return;
  }
  if (gPassword.length < 4) {
    setError('Password must be at least 4 characters.');
    return;
  }

  setLoading(true);
  try {
    const user = await loginGov({
      employeeId: gEmployeeId.trim(),
      password: gPassword
    });
    login({ role: 'government', ...user });
  } catch (err: any) {
    setError(err.message || 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const copy = HERO_COPY[portal];

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Hero / Brand Panel */}
      <div className="relative hidden lg:flex lg:w-[46%] flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 text-white px-12 py-12">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <Waves className="pointer-events-none absolute bottom-10 right-10 w-40 h-40 text-white/5" strokeWidth={1} />

        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
            <Droplet className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <p className="text-base font-bold tracking-tight leading-none">Jal Drishti</p>
            <p className="text-[11px] text-blue-200 mt-0.5">DWLR Ground Water Evaluation</p>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-flex items-center space-x-1.5 text-[11px] font-semibold px-3 py-1 rounded-full bg-white/10 border border-white/15 text-blue-100">
            {portal === 'farmer' ? <Sprout className="w-3.5 h-3.5" /> : <Landmark className="w-3.5 h-3.5" />}
            <span>{portal === 'farmer' ? 'Farmer Portal' : 'Government Command Center'}</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight">{copy.title}</h1>
          <p className="text-sm text-blue-100/90 leading-relaxed">{copy.blurb}</p>

          <ul className="space-y-2.5 pt-2">
            {copy.points.map((point) => (
              <li key={point} className="flex items-start space-x-2.5 text-sm text-blue-50/95">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-300" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 flex items-center space-x-6 text-[11px] text-blue-200/80">
          <div className="flex items-center space-x-1.5">
            <Gauge className="w-3.5 h-3.5" />
            <span>Live telemetry across RJ & TN</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Central Ground Water Board data</span>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10">
        <div className="w-full max-w-md">
          {/* Mobile brand header */}
          <div className="flex lg:hidden items-center space-x-2.5 mb-8 justify-center">
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center shadow-xs">
              <Droplet className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-base font-bold text-slate-800 tracking-tight">Jal Drishti</span>
          </div>

          {/* Portal Switch */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => {
                setPortal('farmer');
                resetMessages();
              }}
              className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                portal === 'farmer'
                  ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-emerald-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sprout className="w-4 h-4" />
              <span>Farmer</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setPortal('government');
                resetMessages();
              }}
              className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                portal === 'government'
                  ? 'bg-white text-blue-700 shadow-xs ring-1 ring-blue-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Landmark className="w-4 h-4" />
              <span>Government</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-7">
            {portal === 'farmer' ? (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {farmerMode === 'login' ? 'Welcome back' : 'Create your account'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {farmerMode === 'login'
                        ? 'Sign in to your Krishi Mitra advisory dashboard'
                        : 'Register with your district to get local advisories'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Sprout className="w-5 h-5" />
                  </div>
                </div>

                {/* Farmer Login / Register Sub-tabs */}
                <div className="flex items-center space-x-1 mb-5 bg-slate-50 border border-slate-200 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setFarmerMode('login');
                      resetMessages();
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                      farmerMode === 'login'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFarmerMode('register');
                      resetMessages();
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                      farmerMode === 'register'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Register
                  </button>
                </div>

                {farmerMode === 'login' ? (
                  <form className="space-y-4" onSubmit={handleFarmerLogin}>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Mobile Number</label>
                      <div className={fieldWrap}>
                        <Phone className={iconWrap} />
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          placeholder="98765 43210"
                          value={fLoginPhone}
                          onChange={(e) => setFLoginPhone(e.target.value.replace(/\D/g, ''))}
                          className={inputClasses}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Password</label>
                      <div className={fieldWrap}>
                        <Lock className={iconWrap} />
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={fLoginPassword}
                          onChange={(e) => setFLoginPassword(e.target.value)}
                          className={inputClasses}
                        />
                      </div>
                    </div>

                    {error && <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-xs transition"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Sign In to Farmer Portal</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-slate-500">
                      New here?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setFarmerMode('register');
                          resetMessages();
                        }}
                        className="font-semibold text-emerald-700 hover:underline"
                      >
                        Create a free account
                      </button>
                    </p>
                  </form>
                ) : (
                  <form className="space-y-4" onSubmit={handleFarmerRegister}>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Full Name</label>
                      <div className={fieldWrap}>
                        <User className={iconWrap} />
                        <input
                          type="text"
                          placeholder="e.g. Ramesh Choudhary"
                          value={fName}
                          onChange={(e) => setFName(e.target.value)}
                          className={inputClasses}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Mobile Number</label>
                      <div className={fieldWrap}>
                        <Phone className={iconWrap} />
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          placeholder="98765 43210"
                          value={fPhone}
                          onChange={(e) => setFPhone(e.target.value.replace(/\D/g, ''))}
                          className={inputClasses}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 mb-1.5 block">State</label>
                        <div className={fieldWrap}>
                          <MapPin className={iconWrap} />
                          <select
                            value={fState}
                            onChange={(e) => {
                              const st = e.target.value as 'rajasthan' | 'tamil_nadu';
                              setFState(st);
                              setFDistrict(districtsByState[st][0] || '');
                            }}
                            className={`${inputClasses} appearance-none cursor-pointer`}
                          >
                            <option value="rajasthan">Rajasthan</option>
                            <option value="tamil_nadu">Tamil Nadu</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 mb-1.5 block">District</label>
                        <select
                          value={fDistrict}
                          onChange={(e) => setFDistrict(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition cursor-pointer appearance-none"
                        >
                          {districtOptions.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Password</label>
                        <div className={fieldWrap}>
                          <Lock className={iconWrap} />
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={fPassword}
                            onChange={(e) => setFPassword(e.target.value)}
                            className={inputClasses}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Confirm</label>
                        <div className={fieldWrap}>
                          <Lock className={iconWrap} />
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={fConfirm}
                            onChange={(e) => setFConfirm(e.target.value)}
                            className={inputClasses}
                          />
                        </div>
                      </div>
                    </div>

                    {error && <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">{error}</p>}
                    {success && (
                      <p className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                        {success}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-xs transition"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-slate-500">
                      Already registered?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setFarmerMode('login');
                          resetMessages();
                        }}
                        className="font-semibold text-emerald-700 hover:underline"
                      >
                        Log in instead
                      </button>
                    </p>
                  </form>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Government Sign In</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Restricted access for authorized officials</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-blue-100/80 text-blue-700 flex items-center justify-center flex-shrink-0">
                    <Landmark className="w-5 h-5" />
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleGovLogin}>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Employee / Officer ID</label>
                    <div className={fieldWrap}>
                      <IdCard className={iconWrap} />
                      <input
                        type="text"
                        placeholder="e.g. GWD-RJ-1042"
                        value={gEmployeeId}
                        onChange={(e) => setGEmployeeId(e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Department</label>
                    <div className={fieldWrap}>
                      <Building2 className={iconWrap} />
                      <select
                        value={gDepartment}
                        onChange={(e) => setGDepartment(e.target.value)}
                        className={`${inputClasses} appearance-none cursor-pointer`}
                      >
                        <option>Groundwater Department</option>
                        <option>Central Ground Water Board</option>
                        <option>State Irrigation Department</option>
                        <option>District Administration</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Password</label>
                    <div className={fieldWrap}>
                      <Lock className={iconWrap} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={gPassword}
                        onChange={(e) => setGPassword(e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  {error && <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">{error}</p>}

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs transition"
                  >
                    <span>Sign In to Command Center</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-start space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                    <ShieldCheck className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Government accounts are provisioned by your department administrator. Self-registration is not
                      available for official access — contact your Groundwater Department IT cell for credentials.
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>

          <p className="text-center text-[11px] text-slate-400 mt-6">
            Jal Drishti · DWLR Ground Water Evaluation Platform
          </p>
        </div>
      </div>
    </div>
  );
};