import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';

interface DemoPersona {
  email: string;
  name: string;
  role: string;
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
    role: 'Global Admin',
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
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isSessionExpired = searchParams.get('expired') === 'true';

  const [email, setEmail] = useState('superadmin@superd.demo');
  const [password, setPassword] = useState('demo2026@superd');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPersonaEmail, setSelectedPersonaEmail] = useState<string>('superadmin@superd.demo');

  const handleSelectPersona = (persona: DemoPersona) => {
    setSelectedPersonaEmail(persona.email);
    setEmail(persona.email);
    setPassword('demo2026@superd');
    setErrorMessage(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await login({ email, password, rememberMe });
      const fromPath = (location.state as any)?.from || '/dashboard';
      navigate(fromPath, { replace: true });
    } catch (err: any) {
      const code = err?.code || 'AUTH_ERROR';
      if (code === 'INVALID_CREDENTIALS') {
        setErrorMessage('Invalid email or password. Please verify your credentials.');
      } else if (code === 'ACCOUNT_DISABLED') {
        setErrorMessage('This account is disabled or suspended. Please contact administrator.');
      } else if (code === 'ACCOUNT_INACTIVE') {
        setErrorMessage('This account is inactive. Please complete registration.');
      } else if (code === 'AUTH_RATE_LIMIT' || code === 'RATE_LIMIT_EXCEEDED') {
        setErrorMessage('Too many failed login attempts. Please wait 15 minutes.');
      } else if (code === 'NETWORK_ERROR') {
        setErrorMessage('Unable to connect to the authentication server. Please check your connection.');
      } else {
        setErrorMessage(err?.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50/40 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-5xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Authentic Super D Login Card */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200/80 bg-white">
            <div>
              {/* Heart Cross Emblem & Title */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0284c7] via-[#0ea5e9] to-[#10b981] shadow-lg shadow-cyan-500/25 mb-3.5">
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

              {/* Session Expired Notice */}
              {isSessionExpired && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Your session has expired. Please sign in again.</span>
                </div>
              )}

              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

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
                      disabled={isLoading}
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
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
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
                      disabled={isLoading}
                    />
                    <span>Remember me (7 days)</span>
                  </label>
                  <span className="text-[#0d6efd] hover:underline cursor-pointer font-medium">
                    Forgot Password?
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-3 py-3 rounded-xl bg-[#0d6efd] hover:bg-[#0b5ed7] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all duration-150 active:scale-[0.99] disabled:opacity-75 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying Credentials...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In</span>
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
                Across All Branches (Trichy, Chennai, Madurai, Pudukkottai)
              </p>
            </div>
          </div>

          {/* Right Column: Autofill Demo Credentials Helper */}
          <div className="lg:col-span-6 p-6 sm:p-10 bg-[#f8fafc] flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#0d6efd] uppercase tracking-wider inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Credentials Autofill
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Test Personas
                </h3>
                <p className="text-xs text-slate-500">
                  Select any staff persona below to autofill real credentials and verify backend RBAC:
                </p>
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {DEMO_PERSONAS.map((persona) => {
                  const isSelected = selectedPersonaEmail === persona.email;
                  return (
                    <button
                      key={persona.email}
                      type="button"
                      onClick={() => handleSelectPersona(persona)}
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-150 flex items-start justify-between gap-3 cursor-pointer ${
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
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Multi-Branch Active
              </span>
              <span>Backend Auth Enforced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
