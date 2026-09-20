import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  IndianRupee,
  Menu,
  X,
  Building2,
  Clock,
  MessageSquareWarning,
  Megaphone,
  FileBarChart,
  UserCog,
  KeyRound,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { cn } from '@/lib/utils';

export const MobileNav: React.FC = () => {
  const { currentRole, canAccessRoute } = useAuth();
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);

  // Pick top 4 items according to role
  const getPrimaryItems = () => {
    if (currentRole === 'Hospital Owner') {
      return [
        { label: 'Dashboard', path: '/dashboards/owner', icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: 'Patients', path: '/patients', icon: <Users className="w-5 h-5" /> },
        { label: 'Appts', path: '/appointments', icon: <Calendar className="w-5 h-5" /> },
        { label: 'Revenue', path: '/finance', icon: <IndianRupee className="w-5 h-5" /> },
      ];
    }
    if (currentRole === 'Global Admin') {
      return [
        { label: 'Admin', path: '/dashboards/admin', icon: <ShieldCheck className="w-5 h-5" /> },
        { label: 'Users', path: '/users', icon: <UserCog className="w-5 h-5" /> },
        { label: 'Roles', path: '/roles', icon: <KeyRound className="w-5 h-5" /> },
        { label: 'Branches', path: '/branches', icon: <Building2 className="w-5 h-5" /> },
      ];
    }
    if (currentRole === 'Doctor') {
      return [
        { label: 'Appts', path: '/appointments', icon: <Calendar className="w-5 h-5" /> },
        { label: 'Patients', path: '/patients', icon: <Users className="w-5 h-5" /> },
        { label: 'My Leaves', path: '/leave', icon: <Clock className="w-5 h-5" /> },
      ];
    }
    if (currentRole === 'HR Manager') {
      return [
        { label: 'Employees', path: '/employees', icon: <UserCheck className="w-5 h-5" /> },
        { label: 'Leaves', path: '/leave', icon: <Clock className="w-5 h-5" /> },
      ];
    }
    if (currentRole === 'Finance Manager') {
      return [
        { label: 'Revenue', path: '/finance', icon: <IndianRupee className="w-5 h-5" /> },
        { label: 'Reports', path: '/reports', icon: <FileBarChart className="w-5 h-5" /> },
      ];
    }
    if (currentRole === 'Marketing Manager') {
      return [
        { label: 'Marketing', path: '/marketing', icon: <Megaphone className="w-5 h-5" /> },
        { label: 'Reports', path: '/reports', icon: <FileBarChart className="w-5 h-5" /> },
      ];
    }
    if (currentRole === 'Complaints and Query Manager') {
      return [
        { label: 'Complaints', path: '/complaints', icon: <MessageSquareWarning className="w-5 h-5" /> },
      ];
    }
    // Receptionist / default
    return [
      { label: 'Patients', path: '/patients', icon: <Users className="w-5 h-5" /> },
      { label: 'Appts', path: '/appointments', icon: <Calendar className="w-5 h-5" /> },
    ];
  };

  const allSecondaryItems = [
    { label: 'Owner Dashboard', path: '/dashboards/owner', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Admin Dashboard', path: '/dashboards/admin', icon: <ShieldCheck className="w-5 h-5" /> },
    { label: 'Branch Management', path: '/branches', icon: <Building2 className="w-5 h-5" /> },
    { label: 'Patient Directory', path: '/patients', icon: <Users className="w-5 h-5" /> },
    { label: 'Appointments Calendar', path: '/appointments', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Employee Staff', path: '/employees', icon: <UserCheck className="w-5 h-5" /> },
    { label: 'Leave Approvals', path: '/leave', icon: <Clock className="w-5 h-5" /> },
    { label: 'Complaints & Queries', path: '/complaints', icon: <MessageSquareWarning className="w-5 h-5" /> },
    { label: 'Marketing & Campaigns', path: '/marketing', icon: <Megaphone className="w-5 h-5" /> },
    { label: 'Finance & Revenue', path: '/finance', icon: <IndianRupee className="w-5 h-5" /> },
    { label: 'Reports & Export', path: '/reports', icon: <FileBarChart className="w-5 h-5" /> },
    { label: 'User Management', path: '/users', icon: <UserCog className="w-5 h-5" /> },
    { label: 'Roles & Permissions', path: '/roles', icon: <KeyRound className="w-5 h-5" /> },
  ];

  const primaryItems = getPrimaryItems();
  const accessibleSecondary = allSecondaryItems.filter((i) => canAccessRoute(i.path));

  return (
    <>
      {/* Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-surface-border h-16 flex items-center justify-around z-30 md:hidden px-2 shadow-lg">
        {primaryItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center min-w-[56px] h-full transition-colors text-[10px] font-medium',
                isActive ? 'text-brand-blue font-semibold' : 'text-text-secondary hover:text-text-main'
              )
            }
          >
            <span className="mb-0.5">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* More Button */}
        <button
          onClick={() => setMoreDrawerOpen(true)}
          className="flex flex-col items-center justify-center min-w-[56px] h-full text-text-secondary hover:text-text-main text-[10px] font-medium"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </nav>

      {/* "More" Bottom Sheet / Slide-up Drawer */}
      {moreDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in">
          <div
            className="fixed inset-0 bg-navy-900/60 backdrop-blur-xs"
            onClick={() => setMoreDrawerOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl border-t border-surface-border p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-text-main">Navigation Menu</h3>
                <p className="text-xs text-brand-blue font-medium">Logged in as {currentRole}</p>
              </div>
              <button
                onClick={() => setMoreDrawerOpen(false)}
                className="p-2 rounded-lg text-text-secondary hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {accessibleSecondary.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMoreDrawerOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 border-brand-blue text-brand-blue font-semibold'
                        : 'border-surface-border text-text-main hover:bg-slate-50'
                    )
                  }
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
