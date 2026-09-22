import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Megaphone,
  BarChart3,
  LogOut,
  CalendarCheck,
  MessageSquareWarning,
  IndianRupee,
  User,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { ROLE_SIDEBAR_ITEMS, BOTTOM_SIDEBAR_ITEMS } from '@/routes/rolePermissions';
import { cn } from '@/lib/utils';

export const DesktopSidebar: React.FC = () => {
  const { currentRole, switchRole } = useAuth();
  const navigate = useNavigate();

  const navItems = ROLE_SIDEBAR_ITEMS[currentRole] || ROLE_SIDEBAR_ITEMS['Super Admin'] || [];

  const getIcon = (name: string, className: string = 'w-5 h-5') => {
    switch (name) {
      case 'Home':
        return <Home className={className} />;
      case 'Megaphone':
        return <Megaphone className={className} />;
      case 'BarChart3':
        return <BarChart3 className={className} />;
      case 'LogOut':
        return <LogOut className={className} />;
      case 'CalendarCheck':
        return <CalendarCheck className={className} />;
      case 'MessageSquareWarning':
        return <MessageSquareWarning className={className} />;
      case 'IndianRupee':
        return <IndianRupee className={className} />;
      case 'User':
        return <User className={className} />;
      case 'Settings':
        return <Settings className={className} />;
      default:
        return <Home className={className} />;
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of the Super D demo session?')) {
      navigate('/login');
    }
  };

  return (
    <aside className="w-64 bg-[#f8fafc] text-slate-800 shrink-0 flex flex-col border-r border-slate-200 h-screen sticky top-0 select-none overflow-y-auto hidden md:flex">
      {/* Super D Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-200 shrink-0 bg-white/70 backdrop-blur-xs">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0d6efd] via-[#1d4ed8] to-[#0284c7] flex items-center justify-center shadow-md shadow-blue-500/25">
          <span className="font-extrabold text-white text-xl tracking-tighter italic">S</span>
        </div>
        <div className="flex flex-col">
          <h1 className="font-extrabold text-lg tracking-tight text-[#0f172a] leading-none">
            Super D
          </h1>
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
            Hospital System
          </span>
        </div>
      </div>

      {/* Main Role-Specific Navigation Links */}
      <nav className="flex-1 py-5 px-3 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-[#0d6efd] text-white font-semibold shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={cn('shrink-0', isActive ? 'text-white' : 'text-slate-500')}>
                  {getIcon(item.iconName, 'w-4 h-4')}
                </span>
                <span className="truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Separator before bottom utility links */}
        <div className="pt-3 my-2 border-t border-slate-200/80 space-y-1.5">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-[#0d6efd] text-white font-semibold shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={cn('shrink-0', isActive ? 'text-white' : 'text-slate-500')}>
                  <User className="w-4 h-4" />
                </span>
                <span>Profile</span>
              </>
            )}
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all text-left"
          >
            <LogOut className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-rose-600" />
            <span>Log out</span>
          </button>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-[#0d6efd] text-white font-semibold shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={cn('shrink-0', isActive ? 'text-white' : 'text-slate-500')}>
                  <Settings className="w-4 h-4" />
                </span>
                <span>Settings</span>
              </>
            )}
          </NavLink>
        </div>
      </nav>

      {/* Hospital Building Illustration Watermark & Footer */}
      <div className="p-4 pt-1 border-t border-slate-200 shrink-0 bg-gradient-to-b from-transparent to-blue-50/40">
        {/* Architectural Hospital SVG Watermark */}
        <div className="w-full h-24 mb-2 overflow-hidden rounded-lg flex items-end justify-center opacity-85">
          <svg
            viewBox="0 0 240 100"
            className="w-full h-full text-blue-200/80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background hospital wings */}
            <path
              d="M10 95 L10 40 L60 40 L60 95 Z"
              fill="#e2e8f0"
              stroke="#cbd5e1"
              strokeWidth="1"
            />
            <path
              d="M180 95 L180 40 L230 40 L230 95 Z"
              fill="#e2e8f0"
              stroke="#cbd5e1"
              strokeWidth="1"
            />
            {/* Main Central Tower */}
            <path
              d="M50 95 L50 20 L190 20 L190 95 Z"
              fill="#f1f5f9"
              stroke="#94a3b8"
              strokeWidth="1.2"
            />
            {/* Roof pediment */}
            <path
              d="M50 20 L120 5 L190 20 Z"
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="1"
            />
            {/* Hospital Cross Logo on facade */}
            <circle cx="120" cy="35" r="9" fill="#0d6efd" fillOpacity="0.15" />
            <path
              d="M120 29 L120 41 M114 35 L126 35"
              stroke="#0d6efd"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Glass curtain wall window grid */}
            <g stroke="#93c5fd" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.85">
              <line x1="65" y1="50" x2="175" y2="50" />
              <line x1="65" y1="65" x2="175" y2="65" />
              <line x1="65" y1="80" x2="175" y2="80" />
              <line x1="85" y1="45" x2="85" y2="95" />
              <line x1="110" y1="45" x2="110" y2="95" />
              <line x1="130" y1="45" x2="130" y2="95" />
              <line x1="155" y1="45" x2="155" y2="95" />
            </g>
            {/* Ground trees / landscaping */}
            <circle cx="25" cy="85" r="8" fill="#a7f3d0" opacity="0.7" />
            <circle cx="38" cy="88" r="6" fill="#6ee7b7" opacity="0.7" />
            <circle cx="205" cy="85" r="8" fill="#a7f3d0" opacity="0.7" />
            <circle cx="218" cy="88" r="6" fill="#6ee7b7" opacity="0.7" />
            {/* Foundation line */}
            <line x1="0" y1="95" x2="240" y2="95" stroke="#94a3b8" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Motto & Tagline */}
        <div className="space-y-0.5 mb-2.5">
          <p className="text-[12px] font-semibold text-slate-500 tracking-wide leading-tight">
            Compassion
          </p>
          <p className="text-[12px] font-semibold text-slate-500 tracking-wide leading-tight">
            Care
          </p>
          <p className="text-[12px] font-semibold text-slate-500 tracking-wide leading-tight">
            Community
          </p>
          <div className="w-6 h-0.5 bg-[#0d6efd] rounded-full mt-1.5" />
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-slate-400 font-medium">
          <div>© 2026 Super D</div>
          <div className="text-[10px]">All rights reserved.</div>
        </div>
      </div>
    </aside>
  );
};
