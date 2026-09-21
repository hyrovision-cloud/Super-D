import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Building2,
  Stethoscope,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { SuperDRole } from '@/types';

interface DemoPersona {
  role: SuperDRole;
  email: string;
  name: string;
  scope: string;
  desc: string;
}

const DEMO_PERSONAS: DemoPersona[] = [
  {
    role: 'Super Admin',
    email: 'superadmin@superd.demo',
    name: 'Super Admin',
    scope: 'All Branches',
    desc: 'Organization-wide monitoring, ads, income reports and hospital governance',
  },
  {
    role: 'Admin',
    email: 'admin@superd.demo',
    name: 'Admin',
    scope: 'All Branches',
    desc: 'Attendance management & grievances across all 4 hospital branches',
  },
  {
    role: 'HR',
    email: 'hr@superd.demo',
    name: 'HR Manager',
    scope: 'Cross-Branch',
    desc: 'Cross-branch employee leave review and attendance administration',
  },
  {
    role: 'Branch Doctor',
    email: 'doctor.trichy@superd.demo',
    name: 'Dr. Anand Kumar',
    scope: 'Trichy Branch',
    desc: 'Clinical attendance and patient discharge operations',
  },
  {
    role: 'Branch Manager',
    email: 'manager.trichy@superd.demo',
    name: 'Branch Manager',
    scope: 'Trichy Branch',
    desc: 'Branch operations, leave approval workflows & attendance',
  },
  {
    role: 'Staff',
    email: 'staff.trichy@superd.demo',
    name: 'Staff Member',
    scope: 'Trichy Branch',
    desc: 'Branch advertisement campaigns & revenue and accounts bookkeeping',
  },
  {
    role: 'Employee',
    email: 'employee.trichy@superd.demo',
    name: 'Suresh Babu',
    scope: 'Trichy Nursing',
    desc: 'Self-service portal for leave & permission applications',
  },
];

export const LoginView: React.FC = () => {
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<SuperDRole>('Super Admin');
  const [email, setEmail] = useState('superadmin@superd.demo');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPersona = (persona: DemoPersona) => {
    setSelectedRole(persona.role);
    setEmail(persona.email);
    setPassword('demo2026@superd');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      switchRole(selectedRole);
      navigate('/dashboard');
    }, 350);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50/40 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-5xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Authentic Super D Login Card */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200/80 bg-white">
            <div>
              {/* Heart Cross Emblem & Title */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0284c7] via-[#0ea5e9] to-[#10b981] shadow-lg shadow-cyan-500/25 mb-3.5">
                  {/* Stylized Heart Cross SVG */}
                  <svg
                    viewBox="0 0 32 32"
                    className="w-10 h-10 text-white fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 28.5C15.6 28.5 15.2 28.3 14.9 28C8.5 21.6 4 17.5 4 12C4 7.5 7.5 4 12 4C14.3 4 16.5 5 18 6.7C19.5 5 21.7 4 24 4C28.5 4 32 7.5 32 12C32 17.5 27.5 21.6 21.1 28C20.8 28.3 20.4 28.5 20 28.5H16Z" />
                    <rect x="14" y="9" width="4" height="10" rx="1" fill="#ffffff" />
                    <rect x="11" y="12" width="10" height="4" rx="1" fill="#ffffff" />
                  </svg>
                </div>
                <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
                  Super D
                </h1>
                <p className="text-xs font-bold text-slate-500 tracking-widest uppercase mt-0.5">
                  MANAGEMENT SYSTEM
                </p>
                <p className="text-xs text-[#0d6efd] font-medium mt-1">
                  Care Today, Healthier Tomorrow
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0d6efd]/30 focus:border-[#0d6efd] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0d6efd]/30 focus:border-[#0d6efd] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0d6efd] focus:ring-[#0d6efd]"
                    />
                    <span>Remember me</span>
                  </label>
                  <span className="text-[#0d6efd] hover:underline cursor-pointer font-medium">
                    Forgot Password?
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-3 py-3 rounded-xl bg-[#0d6efd] hover:bg-[#0b5ed7] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all duration-150 active:scale-[0.99] disabled:opacity-75"
                >
                  {isLoading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Hospital Building Illustration Banner at Bottom */}
            <div className="pt-6 mt-6 border-t border-slate-100 text-center">
              <p className="text-xs font-semibold text-slate-600">
                Trusted Care. Connected People.
              </p>
              <p className="text-[11px] text-slate-400">
                Across All Branches (Trichy, Chennai, Madurai, Pudukottai)
              </p>
            </div>
          </div>

          {/* Right Column: Demo Persona Switcher */}
          <div className="lg:col-span-6 p-6 sm:p-10 bg-[#f8fafc] flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#0d6efd] uppercase tracking-wider">
                  Interactive Demo
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Select a Role to Simulate
                </h3>
                <p className="text-xs text-slate-500">
                  Click any of the 7 official Super D personas to test its exact permissions and view:
                </p>
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {DEMO_PERSONAS.map((persona) => {
                  const isSelected = selectedRole === persona.role;
                  return (
                    <button
                      key={persona.role}
                      type="button"
                      onClick={() => handleSelectPersona(persona)}
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-150 flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-white border-[#0d6efd] shadow-sm ring-2 ring-[#0d6efd]/20'
                          : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 truncate">
                            {persona.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                            {persona.scope}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {persona.desc}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {persona.email}
                        </p>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-[#0d6efd] shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Super D Prototype v1.0</span>
              <span>All 4 Branches Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
