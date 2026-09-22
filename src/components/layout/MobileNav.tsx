import React, { useState } from 'react';
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

  const getIcon = (name: string) => {
    switch (name) {
      case 'Home':
        return <Home className="w-5 h-5" />;
      case 'Megaphone':
        return <Megaphone className="w-5 h-5" />;
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5" />;
      case 'LogOut':
        return <LogOut className="w-5 h-5" />;
      case 'CalendarCheck':
        return <CalendarCheck className="w-5 h-5" />;
      case 'MessageSquareWarning':
        return <MessageSquareWarning className="w-5 h-5" />;
      case 'IndianRupee':
        return <IndianRupee className="w-5 h-5" />;
      case 'User':
        return <User className="w-5 h-5" />;
      case 'Settings':
        return <Settings className="w-5 h-5" />;
      default:
        return <Home className="w-5 h-5" />;
    }
  };

  // Up to 3 direct tabs on mobile bar + "More" drawer toggle
  const primaryTabs = navItems.slice(0, 3);

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
                'flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors',
                isActive ? 'text-[#0d6efd] font-bold' : 'text-slate-500 hover:text-slate-900'
              )
            }
          >
            {getIcon(item.iconName)}
            <span className="truncate max-w-[70px] mt-0.5">{item.label}</span>
          </NavLink>
        ))}

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium text-slate-500 hover:text-slate-900"
        >
          <Menu className="w-5 h-5" />
          <span className="mt-0.5">Menu</span>
        </button>
      </div>

      {/* Slide-over menu for remaining items */}
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
                <div className="w-8 h-8 rounded-lg bg-[#0d6efd] text-white flex items-center justify-center font-extrabold text-sm italic">
                  S
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-900">Super D</h2>
                  <p className="text-[10px] text-slate-500 uppercase">{currentRole}</p>
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
                      isActive ? 'bg-[#0d6efd] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
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
