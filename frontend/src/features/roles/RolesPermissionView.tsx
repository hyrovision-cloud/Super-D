import React, { useState, useEffect } from 'react';
import { KeyRound, Shield, Check, Save } from 'lucide-react';
import { SystemRole } from '@/types';
import { roleService } from '@/services/mock/roleService';
import { useToast } from '@/app/providers/ToastProvider';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/app/providers/AuthProvider';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TableSkeleton } from '@/components/ui/Skeleton';

interface PermissionDefinition {
  module: string;
  permissions: {
    key: string;
    label: string;
  }[];
}

const PERMISSION_GROUPS: PermissionDefinition[] = [
  {
    module: 'Patients & Clinical',
    permissions: [
      { key: 'patient.view', label: 'View Patient Records' },
      { key: 'patient.create', label: 'Register New Patient' },
      { key: 'patient.update', label: 'Update Patient Records' },
      { key: 'patient.delete', label: 'Delete Patient Records' },
      { key: 'patient.discharge', label: 'Manage Discharges' },
      { key: 'medical_record.view', label: 'View Medical History' },
      { key: 'medical_record.create', label: 'Record Clinical Notes' },
    ],
  },
  {
    module: 'Appointments & OPD',
    permissions: [
      { key: 'appointment.view', label: 'View Appointment Calendar' },
      { key: 'appointment.create', label: 'Book OPD Appointment' },
      { key: 'appointment.update', label: 'Update Appointment Workflow' },
      { key: 'appointment.cancel', label: 'Cancel Appointments' },
    ],
  },
  {
    module: 'Workforce & Leaves',
    permissions: [
      { key: 'employee.view', label: 'View Staff Directory' },
      { key: 'employee.create', label: 'Add New Employee' },
      { key: 'employee.update', label: 'Update Employees' },
      { key: 'attendance.view', label: 'View Attendance Records' },
      { key: 'leave.view', label: 'View Leave Inbox' },
      { key: 'leave.request', label: 'Submit Leave Request' },
      { key: 'leave.approve', label: 'Approve Leave' },
      { key: 'leave.reject', label: 'Reject Leave' },
    ],
  },
  {
    module: 'Complaints & Grievance',
    permissions: [
      { key: 'complaint.view', label: 'View Complaints Inbox' },
      { key: 'complaint.create', label: 'Log New Case' },
      { key: 'complaint.assign', label: 'Assign Responsible Staff' },
      { key: 'complaint.resolve', label: 'Resolve & Close Ticket' },
      { key: 'complaint.view_confidential', label: 'View Confidential Cases' },
    ],
  },
  {
    module: 'Finance & Growth',
    permissions: [
      { key: 'revenue.view', label: 'View Revenue & Daily Collections' },
      { key: 'revenue.create', label: 'Record Income Transactions' },
      { key: 'revenue.update', label: 'Update Income Transactions' },
      { key: 'expense.view', label: 'View Expenses' },
      { key: 'expense.create', label: 'Record Expenses' },
      { key: 'marketing.view', label: 'View Campaign Analytics' },
      { key: 'advertisement.view', label: 'View Advertisements' },
      { key: 'advertisement.create', label: 'Create Advertisements' },
      { key: 'lead.view', label: 'View Leads' },
      { key: 'lead.create', label: 'Create Leads' },
      { key: 'report.view', label: 'Access Scoped Reports' },
    ],
  },
  {
    module: 'Technical Governance',
    permissions: [
      { key: 'user.manage', label: 'User Account Provisioning' },
      { key: 'user.view', label: 'View Users' },
      { key: 'user.create', label: 'Create Users' },
      { key: 'user.update', label: 'Update Users' },
      { key: 'role.manage', label: 'Role & Permission Matrix' },
      { key: 'role.view', label: 'View Roles' },
      { key: 'role.update', label: 'Update Roles' },
      { key: 'role.assign', label: 'Assign Roles' },
      { key: 'branch.manage', label: 'Multi-Branch Administration' },
      { key: 'audit.view', label: 'Inspect Security Audit Logs' },
    ],
  },
];

export const RolesPermissionView: React.FC = () => {
  const toast = useToast();
  const { hasPermission } = useAuth();
  const canUpdate = hasPermission('role.update');
  const [roles, setRoles] = useState<SystemRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<SystemRole | null>(null);
  const [activePermissions, setActivePermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    roleService.getAllRoles().then((data) => {
      setRoles(data);
      if (data.length > 0) {
        setSelectedRole(data[0]);
        setActivePermissions(data[0].permissions);
      }
      setLoading(false);
    });
  }, []);

  const handleSelectRole = (role: SystemRole) => {
    setSelectedRole(role);
    setActivePermissions(role.permissions);
  };

  const handleTogglePermission = (key: string) => {
    if (!canUpdate) return;
    setActivePermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    setIsSaving(true);
    try {
      const updated = await roleService.updateRolePermissions(
        selectedRole._id,
        activePermissions
      );
      setSelectedRole(updated);
      setRoles((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
      toast.success(`Updated permissions for ${selectedRole.name}`);
    } catch {
      toast.error('Failed to save permissions');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <TableSkeleton rows={8} cols={4} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
            Roles & Permission Matrix (Spec ADM-002, ADM-003)
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Configure module action keys and data-scope boundaries for system roles.
          </p>
        </div>

        {selectedRole && canUpdate && (
          <Button
            size="sm"
            onClick={handleSavePermissions}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Matrix Changes
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Role Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-text-secondary px-1">
            Configured Roles ({roles.length})
          </div>
          <div className="space-y-2">
            {roles.map((r) => {
              const isSelected = selectedRole?._id === r._id;
              return (
                <Card
                  key={r._id}
                  onClick={() => handleSelectRole(r)}
                  className={`p-3.5 cursor-pointer transition-all border text-xs ${
                    isSelected
                      ? 'border-brand-blue bg-blue-50/50 shadow-xs'
                      : 'hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-text-main">{r.name}</span>
                    <Badge variant="navy" size="sm">
                      {r.dataScope}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-snug line-clamp-2">
                    {r.description}
                  </p>
                  <div className="mt-2 text-[10px] font-semibold text-text-muted">
                    {r.permissions.length} granted permissions
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Column: Permission Group Matrix */}
        <div className="lg:col-span-8">
          {selectedRole && (
            <Card>
              <CardHeader className="bg-slate-50/80">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">
                      Permissions for {selectedRole.name}
                    </CardTitle>
                    <Badge variant="teal" size="sm">
                      Scope: {selectedRole.dataScope}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Toggle actions below to modify permissions for this persona.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {PERMISSION_GROUPS.map((group) => (
                  <div key={group.module} className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-brand-blue border-b border-gray-100 pb-1 flex items-center justify-between">
                      <span>{group.module}</span>
                      <span className="text-[10px] text-text-muted font-normal">
                        {group.permissions.filter((p) => activePermissions.includes(p.key)).length} /{' '}
                        {group.permissions.length} active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {group.permissions.map((perm) => {
                        const isGranted = activePermissions.includes(perm.key);
                        return (
                          <div
                            key={perm.key}
                            onClick={() => handleTogglePermission(perm.key)}
                            className={`p-2.5 rounded-lg border transition-colors cursor-pointer flex items-center justify-between ${
                              isGranted
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-medium'
                                : 'bg-slate-50/60 border-surface-border text-text-secondary hover:bg-slate-100'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-semibold">{perm.label}</div>
                              <div className="font-mono text-[10px] text-text-muted">{perm.key}</div>
                            </div>
                            <div
                              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ml-2 border ${
                                isGranted
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isGranted && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
