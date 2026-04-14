import { NavLink, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/progress', label: 'Progress', Icon: TrendingUp },
  { to: '/settings', label: 'Settings', Icon: Settings },
];

export function BottomNav() {
  const location = useLocation();
  if (location.pathname === '/session' || location.pathname === '/onboarding') return null;

  return (
    <nav className="sticky bottom-0 z-40 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800">
      <div className="flex">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors ${
                isActive
                  ? 'text-amber-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
