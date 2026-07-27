import { NavLink, Link } from 'react-router-dom';
import { Languages, Home, Play, LayoutGrid, Settings, Globe } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/play', label: 'Play', icon: Play },
  { to: '/categories', label: 'Categories', icon: LayoutGrid },
  { to: '/languages', label: 'Languages', icon: Languages },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <Globe className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-slate-900">
            Lingua<span className="text-teal-600">Match</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <nav className="flex items-center justify-around border-t border-slate-100 px-2 py-1.5 md:hidden">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-teal-600' : 'text-slate-500'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
