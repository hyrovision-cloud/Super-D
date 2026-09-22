import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  Calendar,
  CheckCircle2,
  KeyRound,
  Edit3,
  Save,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useBranch } from '@/app/providers/BranchProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const ProfileView: React.FC = () => {
  const { currentUser, currentRole } = useAuth();
  const { branches } = useBranch();
  const toast = useToast();

  const [name, setName] = useState(currentUser?.name || 'Administrator');
  const [phone, setPhone] = useState('+91 98401 54321');
  const [department, setDepartment] = useState('Hospital Administration');
  const [isEditing, setIsEditing] = useState(false);

  const currentBranch = branches.find((b) => b._id === currentUser?.primaryBranchId) || branches[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success('Profile details updated successfully');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Profile</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Super D Healthcare management credentials, branch assignments, and authorization role
            </p>
          </div>
        </div>

        <Button
          variant={isEditing ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className={!isEditing ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-slate-200'}
        >
          {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </Button>
      </div>

      {/* Profile Overview Card */}
      <Card className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-2xl font-bold flex items-center justify-center shadow-md flex-shrink-0">
            {name.charAt(0)}
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900">{name}</h2>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {currentRole}
              </span>
              <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                ID: {currentUser?.employeeId || 'EMP-001'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {currentUser?.email || 'admin@superd.demo'}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {currentBranch ? currentBranch.name : 'Trichy Main Hospital'}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {phone}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Form */}
      <Card className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
          Personal Information & Contact Preferences
        </h3>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 disabled:bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                disabled
                value={currentUser?.email || 'admin@superd.demo'}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                disabled={!isEditing}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 disabled:bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                disabled={!isEditing}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 disabled:bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-3.5 h-3.5 mr-1" />
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </Card>

      {/* Role & Security Card */}
      <Card className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          Access Level & System Entitlements
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-semibold text-slate-500 uppercase text-[10px]">Active Role</span>
            <div className="font-bold text-slate-800 text-sm mt-1">{currentRole}</div>
            <div className="text-slate-400 text-[11px] mt-0.5">Assigned by Central Admin</div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-semibold text-slate-500 uppercase text-[10px]">Branch Scope</span>
            <div className="font-bold text-slate-800 text-sm mt-1">
              {currentBranch ? currentBranch.name : 'Trichy Main Hospital'}
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5">Primary Clinical Station</div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-semibold text-slate-500 uppercase text-[10px]">Security Status</span>
            <div className="font-bold text-emerald-600 text-sm mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Active & Verified
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5">RBAC Session Protected</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
