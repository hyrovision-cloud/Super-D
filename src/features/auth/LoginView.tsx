import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Shield,
  Building2,
  Stethoscope,
  Users,
  IndianRupee,
  Megaphone,
  MessageSquareWarning,
  UserCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { RoleType } from '@/types';
import { Button } from '@/components/ui/Button';

interface RolePreset {
  role: RoleType;
  label: string;
  desc: string;
  icon: React.ReactNode;
  landing: string;
}

const ROLE_PRESETS: RolePreset[] = [
  {
    role: 'Hospital Owner',
    label: 'Hospital Owner',
    desc: 'Organization-wide consolidated KPIs, branch comparisons, executive governance',
    icon: <Shield className="w-4 h-4 text-brand-blue" />,
    landing: '/dashboards/owner',
  },
  {
    role: 'Global Admin',
    label: 'Global Admin',
    desc: 'System administration, user creation, roles matrix & audit logging',
    icon: <Sparkles className="w-4 h-4 text-purple-600" />,
    landing: '/dashboards/admin',
  },
  {
    role: 'Branch Manager',
    label: 'Branch Manager (Trichy)',
    desc: 'Branch operational monitoring, doctor allocations & daily summaries',
    icon: <Building2 className="w-4 h-4 text-brand-teal" />,
    landing: '/dashboards/owner',
  },
  {
    role: 'Doctor',
    label: 'Consultant Doctor',
    desc: 'Clinical appointments calendar, patient medical records & prescriptions',
    icon: <Stethoscope className="w-4 h-4 text-emerald-600" />,
    landing: '/appointments',
  },
  {
    role: 'HR Manager',
    label: 'HR Manager',
    desc: 'Workforce directory, attendance tracking & leave approval workflows',
    icon: <Users className="w-4 h-4 text-indigo-600" />,
    landing: '/employees',
  },
  {
    role: 'Finance Manager',
    label: 'Finance Manager',
    desc: 'Daily collections, revenue category breakdown & financial reports',
    icon: <IndianRupee className="w-4 h-4 text-amber-600" />,
    landing: '/finance',
  },
  {
    role: 'Marketing Manager',
    label: 'Marketing Manager',
    desc: 'Campaign spend, leads conversion, CPL & social media digital content',
    icon: <Megaphone className="w-4 h-4 text-pink-600" />,
    landing: '/marketing',
  },
  {
    role: 'Complaints and Query Manager',
    label: 'Grievance / Case Manager',
    desc: 'Ticket inbox, SLA monitoring, responsible user assignment & closure',
    icon: <MessageSquareWarning className="w-4 h-4 text-rose-600" />,
    landing: '/complaints',
  },
  {
    role: 'Receptionist',
    label: 'Receptionist / Front Desk',
    desc: 'Patient registration, search, appointment scheduling & check-in',
    icon: <UserCheck className="w-4 h-4 text-cyan-600" />,
    landing: '/patients',
  },
];

export const LoginView: React.FC = () => {
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<RoleType>('Hospital Owner');
  const [email, setEmail] = useState('owner@aarogyahospital.demo');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (preset: RolePreset) => {
    setSelectedRole(preset.role);
    if (preset.role === 'Hospital Owner') setEmail('owner@aarogyahospital.demo');
    else if (preset.role === 'Global Admin') setEmail('admin@aarogyahospital.demo');
    else if (preset.role === 'Branch Manager') setEmail('bm.trichy@aarogyahospital.demo');
    else if (preset.role === 'Doctor') setEmail('dr.priya@aarogyahospital.demo');
    else if (preset.role === 'HR Manager') setEmail('hr@aarogyahospital.demo');
    else if (preset.role === 'Finance Manager') setEmail('finance@aarogyahospital.demo');
    else if (preset.role === 'Marketing Manager') setEmail('marketing@aarogyahospital.demo');
    else if (preset.role === 'Complaints and Query Manager') setEmail('complaints@aarogyahospital.demo');
    else if (preset.role === 'Receptionist') setEmail('reception.try@aarogyahospital.demo');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      switchRole(selectedRole);
      const preset = ROLE_PRESETS.find((p) => p.role === selectedRole);
      navigate(preset?.landing || '/dashboards/owner');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Brand Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-blue to-teal-400 shadow-xl mb-3">
          <HeartPulse className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Aarogya Hospital
        </h2>
        <p className="mt-1 text-sm text-slate-300 font-medium">
          Multi-Branch Hospital Management & Administration Platform
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Interactive Demo • 4 Branches (Trichy, Chennai, Madurai, Pudukkottai)
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Role Selection Grid */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200">
            <div className="mb-4">
              <h3 className="text-base font-bold text-text-main">
                Select a Demo Role to Simulate
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Click any persona below to prefill credentials and launch their role-specific portal:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
              {ROLE_PRESETS.map((preset) => {
                const isSelected = selectedRole === preset.role;
                return (
                  <button
                    key={preset.role}
                    type="button"
                    onClick={() => handleRoleSelect(preset)}
                    className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50 border-brand-blue ring-2 ring-brand-blue/20 shadow-xs'
                        : 'bg-white border-surface-border hover:border-slate-300 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1.5 rounded-lg bg-slate-100">{preset.icon}</div>
                      <span className="font-semibold text-text-main truncate">
                        {preset.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-snug line-clamp-2">
                      {preset.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue">
                  Demo Sign In
                </span>
                <h3 className="text-xl font-bold text-text-main mt-1">
                  Access Portal
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  Logged in role: <strong className="text-text-main">{selectedRole}</strong>
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">
                    Simulated Email ID
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-surface-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-surface-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                  />
                </div>

                <div className="text-[11px] text-text-muted">
                  Notice: All passwords & credentials in this demo environment are pre-authorized for inspection.
                </div>

                <Button
                  type="submit"
                  className="w-full mt-2"
                  size="md"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Enter as {selectedRole}
                </Button>
              </form>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 text-[11px] text-text-muted text-center">
              Fictional Demonstration • Release D0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
