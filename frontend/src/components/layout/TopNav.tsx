import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Building2, ChevronDown, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useBranch } from '@/app/providers/BranchProvider';
import { AppNotification, notificationApi } from '@/services/api/notificationApi';

interface TopNavProps { onMenuToggle?: () => void; onSearchOpen?: () => void; }

export const TopNav: React.FC<TopNavProps> = ({ onMenuToggle }) => {
  const { currentUser, currentRole, logout, permissions } = useAuth();
  const { branches, selectedBranchId, setSelectedBranchId } = useBranch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<'profile' | 'notifications' | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((item) => !item.read).length;
  const initials = currentRole.slice(0, 2).toUpperCase();

  useEffect(() => { setActiveMenu(null); }, [location.pathname]);
  useEffect(() => {
    const closeMenus = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent) { if (event.key === 'Escape') setActiveMenu(null); return; }
      const target = event.target as Node;
      if (!profileMenuRef.current?.contains(target) && !notificationMenuRef.current?.contains(target)) setActiveMenu(null);
    };
    document.addEventListener('mousedown', closeMenus);
    window.addEventListener('keydown', closeMenus);
    return () => { document.removeEventListener('mousedown', closeMenus); window.removeEventListener('keydown', closeMenus); };
  }, []);
  useEffect(() => {
    let mounted = true;
    if (!permissions.includes('notification.view')) { setNotifications([]); return; }
    notificationApi.getUserNotifications().then((items) => mounted && setNotifications(items)).catch(() => mounted && setNotificationError('Unable to load notifications.'));
    return () => { mounted = false; };
  }, [permissions]);

  const toggleMenu = (menu: 'profile' | 'notifications') => setActiveMenu((current) => current === menu ? null : menu);
  const closeAndNavigate = (path: string) => { setActiveMenu(null); navigate(path); };
  const markAllRead = async () => {
    try { await notificationApi.markAllAsRead(); setNotifications((items) => items.map((item) => ({ ...item, read: true }))); }
    catch { setNotificationError('Unable to mark notifications as read.'); }
  };
  const markReadAndFollow = async (item: AppNotification) => {
    try {
      if (!item.read) { await notificationApi.markAsRead(item._id); setNotifications((items) => items.map((entry) => entry._id === item._id ? { ...entry, read: true } : entry)); }
      setActiveMenu(null); if (item.link) navigate(item.link);
    } catch { setNotificationError('Unable to update notification.'); }
  };
  const handleLogout = async () => { try { await logout(); } finally { setActiveMenu(null); navigate('/login'); } };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 select-none shadow-2xs w-full">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile brand badge */}
        <div className="md:hidden w-8 h-8 rounded-xl bg-gradient-to-tr from-[#123B5D] via-[#1d4ed8] to-[#0d6efd] text-white flex items-center justify-center font-extrabold text-sm italic shadow-xs shrink-0">
          S
        </div>
        <div className="flex min-w-0 items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <Building2 className="w-3.5 h-3.5 text-[#123B5D] shrink-0" />
          <span className="text-slate-500 font-medium hidden sm:inline">Branch:</span>
          <select
            value={selectedBranchId}
            onChange={(event) => setSelectedBranchId(event.target.value)}
            className="min-w-0 max-w-[125px] sm:max-w-[12rem] bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer text-xs truncate"
            aria-label="Select hospital branch"
          >
            <option value="all">All Branches</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
        {permissions.includes('notification.view') && (
          <div className="relative" ref={notificationMenuRef}>
            <button
              type="button"
              onClick={() => toggleMenu('notifications')}
              className="p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
              title="Notifications"
              aria-label="Open notifications"
              aria-expanded={activeMenu === 'notifications'}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0d6efd] ring-2 ring-white" />
              )}
            </button>
            {activeMenu === 'notifications' && (
              <div
                className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50"
                role="dialog"
                aria-label="Notifications"
              >
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between gap-3">
                  <span className="font-bold text-xs text-slate-800">Notifications</span>
                  <button
                    type="button"
                    onClick={markAllRead}
                    disabled={!unreadCount}
                    className="text-[11px] text-[#0d6efd] font-semibold disabled:text-slate-400"
                  >
                    {unreadCount ? `Mark ${unreadCount} read` : 'All caught up'}
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => markReadAndFollow(item)}
                      className="w-full text-left p-3 text-xs hover:bg-slate-50"
                    >
                      <p className="font-semibold text-slate-800">{item.title}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{item.message}</p>
                    </button>
                  ))}
                  {!notifications.length && (
                    <p className="p-4 text-center text-xs text-slate-500">No notifications yet.</p>
                  )}
                </div>
                {notificationError && (
                  <p className="px-4 pt-2 text-[11px] text-rose-600">{notificationError}</p>
                )}
              </div>
            )}
          </div>
        )}
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => toggleMenu('profile')}
            className="flex items-center gap-1.5 sm:gap-2.5 p-1 sm:pl-2 sm:pr-3 sm:py-1.5 rounded-full hover:bg-slate-100/80 transition-colors border border-slate-200/80"
            aria-expanded={activeMenu === 'profile'}
            aria-label="Open profile menu"
          >
            <div className="w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-2xs">
              {initials}
            </div>
            <span className="text-xs font-semibold text-slate-800 hidden sm:inline">{currentRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          </button>
          {activeMenu === 'profile' && (
            <div
              className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 divide-y divide-slate-100"
              role="dialog"
              aria-label="Profile menu"
            >
              <div className="px-4 pb-3">
                <p className="font-bold text-sm text-slate-900 truncate">
                  {currentUser?.name || 'Super D User'}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email || ''}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0d6efd] border border-blue-200">
                  {currentRole}
                </span>
              </div>
              <div className="pt-2 px-3 space-y-1">
                <button
                  type="button"
                  onClick={() => closeAndNavigate('/profile')}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
