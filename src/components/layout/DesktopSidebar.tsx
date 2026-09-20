import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Users,
  Calendar,
  UserCheck,
  Clock,
  MessageSquareWarning,
  Megaphone,
  IndianRupee,
  FileBarChart,
  UserCog,
  KeyRound,
  HeartPulse,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { mockStore } from '@/services/mock/mockStore';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const DesktopSidebar: React.FC = () => {
  const { canAccessRoute } = useAuth();
  const state = mockStore.getState();

  const pendingLeaves = state.leaveRequests.filter(
    (l) => l.status === 'SUBMITTED' || l.status === 'MANAGER_REVIEW' || l.status === 'HR_REVIEW'
  ).length;

  const activeComplaints = state.complaints.filter(
    (c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED'
  ).length;

  const navGroups: NavGroup[] = [
    {
      title: 'Command Center',
      items: [
        {
          label: 'Owner Dashboard',
          path: '/dashboards/owner',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
        {
          label: 'Admin Dashboard',
          path: '/dashboards/admin',
          icon: <ShieldCheck className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Hospital Operations',
      items: [
        {
          label: 'Branches',
          path: '/branches',
          icon: <Building2 className="w-4 h-4" />,
        },
        {
          label: 'Patients',
          path: '/patients',
          icon: <Users className="w-4 h-4" />,
        },
        {
          label: 'Appointments',
          path: '/appointments',
          icon: <Calendar className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Workforce',
      items: [
        {
          label: 'Employees',
          path: '/employees',
          icon: <UserCheck className="w-4 h-4" />,
        },
        {
          label: 'Leave Approvals',
          path: '/leave',
          icon: <Clock className="w-4 h-4" />,
          badge: pendingLeaves > 0 ? pendingLeaves : undefined,
        },
      ],
    },
    {
      title: 'Service & Grievance',
      items: [
        {
          label: 'Complaints & Queries',
          path: '/complaints',
          icon: <MessageSquareWarning className="w-4 h-4" />,
          badge: activeComplaints > 0 ? activeComplaints : undefined,
        },
      ],
    },
    {
      title: 'Growth & Outreach',
      items: [
        {
          label: 'Marketing & Ads',
          path: '/marketing',
          icon: <Megaphone className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Finance & Analytics',
      items: [
        {
          label: 'Revenue & Accounts',
          path: '/finance',
          icon: <IndianRupee className="w-4 h-4" />,
        },
        {
          label: 'Reports & Export',
          path: '/reports',
          icon: <FileBarChart className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Administration',
      items: [
        {
          label: 'User Management',
          path: '/users',
          icon: <UserCog className="w-4 h-4" />,
        },
        {
          label: 'Roles & Permissions',
          path: '/roles',
          icon: <KeyRound className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-navy-900 text-white shrink-0 flex flex-col border-r border-navy-800 h-screen sticky top-0 select-none overflow-y-auto hidden md:flex">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-navy-800 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-blue to-teal-400 flex items-center justify-center shadow-md">
          <HeartPulse className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-tight text-white leading-tight">
            Aarogya Hospital
          </h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
            Multi-Branch Platform
          </p>
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 py-4 px-3 space-y-6">
        {navGroups.map((group) => {
          // Filter items accessible to current role
          const accessibleItems = group.items.filter((item) => canAccessRoute(item.path));
          if (accessibleItems.length === 0) return null;

          return (
            <div key={group.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                {group.title}
              </div>
              {accessibleItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-brand-blue text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-navy-800'
                    )
                  }
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-status-critical text-white leading-none shrink-0">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-navy-800 text-[11px] text-slate-400 shrink-0">
        <div className="font-medium text-slate-300">Aarogya Healthcare System</div>
        <div className="text-[10px] text-slate-500">Release D0 • 4 Active Branches</div>
      </div>
    </aside>
  );
};
