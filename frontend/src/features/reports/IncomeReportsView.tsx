import React, { useState } from 'react';
import {
  Calendar,
  Building2,
  Download,
  TrendingUp,
  Bandage,
  Bed,
  Users,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  REVENUE_DATEWISE_SERIES,
  BRANCH_COMPARISON_REPORT,
  BRANCH_WISE_PATIENT_SUMMARY,
  TRICHY_DAILY_REPORT,
  DAILY_BRANCH_REPORTS,
} from '@/data/seed/superDSeed';

// Branch Comparison Chart Data across all 4 branches (11.09.2026)
const BRANCH_BAR_DATA = [
  { name: 'Madurai', revenue: 63401, patients: 30 },
  { name: 'Chennai', revenue: 24927, patients: 11 },
  { name: 'Trichy', revenue: 10068, patients: 10 },
  { name: 'Pudukkottai', revenue: 5800, patients: 8 },
];

// Revenue Composition Donut Data per branch
const COMPOSITION_BY_BRANCH: Record<
  string,
  { total: number; data: Array<{ name: string; value: number; color: string; percentage: string }> }
> = {
  Trichy: {
    total: 47033,
    data: [
      { name: 'OP', value: 34190, color: '#0d6efd', percentage: '72.7%' },
      { name: 'Medical', value: 11643, color: '#0ea5e9', percentage: '24.7%' },
      { name: 'Lab', value: 1200, color: '#f97316', percentage: '2.6%' },
    ],
  },
  Chennai: {
    total: 24927,
    data: [
      { name: 'OP', value: 4650, color: '#0d6efd', percentage: '18.7%' },
      { name: 'Medical', value: 19777, color: '#0ea5e9', percentage: '79.3%' },
      { name: 'Lab', value: 500, color: '#f97316', percentage: '2.0%' },
    ],
  },
  Madurai: {
    total: 63401,
    data: [
      { name: 'OP', value: 35000, color: '#0d6efd', percentage: '55.2%' },
      { name: 'Medical', value: 24501, color: '#0ea5e9', percentage: '38.6%' },
      { name: 'Lab', value: 3900, color: '#f97316', percentage: '6.2%' },
    ],
  },
  Pudukkottai: {
    total: 5800,
    data: [
      { name: 'OP', value: 2200, color: '#0d6efd', percentage: '37.9%' },
      { name: 'Medical', value: 2800, color: '#0ea5e9', percentage: '48.3%' },
      { name: 'Lab', value: 800, color: '#f97316', percentage: '13.8%' },
    ],
  },
  Pudukottai: {
    total: 5800,
    data: [
      { name: 'OP', value: 2200, color: '#0d6efd', percentage: '37.9%' },
      { name: 'Medical', value: 2800, color: '#0ea5e9', percentage: '48.3%' },
      { name: 'Lab', value: 800, color: '#f97316', percentage: '13.8%' },
    ],
  },
};

