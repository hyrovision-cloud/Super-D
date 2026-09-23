import React, { useEffect, useState } from 'react';
import { Bell, Info, Save, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { ApplicationSettings, configApi } from '@/services/api/configApi';

const fallback: ApplicationSettings = { emailAlerts: true, smsAlerts: true, soundAlerts: false, currency: 'INR', dateFormat: 'DD-MM-YYYY', attendanceStatuses: [] };

export const SettingsView: React.FC = () => {
  const { hasPermission } = useAuth();
  const toast = useToast();
  const [settings, setSettings] = useState<ApplicationSettings>(fallback);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const canUpdate = hasPermission('config.update');

  useEffect(() => {
    let mounted = true;
    configApi.getApplication().then((data) => mounted && setSettings(data)).catch(() => mounted && toast.error('Unable to load application configuration.')).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [toast]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canUpdate) return;
    setSaving(true);
    try { setSettings(await configApi.updateApplication(settings)); toast.success('Application configuration updated successfully.'); }
    catch { toast.error('Unable to update application configuration.'); }
    finally { setSaving(false); }
  };

  return <div className="space-y-6 max-w-4xl">
    <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold"><Settings className="w-5 h-5" /></div><div><h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1><p className="text-xs text-slate-500 mt-0.5">Database-backed application configuration. Changes are permission controlled and audited.</p></div></div>
    {loading ? <Card className="p-6 text-sm text-slate-500">Loading application configuration…</Card> : <form onSubmit={save} className="space-y-6">
      <Card className="p-4 sm:p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-4"><h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2"><Bell className="w-4 h-4 text-blue-600" />Notification Alerts</h3><div className="space-y-3 text-xs text-slate-700">{([['emailAlerts', 'Email Notifications'], ['smsAlerts', 'SMS Alerts'], ['soundAlerts', 'Audio Chimes']] as const).map(([field, label]) => <label key={field} className="flex items-center justify-between gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl"><span className="font-semibold text-slate-900">{label}</span><input type="checkbox" checked={settings[field]} disabled={!canUpdate || saving} onChange={(event) => setSettings((current) => ({ ...current, [field]: event.target.checked }))} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 disabled:opacity-50" /></label>)}</div></Card>
      <Card className="p-4 sm:p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-4"><h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Regional format</h3><label className="block text-xs font-semibold text-slate-700">Date display format<select value={settings.dateFormat} disabled={!canUpdate || saving} onChange={(event) => setSettings((current) => ({ ...current, dateFormat: event.target.value as ApplicationSettings['dateFormat'] }))} className="mt-1.5 w-full sm:max-w-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"><option value="DD-MM-YYYY">DD-MM-YYYY</option><option value="DD.MM.YYYY">DD.MM.YYYY</option><option value="YYYY-MM-DD">YYYY-MM-DD</option></select></label><div className="flex flex-wrap justify-end pt-2"><Button type="submit" variant="primary" size="sm" disabled={!canUpdate || saving} className="bg-blue-600 hover:bg-blue-700 text-white"><Save className="w-3.5 h-3.5 mr-1" />{saving ? 'Saving…' : 'Save configuration'}</Button></div>{!canUpdate && <p className="text-xs text-amber-700">You can view settings, but do not have permission to change them.</p>}</Card>
    </form>}
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 flex items-start gap-2"><Info className="w-4 h-4 shrink-0 text-slate-400" /><span>Technical constants and authentication settings are intentionally not editable here. No browser-stored business configuration is used.</span></div>
  </div>;
};
