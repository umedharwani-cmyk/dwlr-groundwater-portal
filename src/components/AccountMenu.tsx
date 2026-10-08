import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, Sprout, Landmark, MapPin, Building2 } from 'lucide-react';

interface AccountMenuProps {
  trigger: React.ReactNode;
  align?: 'left' | 'right';
  direction?: 'up' | 'down';
}

export const AccountMenu: React.FC<AccountMenuProps> = ({ trigger, align = 'right', direction = 'down' }) => {
  const { currentUser, role, logout } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>

      {open && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} ${
            direction === 'up' ? 'bottom-[calc(100%+0.5rem)]' : 'top-[calc(100%+0.5rem)]'
          } w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-fade-in`}
        >
          <div className="flex items-center space-x-3 px-2 py-2">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                role === 'farmer' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
              }`}
            >
              {role === 'farmer' ? <Sprout className="w-5 h-5" /> : <Landmark className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {currentUser?.name || (role === 'farmer' ? 'Farmer' : 'Government Official')}
              </p>
              <p className="text-[11px] text-slate-500">
                {role === 'farmer' ? 'Farmer Portal' : currentUser?.department || 'Government Portal'}
              </p>
            </div>
          </div>

          {role === 'farmer' && currentUser?.district && (
            <div className="mt-2 mx-2 flex items-center space-x-1.5 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {currentUser.district}, {currentUser.state === 'tamil_nadu' ? 'Tamil Nadu' : 'Rajasthan'}
              </span>
            </div>
          )}
          {role === 'government' && currentUser?.employeeId && (
            <div className="mt-2 mx-2 flex items-center space-x-1.5 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-500" />
              <span>ID: {currentUser.employeeId}</span>
            </div>
          )}

          <div className="h-px bg-slate-100 my-2" />

          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
