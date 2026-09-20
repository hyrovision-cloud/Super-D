import React, { useState, useEffect } from 'react';
import {
  UserCog,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Shield,
  Building2,
  Mail,
  Phone,
} from 'lucide-react';
import { User, RoleType } from '@/types';
import { userService } from '@/services/mock/userService';
import { mockStore } from '@/services/mock/mockStore';
import { useToast } from '@/app/providers/ToastProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { DataTable, Column } from '@/components/tables/DataTable';
import { MobileRecordCard } from '@/components/tables/MobileRecordCard';
import { TableSkeleton } from '@/components/ui/Skeleton';

const ROLE_OPTIONS: RoleType[] = [
  'Hospital Owner',
  'Global Admin',
  'Branch Manager',
  'Doctor',
  'HR Manager',
  'Finance Manager',
  'Marketing Manager',
  'Complaints and Query Manager',
  'Receptionist',
];

export const UserListView: React.FC = () => {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Add User modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [role, setRole] = useState<RoleType>('Doctor');
  const [department, setDepartment] = useState('General Medicine');
  const [primaryBranchId, setPrimaryBranchId] = useState('branch-try');

  const branches = mockStore.getState().branches;

  const fetchUsers = () => {
    userService.getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchUsers();
    const unsubscribe = mockStore.subscribe(() => {
      setUsers(mockStore.getState().users);
    });
    return unsubscribe;
  }, []);

  const handleToggleStatus = async (user: User) => {
    try {
      const updated = await userService.toggleUserStatus(user._id);
      toast.success(
        `User ${user.name} is now ${updated.status === 'ACTIVE' ? 'Active' : 'Disabled'}`
      );
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !employeeId) {
      toast.error('Please enter name, email, and employee ID');
      return;
    }

    try {
      await userService.createUser({
        name,
        email,
        phone: phone || '+91 98400 00000',
        employeeId,
        role,
        department,
        primaryBranchId,
        branchIds: [primaryBranchId],
        status: 'ACTIVE',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      });

      toast.success(`User ${name} provisioned successfully!`);
      setIsAddModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setEmployeeId('');
    } catch {
      toast.error('Failed to provision user');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const getBranchName = (bId: string) => {
    const b = branches.find((item) => item._id === bId);
    return b ? b.name : 'Trichy Main';
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'User / Employee',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          <img
            src={u.avatarUrl}
            alt={u.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <div>
            <div className="font-semibold text-text-main text-xs">{u.name}</div>
            <div className="text-[11px] text-text-muted font-mono">{u.employeeId}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Assigned Role',
      sortable: true,
      render: (u) => (
        <Badge variant="navy" size="sm">
          {u.role}
        </Badge>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      render: (u) => <span className="text-xs text-text-secondary">{u.department}</span>,
    },
    {
      key: 'branch',
      header: 'Primary Branch',
      render: (u) => (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Building2 className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <span className="truncate">{getBranchName(u.primaryBranchId)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (u) => (
        <Badge variant={u.status === 'ACTIVE' ? 'success' : 'critical'} size="sm" dot>
          {u.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      className: 'text-right',
      render: (u) => (
        <Button
          variant={u.status === 'ACTIVE' ? 'outline' : 'primary'}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleStatus(u);
          }}
        >
          {u.status === 'ACTIVE' ? 'Disable Access' : 'Activate'}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
            User Account Management (Spec ADM-001)
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Provision staff logins, allocate system roles, and govern active session access.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New User
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3.5 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, employee ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-surface-border focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-text-secondary font-medium whitespace-nowrap">
            Role Filter:
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs border border-surface-border rounded-lg px-2.5 py-1.5 bg-white text-text-main focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          >
            <option value="ALL">All Roles</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Responsive View: Desktop Table & Mobile Cards */}
      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={filteredUsers}
              keyExtractor={(u) => u._id}
              pageSize={8}
              emptyTitle="No users found"
              emptyDescription="No users match your active role or search filters."
            />
          </div>

          {/* Mobile Card Stack */}
          <div className="md:hidden space-y-3">
            {filteredUsers.map((user) => (
              <MobileRecordCard
                key={user._id}
                title={user.name}
                subtitle={`${user.employeeId} • ${user.department}`}
                badge={
                  <Badge variant={user.status === 'ACTIVE' ? 'success' : 'critical'} size="sm" dot>
                    {user.status}
                  </Badge>
                }
                fields={[
                  { label: 'Role', value: user.role },
                  { label: 'Branch', value: getBranchName(user.primaryBranchId) },
                  { label: 'Email', value: user.email },
                  { label: 'Phone', value: user.phone },
                ]}
                actions={
                  <Button
                    variant={user.status === 'ACTIVE' ? 'outline' : 'primary'}
                    size="sm"
                    className="w-full"
                    onClick={() => handleToggleStatus(user)}
                  >
                    {user.status === 'ACTIVE' ? 'Disable Access' : 'Activate Access'}
                  </Button>
                }
              />
            ))}
          </div>
        </>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Provision New User"
        description="Create credentials and assign hospital role & branch scope"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-main mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. K. Meenakshi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-text-main mb-1">Employee ID *</label>
              <input
                type="text"
                required
                placeholder="e.g. EMP-TRY-045"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs font-mono focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-main mb-1">Official Email *</label>
              <input
                type="email"
                required
                placeholder="doctor.name@aarogyahospital.demo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-text-main mb-1">Contact Phone</label>
              <input
                type="text"
                placeholder="+91 98401 22334"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-main mb-1">System Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as RoleType)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs bg-white focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-text-main mb-1">Primary Branch *</label>
              <select
                value={primaryBranchId}
                onChange={(e) => setPrimaryBranchId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs bg-white focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              >
                {branches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-text-main mb-1">Department</label>
            <input
              type="text"
              placeholder="e.g. Cardiology, Front Desk, Accounts"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Provision User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