export const IncomeReportsView: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [dateRange, setDateRange] = useState('01.09.2026 → 11.09.2026');
  const [compositionBranch, setCompositionBranch] = useState('Trichy');
  const [dailyReportBranch, setDailyReportBranch] = useState('Trichy');
  const [dailyReportDate, setDailyReportDate] = useState('08.09.2026');

  const currentComposition =
    COMPOSITION_BY_BRANCH[compositionBranch] || COMPOSITION_BY_BRANCH['Trichy'];
  const currentDailyReport =
    DAILY_BRANCH_REPORTS[dailyReportBranch] || TRICHY_DAILY_REPORT;

  const handleExport = () => {
    // Generate simulated CSV export with all 4 branches
    const rows = [
      ['Super D Hospital - Income Report (01.09.2026 - 11.09.2026)'],
      ['Branch', 'Total Revenue', 'Total Patients', 'New Patients'],
      ['Madurai', '280209', '114', '51'],
      ['Chennai', '278907', '127', '29'],
      ['Trichy', '204372', '135', '92'],
      ['Pudukkottai', '41800', '28', '12'],
      ['Consolidated Total', '805288', '404', '184'],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'super_d_income_report_sep2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
            Income Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            View revenue, collection and patient statistics across all 4 hospital branches
          </p>
        </div>

        {/* Header Filters & Export */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date range picker pill */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 shadow-2xs">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="font-semibold">{dateRange}</span>
          </div>

          {/* Branch filter */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 shadow-2xs">
            <Building2 className="w-4 h-4 text-[#0d6efd]" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent focus:outline-none font-semibold text-slate-800"
            >
              <option value="all">All Branches</option>
              <option value="Trichy">Trichy</option>
              <option value="Chennai">Chennai</option>
              <option value="Madurai">Madurai</option>
              <option value="Pudukkottai">Pudukkottai</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all duration-150 active:scale-[0.99]"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Row 1: 5 KPI Cards (Reconciled across all 4 branches) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0">
            ₹
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500">Total Revenue</span>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">₹ 8,05,288</p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> ↑ 14% <span className="text-slate-400 font-normal">vs previous period</span>
            </span>
          </div>
        </div>

        {/* Total Patients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0d6efd] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500">Total Patients</span>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">404</p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> ↑ 8% <span className="text-slate-400 font-normal">vs previous period</span>
            </span>
          </div>
        </div>

        {/* New Patients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500">New Patients</span>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">184</p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> ↑ 7% <span className="text-slate-400 font-normal">vs previous period</span>
            </span>
          </div>
        </div>

        {/* Dressing Amount */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Bandage className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500">Dressing Amount</span>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">₹ 15,800</p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> ↑ 10% <span className="text-slate-400 font-normal">vs previous period</span>
            </span>
          </div>
        </div>

        {/* Day Care Amount */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Bed className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500">Day Care Amount</span>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">₹ 7,000</p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> ↑ 5% <span className="text-slate-400 font-normal">vs previous period</span>
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Visual Charts (Branch Comparison + Revenue Datewise) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: Branch Comparison Bar Chart (All 4 Branches) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0d6efd]" />
              <h3 className="font-bold text-sm text-slate-900">Branch Comparison (All 4 Branches)</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#0d6efd]" />
                <span>Revenue (₹)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-500" />
                <span>Total Patients</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BRANCH_BAR_DATA} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  formatter={(val: number, name: string) => [
                    name === 'revenue' ? `₹ ${val.toLocaleString('en-IN')}` : val,
                    name === 'revenue' ? 'Revenue' : 'Total Patients',
                  ]}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
                <Bar dataKey="revenue" fill="#0d6efd" radius={[4, 4, 0, 0]} barSize={28} />
                <Bar dataKey="patients" fill="#10b981" radius={[4, 4, 0, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Revenue Datewise Multi-line Chart (All 4 Branches) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0d6efd]" />
              <h3 className="font-bold text-sm text-slate-900">
                Revenue Datewise (01.09.2026 - 11.09.2026)
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0d6efd]" /> Madurai
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> Chennai
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" /> Trichy
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]" /> Pudukkottai
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_DATEWISE_SERIES} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip
                  formatter={(val: number) => [`₹ ${val.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
                <Line
                  type="monotone"
                  dataKey="Madurai"
                  stroke="#0d6efd"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Chennai"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Trichy"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Pudukkottai"
                  stroke="#d97706"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: 3 Report Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Table 1: Branch Comparison Report (11.09.2026) - All 4 Branches */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-[#0d6efd]" />
            <h3 className="font-bold text-xs sm:text-sm text-slate-900">
              Branch Comparison Report (11.09.2026)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Particulars</th>
                  <th className="py-2 px-2 text-right">Madurai</th>
                  <th className="py-2 px-2 text-right">Chennai</th>
                  <th className="py-2 px-2 text-right">Trichy</th>
                  <th className="py-2 px-2 text-right">Pudukkottai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {BRANCH_COMPARISON_REPORT.map((row, idx) => {
                  if (row.type === 'header') {
                    return (
                      <tr key={idx} className="bg-slate-50 font-bold text-slate-800">
                        <td colSpan={5} className="py-1.5 px-3 text-[11px] text-center text-[#0d6efd]">
                          {row.particular}
                        </td>
                      </tr>
                    );
                  }
                  const isTotal = row.type === 'total';
                  return (
                    <tr
                      key={idx}
                      className={
                        isTotal
                          ? 'bg-blue-50/70 font-extrabold text-[#0d6efd]'
                          : 'hover:bg-slate-50 text-slate-700'
                      }
                    >
                      <td className={`py-1.5 px-3 ${isTotal ? 'font-bold' : ''}`}>
                        {row.particular}
                      </td>
                      <td className="py-1.5 px-2 text-right">{row.Madurai}</td>
                      <td className="py-1.5 px-2 text-right">{row.Chennai}</td>
                      <td className="py-1.5 px-2 text-right">{row.Trichy}</td>
                      <td className="py-1.5 px-2 text-right">{row.Pudukkottai}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 2: Revenue Composition Donut Chart - 3.5 Cols */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-[#0d6efd]" />
                <h3 className="font-bold text-sm text-slate-900">Revenue Composition</h3>
              </div>
              <select
                value={compositionBranch}
                onChange={(e) => setCompositionBranch(e.target.value)}
                className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-semibold"
              >
                <option value="Trichy">Trichy</option>
                <option value="Chennai">Chennai</option>
                <option value="Madurai">Madurai</option>
                <option value="Pudukkottai">Pudukkottai</option>
              </select>
            </div>

            {/* Donut Chart with Center Total */}
            <div className="relative h-48 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentComposition.data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {currentComposition.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => [`₹ ${v.toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{ borderRadius: '12px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Inner Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm font-extrabold text-slate-900">
                  ₹ {currentComposition.total.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Total Collection</span>
              </div>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
            {currentComposition.data.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold text-slate-800">{item.name}</span>
                  <span className="text-[11px] text-slate-400">({item.percentage})</span>
                </div>
                <span className="font-bold text-slate-900">
                  ₹ {item.value.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Branch-wise Patient Summary - 3.5 Cols */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-[#0d6efd]" />
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                Branch-wise Patient Summary
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 -mt-2 mb-3">01.09.26 to 11.09.26</p>

            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Particulars</th>
                  <th className="py-2.5 px-2 text-right">Madurai</th>
                  <th className="py-2.5 px-2 text-right">Chennai</th>
                  <th className="py-2.5 px-2 text-right">Trichy</th>
                  <th className="py-2.5 px-2 text-right">Pudukkottai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {BRANCH_WISE_PATIENT_SUMMARY.map((row, i) => (
                  <tr
                    key={i}
                    className={
                      row.isBold
                        ? 'bg-blue-50/70 font-extrabold text-[#0d6efd]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }
                  >
                    <td className="py-2 px-3">{row.particular}</td>
                    <td className="py-2 px-2 text-right font-semibold">{row.Madurai}</td>
                    <td className="py-2 px-2 text-right font-semibold">{row.Chennai}</td>
                    <td className="py-2 px-2 text-right font-semibold">{row.Trichy}</td>
                    <td className="py-2 px-2 text-right font-semibold">{row.Pudukkottai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-500 mt-4">
            Total patients registered across all 4 monitoring branches: <strong className="text-slate-800">404</strong>
          </div>
        </div>
      </div>

      {/* Row 4: Branch Daily Report Split Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0d6efd]" />
            <h3 className="font-bold text-sm text-slate-900">
              {dailyReportBranch} Branch Daily Report ({currentDailyReport.date})
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <select
              value={dailyReportBranch}
              onChange={(e) => setDailyReportBranch(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-semibold"
            >
              <option value="Trichy">Trichy</option>
              <option value="Chennai">Chennai</option>
              <option value="Madurai">Madurai</option>
              <option value="Pudukkottai">Pudukkottai</option>
            </select>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentDailyReport.date}</span>
            </div>
          </div>
        </div>

        {/* 3-Column Split Table */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Col 1: Patient Details */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-[#f8fafc] px-3 py-2 font-bold text-slate-800 border-b border-slate-200">
              Patient Statistics
            </div>
            <div className="divide-y divide-slate-100">
              <div className="flex justify-between px-3 py-2">
                <span className="text-slate-600">Total Patients</span>
                <span className="font-bold text-slate-900">
                  {currentDailyReport.patients.totalPatients}
                </span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span className="text-slate-600">In that New Patients</span>
                <span className="font-bold text-slate-900">
                  {currentDailyReport.patients.newPatients}
                </span>
              </div>
              <div className="px-3 py-2">
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Dressing Total</span>
                  <span className="font-bold text-slate-900">
                    {currentDailyReport.patients.dressing}
                  </span>
                </div>
                <div className="pl-3 space-y-1 text-[11px] text-slate-500">
                  <div className="flex justify-between">
                    <span>Wound</span>
                    <span>{currentDailyReport.patients.dressingBreakdown?.wound ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Corn</span>
                    <span>{currentDailyReport.patients.dressingBreakdown?.corn ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Burning Sensation</span>
                    <span>{currentDailyReport.patients.dressingBreakdown?.burningSensation ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Day Care</span>
                    <span>{currentDailyReport.patients.dressingBreakdown?.dayCare ?? 0}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span className="text-slate-600">Burning Sensation</span>
                <span className="font-bold text-slate-900">
                  {currentDailyReport.patients.burningSensation}
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Collection (Rs.) */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-[#f8fafc] px-3 py-2 font-bold text-slate-800 border-b border-slate-200">
              Collection (Rs.)
            </div>
            <div className="divide-y divide-slate-100">
              <div className="flex justify-between px-3 py-2">
                <span className="text-slate-600">OP</span>
                <span className="font-semibold text-slate-900">
                  {currentDailyReport.collection.op.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span className="text-slate-600">Medical</span>
                <span className="font-semibold text-slate-900">
                  {currentDailyReport.collection.medical.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span className="text-slate-600">Lab</span>
                <span className="font-semibold text-slate-900">
                  {currentDailyReport.collection.lab.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between px-3 py-2 bg-blue-50/80 font-extrabold text-[#0d6efd]">
                <span>Total Collection</span>
                <span>₹ {currentDailyReport.collection.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Other Amounts */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-[#f8fafc] px-3 py-2 font-bold text-slate-800 border-b border-slate-200">
              Other Amounts (Rs.)
            </div>
            <div className="divide-y divide-slate-100">
              <div className="flex justify-between px-3 py-2">
                <span className="text-slate-600">Dressing Amount</span>
                <span className="font-bold text-emerald-600">
                  ₹ {currentDailyReport.otherAmounts.dressingAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span className="text-slate-600">Day Care</span>
                <span className="font-bold text-purple-600">
                  ₹ {currentDailyReport.otherAmounts.dayCare.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3 bg-slate-50 text-[11px] text-slate-500">
                Data reconciled against daily clinical log receipts for {dailyReportBranch} branch.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
