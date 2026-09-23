import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Megaphone,
  BarChart3,
  CalendarCheck,
  MessageSquareWarning,
  LogOut,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Building2,
  TrendingUp,
  FileText,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useBranch } from '@/app/providers/BranchProvider';
import { mockStore } from '@/services/mock/mockStore';
import { HospitalIntelligenceDrawer } from './HospitalIntelligenceDrawer';
import { OwnerDashboardView } from './OwnerDashboardView';

export const RoleDashboardView: React.FC = () => {
  const { currentRole, currentUser } = useAuth();
  const { selectedBranch } = useBranch();
  const [isIntelligenceOpen, setIsIntelligenceOpen] = React.useState(false);
  const state = mockStore.getState();

  // 1. HOSPITAL OWNER DEDICATED COMMAND CENTER
  if (currentRole === 'Hospital Owner') {
    return <OwnerDashboardView />;
  }

  // Helper metrics computed from state
  const pendingLeaves = state.superDLeaveRequests.filter(
    (l) => l.reviewStage === 'Submitted' || l.reviewStage === 'HR Review'
  );
  const openGrievances = state.superDGrievances.filter(
    (g) => g.status === 'Pending' || g.status === 'In Review'
  );
  const activeAds = state.superDAds.filter((a) => a.status === 'Running');
  const myLeaves = state.superDLeaveRequests.filter((l) => l.employeeName === currentUser.name);

  // 2. SUPER ADMIN DASHBOARD
  if (currentRole === 'Super Admin') {
    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/20 uppercase tracking-wider">
                Super Admin Command Center
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
                Welcome, Super Admin!
              </h2>
              <p className="text-blue-100 text-sm mt-1 max-w-2xl">
                Manage all branches and monitor hospital operations across Trichy, Chennai, Madurai, and Pudukkottai.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setIsIntelligenceOpen(true)}
                className="flex items-center gap-2 bg-white text-[#123B5D] px-4 py-2 rounded-xl shadow-md hover:bg-blue-50 transition-colors text-xs font-bold"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI Intelligence</span>
              </button>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-xs border border-white/15 text-xs font-semibold">
                <Building2 className="w-4 h-4 text-emerald-300" />
                <span>Access: All 4 Branches</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Revenue</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                ₹
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">₹ 8,05,288</p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> ↑ 14% vs previous period
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Patients</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0d6efd] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">404</p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> ↑ 8% vs previous period
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">New Patients</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">184</p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> ↑ 7% vs previous period
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Active Ads</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">{activeAds.length}</p>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Google Ads & Meta Ads
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Discharged Patients</span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">56</p>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Across all branches
            </span>
          </div>
        </div>

        {/* Super Admin Module Quick Access Cards */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            Authorized Super Admin Modules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link
              to="/advertisements"
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Megaphone className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-[#0d6efd] transition-colors">
                  Advertisement Management
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Create, manage and track multi-channel ad campaigns, leads and spending across all branches.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0d6efd]">
                <span>Manage Campaigns ({state.superDAds.length})</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/income-reports"
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-[#0d6efd] transition-colors">
                  Income Reports
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  View revenue, collection breakdowns, branch comparison charts and daily hospital collection summaries.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0d6efd]">
                <span>View Analytics (₹ 8,05,288)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/patient-discharge"
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <LogOut className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-[#0d6efd] transition-colors">
                  Patient Discharge Summary
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Search, review and track admitted and discharged patients with entry and exit details across branches.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0d6efd]">
                <span>View Discharges ({state.superDDischarges.length})</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        <HospitalIntelligenceDrawer
          isOpen={isIntelligenceOpen}
          onClose={() => setIsIntelligenceOpen(false)}
        />
      </div>
    );
  }

  // 2. ADMIN DASHBOARD
  if (currentRole === 'Admin' || currentRole === 'Global Admin') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-700 to-cyan-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/20 uppercase tracking-wider">
                Admin Central Operations
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
                Welcome, Admin!
              </h2>
              <p className="text-blue-100 text-sm mt-1 max-w-2xl">
                Monitor attendance and handle employee concerns across all 4 hospital branches.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto bg-white/10 px-4 py-2 rounded-xl backdrop-blur-xs border border-white/15 text-xs font-semibold">
              <Building2 className="w-4 h-4 text-cyan-300" />
              <span>Access: All 4 Branches</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Total Employees</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">48</p>
            <span className="text-[11px] text-slate-500 mt-1 block">Active staff records</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Pending Leave Requests</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-2">{pendingLeaves.length}</p>
            <span className="text-[11px] text-amber-600 font-medium mt-1 block">Requires action</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Open Grievances</span>
            <p className="text-2xl font-extrabold text-rose-600 mt-2">{openGrievances.length}</p>
            <span className="text-[11px] text-rose-600 font-medium mt-1 block">Under review</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Attendance Rate</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-2">94.8%</p>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Above 90% benchmark</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link
            to="/attendance"
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0d6efd] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-[#0d6efd] transition-colors">
                Attendance Management
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                View employee leave requests, permissions and attendance across all hospital branches.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0d6efd]">
              <span>Review Requests ({pendingLeaves.length} pending)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/grievances"
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <MessageSquareWarning className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-[#0d6efd] transition-colors">
                Grievances (Employee Concerns)
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Manage, review, and resolve employee concerns raised by staff across all branches.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
              <span>View Concerns ({openGrievances.length} open)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // 3. HR DASHBOARD
  if (currentRole === 'HR' || currentRole === 'HR Manager') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/20 uppercase tracking-wider">
                Human Resources Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
                Welcome, HR!
              </h2>
              <p className="text-emerald-100 text-sm mt-1 max-w-2xl">
                Manage employee attendance, leave review stages and cross-branch workforce requests.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto bg-white/10 px-4 py-2 rounded-xl backdrop-blur-xs border border-white/15 text-xs font-semibold">
              <Building2 className="w-4 h-4 text-emerald-200" />
              <span>Scope: Cross-Branch</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Total Workforce</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">48</p>
            <span className="text-[11px] text-slate-500 mt-1 block">Active hospital staff</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Pending HR Review</span>
            <p className="text-2xl font-extrabold text-blue-600 mt-2">
              {state.superDLeaveRequests.filter((l) => l.reviewStage === 'HR Review').length}
            </p>
            <span className="text-[11px] text-blue-600 font-medium mt-1 block">Awaiting HR clearance</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Today Present</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-2">45</p>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">93.7% turn-out</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">On Leave Today</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-2">3</p>
            <span className="text-[11px] text-slate-500 mt-1 block">Sanctioned leaves</span>
          </div>
        </div>

        <Link
          to="/attendance"
          className="block bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Attendance Management (Leaves & Permissions)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Review employee applications, update HR review stages and finalize leave records.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform shrink-0" />
          </div>
        </Link>
      </div>
    );
  }

  // 4. BRANCH DOCTOR DASHBOARD
  if (currentRole === 'Branch Doctor' || currentRole === 'Doctor') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/20 uppercase tracking-wider">
                Clinical Branch Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
                Welcome, Dr. Anand Kumar!
              </h2>
              <p className="text-blue-100 text-sm mt-1 max-w-2xl">
                Manage attendance and patient discharge summaries for Trichy Main Hospital.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto bg-white/10 px-4 py-2 rounded-xl backdrop-blur-xs border border-white/15 text-xs font-semibold">
              <Building2 className="w-4 h-4 text-purple-200" />
              <span>Branch: Trichy</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Total Discharged</span>
            <p className="text-2xl font-extrabold text-[#0d6efd] mt-2">56</p>
            <span className="text-[11px] text-slate-500 mt-1 block">Trichy branch total</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Today Discharged</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-2">8</p>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Successfully discharged</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">This Month Discharged</span>
            <p className="text-2xl font-extrabold text-rose-600 mt-2">142</p>
            <span className="text-[11px] text-slate-500 mt-1 block">Month to date</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link
            to="/attendance"
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0d6efd] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-[#0d6efd] transition-colors">
                Attendance Management
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                View clinical staff attendance, personal leave requests, and branch leave approvals.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0d6efd]">
              <span>Branch Attendance</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/patient-discharge"
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <LogOut className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Patient Discharge Summary
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                View and manage discharged patients from Trichy branch with entry and exit details.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600">
              <span>View Discharge Records (56 records)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // 5. BRANCH MANAGER DASHBOARD
  if (currentRole === 'Branch Manager') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-800 via-slate-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/20 uppercase tracking-wider">
                Branch Management
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
                Welcome, Branch Manager!
              </h2>
              <p className="text-slate-200 text-sm mt-1 max-w-2xl">
                Manage branch attendance and approve employee leave requests for Trichy Main Hospital.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto bg-white/10 px-4 py-2 rounded-xl backdrop-blur-xs border border-white/15 text-xs font-semibold">
              <Building2 className="w-4 h-4 text-amber-300" />
              <span>Branch: Trichy</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Branch Staff</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">18</p>
            <span className="text-[11px] text-slate-500 mt-1 block">Assigned to Trichy</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Pending Approvals</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-2">
              {state.superDLeaveRequests.filter((l) => l.reviewStage === 'Submitted').length}
            </p>
            <span className="text-[11px] text-amber-600 font-medium mt-1 block">Awaiting manager action</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Today's Attendance</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-2">94.4%</p>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">17 of 18 present</span>
          </div>
        </div>

        <Link
          to="/attendance"
          className="block bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0d6efd] flex items-center justify-center shrink-0">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold text-slate-900 group-hover:text-[#0d6efd] transition-colors">
                Attendance Management
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Review and approve branch leave requests, permissions and track daily staff attendance.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#0d6efd] group-hover:translate-x-1 transition-transform shrink-0" />
          </div>
        </Link>
      </div>
    );
  }

  // 6. STAFF DASHBOARD
  if (currentRole === 'Staff') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/20 uppercase tracking-wider">
                Staff Operations Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
                Welcome, Staff Member!
              </h2>
              <p className="text-cyan-100 text-sm mt-1 max-w-2xl">
                Manage branch advertisements, record daily revenue and accounts, and view patient discharges.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto bg-white/10 px-4 py-2 rounded-xl backdrop-blur-xs border border-white/15 text-xs font-semibold">
              <Building2 className="w-4 h-4 text-cyan-200" />
              <span>Branch: Trichy</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Active Campaigns</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">3</p>
            <span className="text-[11px] text-slate-500 mt-1 block">Trichy marketing</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Leads Generated</span>
            <p className="text-2xl font-extrabold text-[#0d6efd] mt-2">109</p>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">↑ 15% this month</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Today's Collections</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-2">₹ 23,750</p>
            <span className="text-[11px] text-slate-500 mt-1 block">OP & Pharmacy receipts</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Branch Expenses</span>
            <p className="text-2xl font-extrabold text-rose-600 mt-2">₹ 41,200</p>
            <span className="text-[11px] text-slate-500 mt-1 block">Pharma & Utilities</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            to="/advertisements"
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Megaphone className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-[#0d6efd] transition-colors">
                Advertisement Management
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Create new campaign entries, track ad performance, enquiry counts, and lead metrics.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0d6efd]">
              <span>Branch Campaigns</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/revenue-accounts"
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <IndianRupee className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                Revenue & Accounts
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Record daily income receipts and expenses with category tagging and reference numbers.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-600">
              <span>Record Transactions</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/patient-discharge"
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <LogOut className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Patient Discharge Management
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                View admitted patients and confirmed branch discharges.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600">
              <span>View Discharge List</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // 7. EMPLOYEE DASHBOARD
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/20 uppercase tracking-wider">
              Employee Self-Service
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
              Welcome, {currentUser.name}!
            </h2>
            <p className="text-blue-100 text-sm mt-1 max-w-2xl">
              Apply for leave or permission and track review status from your branch manager and HR.
            </p>
          </div>
          <Link
            to="/leave-permission"
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white text-[#0d6efd] font-bold text-xs hover:bg-blue-50 shadow-md transition-all flex items-center gap-1.5"
          >
            <span>+ Apply Leave / Permission</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Applications</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{myLeaves.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Your requests</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Approved</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-2">
            {myLeaves.filter((l) => l.status === 'Approved').length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Confirmed leave</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Pending Review</span>
          <p className="text-2xl font-extrabold text-amber-600 mt-2">
            {myLeaves.filter((l) => l.status === 'Pending').length}
          </p>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">In workflow</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Leave Balance</span>
          <p className="text-2xl font-extrabold text-[#0d6efd] mt-2">14 Days</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Casual + Earned available</span>
        </div>
      </div>

      {/* Quick Policy Notice */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-5 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-full bg-[#0d6efd] text-white flex items-center justify-center shrink-0 mt-0.5">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900">
            Submission Policy Reminder:
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            Leave and permission requests must normally be submitted at least <strong>2 days before</strong> the leave start date for manager approval.
          </p>
        </div>
      </div>
    </div>
  );
};
