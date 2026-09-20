import React, { useState, useEffect } from 'react';
import {
  Building2,
  Bell,
  ChevronDown,
  UserCheck,
  RotateCcw,
  Check,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useBranch } from '@/app/providers/BranchProvider';
import { RoleType } from '@/types';
import { mockStore } from '@/services/mock/mockStore';
import { notificationApi, AppNotification } from '@/services/api/notificationApi';

const ALL_ROLES: RoleType[] = [
  'Hospital Owner',
  'Global Admin',
  'Branch Manager',
  'Doctor',
  'HR Manager',
  'Finance Manager',
  'Marketing Manager',
  'Complaints and Query Manager',
  'Receptionist',
];

interface TopNavProps {
  onSearchOpen?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onSearchOpen }) => {
  const { currentUser, currentRole, switchRole, resetDemoData } = useAuth();
  const { branches, selectedBranchId, setSelectedBranchId, selectedBranch } = useBranch();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [liveNotifs, setLiveNotifs] = useState<AppNotification[]>([]);
  const [liveUnreadCount, setLiveUnreadCount] = useState<number | null>(null);

  const fallbackNotifs = mockStore.getState().notifications;
  const fallbackUnread = fallbackNotifs.filter((n) => !n.read).length;

  const displayNotifs = liveNotifs.length > 0 ? liveNotifs : fallbackNotifs;
  const unreadCount = liveUnreadCount !== null ? liveUnreadCount : fallbackUnread;

  const refreshNotifications = () => {
    notificationApi
      .getUserNotifications()
      .then((res) => {
        if (res && res.notifications) {
          setLiveNotifs(res.notifications);
          setLiveUnreadCount(res.unreadCount);
        }
      })
      .catch(() => {
        // Fallback to mock store if offline
      });
  };

  useEffect(() => {
    refreshNotifications();
  }, [currentUser]);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setLiveUnreadCount(0);
      setLiveNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // Mock fallback
    }
  };

  return (
    <header className="h-16 bg-white border-b border-surface-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Organization Title & Branch Selector */}
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="relative">
          <button
            onClick={() => setBranchMenuOpen(!branchMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-border hover:bg-slate-50 transition-colors text-left"
          >
            <Building2 className="w-4 h-4 text-brand-teal shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider leading-none">
                Active Branch
              </span>
              <span className="text-xs font-semibold text-text-main truncate max-w-[140px] sm:max-w-[200px]">
                {selectedBranch ? selectedBranch.name : 'All Branches (Consolidated)'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text-secondary ml-1" />
          </button>

          {/* Branch Dropdown Menu */}
          {branchMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setBranchMenuOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-surface-border py-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-text-secondary uppercase tracking-wider border-b border-slate-100">
                  Select Working Scope
                </div>
                <button
                  onClick={() => {
                    setSelectedBranchId('all');
                    setBranchMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-text-main font-medium"
                >
                  <span>All Branches (Consolidated)</span>
                  {selectedBranchId === 'all' && <Check className="w-4 h-4 text-brand-blue" />}
                </button>
                <div className="border-t border-slate-100 my-1" />
                {branches.map((b) => (
                  <button
                    key={b._id}
                    onClick={() => {
                      setSelectedBranchId(b._id);
                      setBranchMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-text-main"
                  >
                    <div>
                      <div className="font-medium text-xs">{b.name}</div>
                      <div className="text-[11px] text-text-muted">{b.city} • {b.code}</div>
                    </div>
                    {selectedBranchId === b._id && (
                      <Check className="w-4 h-4 text-brand-blue shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search Shortcut Button */}
        <button
          onClick={onSearchOpen}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-border text-xs text-text-secondary bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-text-muted" />
          <span>Quick Patient / Record Search</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] text-gray-500 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotifMenuOpen(!notifMenuOpen)}
            className="relative p-2 rounded-lg text-text-secondary hover:text-text-main hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-critical rounded-full ring-2 ring-white" />
            )}
          </button>

          {notifMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-surface-border p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 font-semibold text-xs text-text-main border-b border-gray-100 flex items-center justify-between">
                  <span>System Notifications</span>
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-brand-blue font-normal cursor-pointer hover:underline bg-transparent border-none p-0"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                  {displayNotifs.length === 0 ? (
                    <div className="p-4 text-center text-xs text-text-muted">No notifications</div>
                  ) : (
                    displayNotifs.map((n: any) => (
                      <div
                        key={n._id || n.id}
                        className={`p-3 text-xs hover:bg-slate-50 transition-colors ${
                          !n.isRead && !n.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="font-semibold text-text-main mb-0.5">{n.title}</div>
                        <div className="text-text-secondary text-[11px] leading-relaxed">
                          {n.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-6 w-px bg-surface-border mx-1" />

        {/* Role Switcher Pill Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-lg border border-surface-border hover:bg-slate-50 transition-colors"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-text-main leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] font-medium text-brand-blue flex items-center gap-1">
                <UserCheck className="w-3 h-3" />
                {currentRole}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text-secondary hidden sm:inline" />
          </button>

          {/* Role Switcher Dropdown */}
          {roleMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setRoleMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-surface-border py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="font-semibold text-xs text-text-main">{currentUser.name}</div>
                  <div className="text-[11px] text-text-secondary">{currentUser.email}</div>
                  <div className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-50 text-brand-blue text-[10px] font-bold uppercase">
                    Role: {currentRole}
                  </div>
                </div>

                <div className="px-3 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Switch Demo Role
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {ALL_ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        switchRole(role);
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center justify-between text-text-main"
                    >
                      <span className={role === currentRole ? 'font-bold text-brand-blue' : ''}>
                        {role}
                      </span>
                      {role === currentRole && (
                        <Check className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-100 mt-2 pt-1 px-2">
                  <button
                    onClick={() => {
                      setRoleMenuOpen(false);
                      resetDemoData();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Demo Baseline Data</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
