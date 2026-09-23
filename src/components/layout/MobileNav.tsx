import React, { useState } from 'react';
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
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { ROLE_SIDEBAR_ITEMS } from '@/routes/rolePermissions';
import { cn } from '@/lib/utils';

export const MobileNav: React.FC = () => {
  const { currentRole } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = ROLE_SIDEBAR_ITEMS[currentRole] || ROLE_SIDEBAR_ITEMS['Super Admin'] || [];

  const getIcon = (name: string, className: string = 'w-5 h-5') => {
    switch (name) {
      case 'Home':
        return <Home className={className} />;
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

  // Up to 4 direct tabs on mobile bar + "Menu" drawer toggle
  const primaryTabs = navItems.slice(0, 4);

  return (
    <>
      {/* Fixed bottom navigation bar for mobile / small screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 z-30 shadow-lg">
        {primaryTabs.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors',
                isActive ? 'text-[#123B5D] font-bold' : 'text-slate-500 hover:text-slate-900'
              )
            }
          >
            {getIcon(item.iconName, 'w-5 h-5')}
            <span className="truncate max-w-[65px] mt-0.5">{item.label}</span>
          </NavLink>
        ))}

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 text-[10px] font-medium text-slate-500 hover:text-slate-900"
        >
          <Menu className="w-5 h-5" />
          <span className="mt-0.5">More</span>
        </button>
      </div>

      {/* Slide-over menu for all items */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="relative ml-auto w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 p-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#123B5D] text-white flex items-center justify-center font-extrabold text-sm italic">
                  S
                </div>
                <div>
                  <h2 className="font-bold text-sm text-[#123B5D]">Super D Hospital</h2>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">{currentRole}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="py-4 space-y-1.5 flex-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      isActive ? 'bg-[#123B5D] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    )
                  }
                >
                  {getIcon(item.iconName)}
                  <span>{item.label}</span>
                </NavLink>
              ))}

              <div className="pt-3 border-t border-slate-100 space-y-1">
                <NavLink
                  to="/profile"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-100"
                >
                  <User className="w-5 h-5 text-slate-500" />
                  <span>Profile</span>
                </NavLink>
                <NavLink
                  to="/settings"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-100"
                >
                  <Settings className="w-5 h-5 text-slate-500" />
                  <span>Settings</span>
                </NavLink>
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-5 h-5 text-rose-500" />
                  <span>Log out</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
