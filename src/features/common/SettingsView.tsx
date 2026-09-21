import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Building2,
  Shield,
  RotateCcw,
  Info,
  CheckCircle2,
  Save,
  Moon,
  Globe,
} from 'lucide-react';
import { useBranch } from '@/app/providers/BranchProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { mockStore } from '@/services/mock/mockStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const SettingsView: React.FC = () => {
  const { branches } = useBranch();
  const toast = useToast();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState('INR (₹)');
  const [dateFormat, setDateFormat] = useState('DD-MM-YYYY');

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('System preferences saved successfully');
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all demo data back to default factory seed values?')) {
      mockStore.resetToDefaults();
      toast.success('Demo data reset to initial Super D seed state!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure application parameters, notifications, branch defaults, and test data
          </p>
        </div>
      </div>

      {/* Notifications Card */}
      <Card className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" />
          Notification Alerts & Broadcasts
        </h3>

        <div className="space-y-3 text-xs text-slate-700">
          <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/60 transition">
            <div>
              <span className="font-semibold text-slate-900 block">Email Notifications</span>
              <span className="text-[11px] text-slate-500">Receive email alerts for leave approvals and hospital announcements</span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/60 transition">
            <div>
              <span className="font-semibold text-slate-900 block">SMS Alerts</span>
              <span className="text-[11px] text-slate-500">Send instant SMS notifications to doctors for emergency patient admissions</span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/60 transition">
            <div>
              <span className="font-semibold text-slate-900 block">Audio Chimes</span>
              <span className="text-[11px] text-slate-500">Play chime sound when high-priority grievance is registered</span>
            </div>
            <input
              type="checkbox"
              checked={soundAlerts}
              onChange={(e) => setSoundAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </label>
        </div>
      </Card>

      {/* Regional & Financial Preferences */}
      <Card className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600" />
          Regional & Ledger Formats
        </h3>

        <form onSubmit={handleSavePreferences} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Currency Symbol</label>
              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="INR (₹)">Indian Rupee — INR (₹)</option>
                <option value="USD ($)">US Dollar — USD ($)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date Display Format</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DD-MM-YYYY">DD-MM-YYYY (e.g. 21-09-2026)</option>
                <option value="DD.MM.YYYY">DD.MM.YYYY (e.g. 21.09.2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-3.5 h-3.5 mr-1" />
              Save Preferences
            </Button>
          </div>
        </form>
      </Card>

      {/* Demo State Reset */}
      <Card className="p-6 bg-white border border-rose-200/80 rounded-2xl shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-rose-600" />
          Reset Demo Data Store
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Restore all mock advertisements, daily revenue ledgers (₹7,63,488 WhatsApp data), leaves, grievances, and patient discharge records back to initial seeded values.
        </p>
        <div className="pt-2">
          <Button
            variant="danger"
            size="sm"
            onClick={handleResetData}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            Reset All Data to Factory Seed
          </Button>
        </div>
      </Card>

      {/* System Information */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400" />
          <span>SUPER D Hospital Management Prototype • Version 2.4.0 • 4 Active Branches</span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">Build: 2026.09-PROD</span>
      </div>
    </div>
  );
};
