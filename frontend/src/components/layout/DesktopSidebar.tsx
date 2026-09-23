import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  Calendar,
  LogOut,
  UserCheck,
  CalendarCheck,
  CheckSquare,
  Clock,
  MessageSquareWarning,
  ShieldAlert,
  Megaphone,
  TrendingUp,
  IndianRupee,
  BarChart3,
  PieChart,
  Building2,
  UserCog,
  ShieldCheck,
  FileText,
  User,
  Settings,
  Crown,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { getAuthorizedSections, NavItemConfig } from '@/routes/rolePermissions';
import { mockStore } from '@/services/mock/mockStore';
import { cn } from '@/lib/utils';

export const DesktopSidebar: React.FC = () => {
  const { permissions, logout } = useAuth();
  const navigate = useNavigate();

  const sections = getAuthorizedSections(permissions);

  // Live badge counts from mockStore
  const state = mockStore.getState();
  const pendingLeaves =
    (state.superDLeaveRequests?.filter((r) => r.status === 'Pending').length || 0) +
    (state.leaveRequests?.filter((r) => r.status === 'SUBMITTED').length || 0);
  const pendingGrievances =
    state.superDGrievances?.filter((g) => g.status === 'Pending').length || 0;
  const pendingDischarges =
    state.superDDischarges?.filter((d) => d.status === 'Admitted').length || 0;

  const getBadgeValue = (key?: string): number => {
    if (key === 'pendingLeaves') return pendingLeaves;
    if (key === 'pendingGrievances') return pendingGrievances;
    if (key === 'pendingDischarges') return pendingDischarges;
    return 0;
  };

  const getIcon = (name: string, className: string = 'w-4 h-4') => {
    switch (name) {
      case 'Home':
        return <Home className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      case 'Users':
        return <Users className={className} />;
      case 'Calendar':
        return <Calendar className={className} />;
      case 'LogOut':
        return <LogOut className={className} />;
      case 'UserCheck':
        return <UserCheck className={className} />;
      case 'CalendarCheck':
        return <CalendarCheck className={className} />;
      case 'CheckSquare':
        return <CheckSquare className={className} />;
      case 'Clock':
        return <Clock className={className} />;
      case 'MessageSquareWarning':
        return <MessageSquareWarning className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Megaphone':
        return <Megaphone className={className} />;
      case 'TrendingUp':
        return <TrendingUp className={className} />;
      case 'IndianRupee':
        return <IndianRupee className={className} />;
      case 'BarChart3':
        return <BarChart3 className={className} />;
      case 'PieChart':
        return <PieChart className={className} />;
      case 'Building2':
        return <Building2 className={className} />;
      case 'UserCog':
        return <UserCog className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'FileText':
        return <FileText className={className} />;
      case 'User':
        return <User className={className} />;
      case 'Settings':
        return <Settings className={className} />;
      default:
        return <Home className={className} />;
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out of the Super D session?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <aside className="w-64 bg-[#f8fafc] text-slate-800 shrink-0 flex flex-col border-r border-slate-200 h-screen sticky top-0 select-none overflow-y-auto hidden md:flex">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-200 shrink-0 bg-white/80 backdrop-blur-xs">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#123B5D] via-[#1d4ed8] to-[#0d6efd] flex items-center justify-center shadow-md shadow-blue-500/20">
          <span className="font-extrabold text-white text-xl tracking-tighter italic">S</span>
        </div>
        <div className="flex flex-col">
          <h1 className="font-extrabold text-lg tracking-tight text-[#123B5D] leading-none">
            Super D
          </h1>
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
            Hospital System
          </span>
        </div>
      </div>

      {/* Main Grouped Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-4">
        {sections.map((section) => (
          <div key={section.sectionTitle} className="space-y-1">
            {sections.length > 1 && (
              <div className="px-3 pb-1 pt-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400">
                {section.sectionTitle}
              </div>
            )}
            {section.items.map((item: NavItemConfig) => {
              const badge = getBadgeValue(item.badgeKey);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-[#123B5D] text-white font-semibold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={cn('shrink-0', isActive ? 'text-white' : 'text-slate-500')}>
                          {getIcon(item.iconName, 'w-4 h-4')}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {badge > 0 && (
                        <span
                          className={cn(
                            'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                            isActive ? 'bg-white text-[#123B5D]' : 'bg-amber-100 text-amber-800'
                          )}
                        >
                          {badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}

        {/* Separator before bottom utility links */}
        <div className="pt-2 border-t border-slate-200/80 space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold tracking-wider uppercase text-slate-400">
            Account
          </div>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-[#123B5D] text-white font-semibold'
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

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-[#123B5D] text-white font-semibold'
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

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all text-left"
          >
            <LogOut className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </nav>

      {/* Hospital Building Illustration Watermark & Footer */}
      <div className="p-4 pt-1 border-t border-slate-200 shrink-0 bg-gradient-to-b from-transparent to-blue-50/30">
        <div className="w-full h-20 mb-2 overflow-hidden rounded-lg flex items-end justify-center opacity-80">
          <svg viewBox="0 0 240 100" className="w-full h-full text-blue-200/80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 95 L10 40 L60 40 L60 95 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M180 95 L180 40 L230 40 L230 95 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M50 95 L50 20 L190 20 L190 95 Z" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.2" />
            <path d="M50 20 L120 5 L190 20 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
            <circle cx="120" cy="35" r="9" fill="#123B5D" fillOpacity="0.15" />
            <path d="M120 29 L120 41 M114 35 L126 35" stroke="#123B5D" strokeWidth="2.5" strokeLinecap="round" />
            <g stroke="#93c5fd" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.85">
              <line x1="65" y1="50" x2="175" y2="50" />
              <line x1="65" y1="65" x2="175" y2="65" />
              <line x1="65" y1="80" x2="175" y2="80" />
            </g>
            <circle cx="25" cy="85" r="8" fill="#a7f3d0" opacity="0.7" />
            <circle cx="38" cy="88" r="6" fill="#6ee7b7" opacity="0.7" />
            <circle cx="205" cy="85" r="8" fill="#a7f3d0" opacity="0.7" />
            <circle cx="218" cy="88" r="6" fill="#6ee7b7" opacity="0.7" />
            <line x1="0" y1="95" x2="240" y2="95" stroke="#94a3b8" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="space-y-0.5 mb-2">
          <p className="text-[11px] font-semibold text-slate-500 tracking-wide leading-tight">
            Compassion • Care • Community
          </p>
          <div className="w-6 h-0.5 bg-[#123B5D] rounded-full mt-1" />
        </div>

        <div className="text-[10px] text-slate-400 font-medium">
          <div>© 2026 Super D Healthcare</div>
          <div>Multi-Branch Hospital Platform</div>
        </div>
      </div>
    </aside>
  );
};
