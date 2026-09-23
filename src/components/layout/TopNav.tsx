import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronDown,
  Check,
  RotateCcw,
  LogOut,
  Shield,
  Building2,
  X,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useBranch } from '@/app/providers/BranchProvider';
import { RoleType, SuperDRole } from '@/types';
import { mockStore } from '@/services/mock/mockStore';

const OFFICIAL_SUPERD_ROLES: { role: SuperDRole; label: string; desc: string; initials: string }[] = [
  { role: 'Super Admin', label: 'Super Admin', desc: 'All Branches Governance', initials: 'SA' },
  { role: 'Admin', label: 'Admin', desc: 'Central HR & Grievance Admin', initials: 'AD' },
  { role: 'HR', label: 'HR Manager', desc: 'Cross-Branch Attendance Review', initials: 'HR' },
  { role: 'Branch Doctor', label: 'Branch Doctor', desc: 'Trichy Clinical & Discharges', initials: 'BD' },
  { role: 'Branch Manager', label: 'Branch Manager', desc: 'Trichy Operations & Approvals', initials: 'BM' },
  { role: 'Staff', label: 'Staff Member', desc: 'Trichy Ads & Accounts', initials: 'ST' },
  { role: 'Employee', label: 'Employee (Self-Service)', desc: 'Trichy Nursing Staff', initials: 'EM' },
];

interface TopNavProps {
  onMenuToggle?: () => void;
  onSearchOpen?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onMenuToggle, onSearchOpen }) => {
  const { currentUser, currentRole, switchRole, resetDemoData } = useAuth();
  const { branches, selectedBranchId, setSelectedBranchId, selectedBranch } = useBranch();
  const navigate = useNavigate();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);

  const notifications = mockStore.getState().notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const currentRoleInitials =
    OFFICIAL_SUPERD_ROLES.find((r) => r.role === currentRole)?.initials ||
    currentRole.slice(0, 2).toUpperCase();

  const handleRoleSwitch = (role: RoleType) => {
    switchRole(role);
    setRoleMenuOpen(false);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    if (window.confirm('Log out of Super D demo session?')) {
      navigate('/login');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 select-none shadow-2xs">
      {/* Left: Mobile / Collapse Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Interactive Branch Selector Dropdown */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <Building2 className="w-3.5 h-3.5 text-[#123B5D]" />
          <span className="text-slate-500 font-medium hidden sm:inline">Branch:</span>
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer text-xs"
            aria-label="Select Hospital Branch"
          >
            <option value="all">All Branches (Consolidated)</option>
            {branches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name} ({b.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Actions, Notifications & User/Role Dropdown */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifMenuOpen(!notifMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0d6efd] ring-2 ring-white" />
            )}
          </button>

          {notifMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">Notifications</span>
                <span className="text-[11px] text-[#0d6efd] font-semibold">
                  {unreadCount} unread
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {notifications.slice(0, 4).map((n) => (
                  <div key={n._id} className="p-3 text-xs hover:bg-slate-50">
                    <p className="font-semibold text-slate-800">{n.title}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Role Pill & Quick Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-100/80 transition-colors border border-slate-200/80"
          >
            <div className="w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-2xs">
              {currentRoleInitials}
            </div>
            <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
              {currentRole}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Role Dropdown Menu */}
          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
              {/* Authenticated Identity Header */}
              <div className="px-4 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-sm">
                    {currentRoleInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0d6efd] border border-blue-200">
                      {currentRole}
                    </span>
                  </div>
                </div>
              </div>

              {/* Persona Quick Switcher */}
              <div className="py-2 px-3">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Simulate Role (Demo Inspection)
                </div>
                <div className="space-y-1 mt-1">
                  {OFFICIAL_SUPERD_ROLES.map((r) => {
                    const isCurrent = currentRole === r.role;
                    return (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => handleRoleSwitch(r.role)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          isCurrent
                            ? 'bg-blue-50 text-[#0d6efd] font-bold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 text-[10px] font-bold text-slate-400">
                            {r.initials}
                          </span>
                          <span className="truncate">{r.label}</span>
                        </div>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-[#0d6efd] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Utility actions */}
              <div className="pt-2 px-3 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset all demo data back to clean baseline state?')) {
                      resetDemoData();
                    }
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Demo Seed Data</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
