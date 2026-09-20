import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  Building2,
  Calendar,
  Phone,
  Mail,
  User,
  Clock,
  Briefcase,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { Employee, AttendanceStatus } from '@/types';
import { employeeService } from '@/services/mock/employeeService';
import { useBranch } from '@/app/providers/BranchProvider';
import { mockStore } from '@/services/mock/mockStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Drawer } from '@/components/ui/Drawer';
import { DataTable, Column } from '@/components/tables/DataTable';
import { MobileRecordCard } from '@/components/tables/MobileRecordCard';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils';

export const EmployeeListView: React.FC = () => {
  const { selectedBranchId } = useBranch();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const fetchEmployees = () => {
    employeeService.getEmployees(selectedBranchId).then((data) => {
      setEmployees(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchEmployees();
    const unsubscribe = mockStore.subscribe(() => {
      fetchEmployees();
    });
    return unsubscribe;
  }, [selectedBranchId]);

  const filteredEmployees = employees.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = deptFilter === 'ALL' || e.department === deptFilter;
    return matchSearch && matchDept;
  });

  const departments = Array.from(new Set(employees.map((e) => e.department)));

  const getAttendanceBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'PRESENT':
        return <Badge variant="success" size="sm" dot>Present</Badge>;
      case 'LATE':
        return <Badge variant="warning" size="sm" dot>Late</Badge>;
      case 'ON_LEAVE':
        return <Badge variant="navy" size="sm" dot>On Leave</Badge>;
      case 'PERMISSION':
        return <Badge variant="teal" size="sm" dot>Permission</Badge>;
      case 'ABSENT':
        return <Badge variant="critical" size="sm" dot>Absent</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const columns: Column<Employee>[] = [
    {
      key: 'employeeNumber',
      header: 'Staff ID',
      sortable: true,
      className: 'font-mono text-xs font-semibold text-brand-blue',
    },
    {
      key: 'name',
      header: 'Employee Name & Role',
      sortable: true,
      render: (e) => (
        <div>
          <div className="font-bold text-text-main text-xs">{e.name}</div>
          <div className="text-[11px] text-text-muted">{e.role}</div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      render: (e) => <span className="text-xs text-text-secondary">{e.department}</span>,
    },
    {
      key: 'branchName',
      header: 'Hospital Branch',
      render: (e) => (
        <div className="flex items-center gap-1 text-xs text-text-secondary">
          <Building2 className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <span>{e.branchName}</span>
        </div>
      ),
    },
    {
      key: 'currentAttendance',
      header: 'Today Attendance',
      sortable: true,
      render: (e) => getAttendanceBadge(e.currentAttendance),
    },
    {
      key: 'status',
      header: 'Employment',
      sortable: true,
      render: (e) => (
        <Badge variant={e.status === 'ACTIVE' ? 'success' : 'neutral'} size="sm">
          {e.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      className: 'text-right',
      render: (e) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(ev) => {
            ev.stopPropagation();
            setSelectedEmployee(e);
          }}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          View
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
            Workforce Directory (Spec EMP-001, ATT-001)
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Staff roster, branch deployment, and real-time daily shift attendance tracking.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3.5 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search employee by name, ID, or job role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-surface-border focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-text-secondary font-medium whitespace-nowrap">
            Department:
          </label>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs border border-surface-border rounded-lg px-2.5 py-1.5 bg-white text-text-main focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Responsive View */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : (
        <>
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={filteredEmployees}
              keyExtractor={(e) => e._id}
              pageSize={8}
              onRowClick={(e) => setSelectedEmployee(e)}
              emptyTitle="No staff members found"
              emptyDescription="No employees match your active branch or department filter."
            />
          </div>

          <div className="md:hidden space-y-3">
            {filteredEmployees.map((emp) => (
              <MobileRecordCard
                key={emp._id}
                title={emp.name}
                subtitle={`${emp.employeeNumber} • ${emp.role}`}
                badge={getAttendanceBadge(emp.currentAttendance)}
                fields={[
                  { label: 'Department', value: emp.department },
                  { label: 'Branch', value: emp.branchName },
                  { label: 'Reporting To', value: emp.reportingManagerName },
                  { label: 'Joined', value: formatDate(emp.joiningDate) },
                ]}
                actions={
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedEmployee(emp)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    View Staff Details
                  </Button>
                }
              />
            ))}
          </div>
        </>
      )}

      {/* Employee Detail Drawer */}
      <Drawer
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        title={selectedEmployee?.name || 'Staff Profile'}
        subtitle={`${selectedEmployee?.employeeNumber} • ${selectedEmployee?.role}`}
        width="md"
      >
        {selectedEmployee && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-text-secondary font-medium">Daily Attendance Status:</span>
              {getAttendanceBadge(selectedEmployee.currentAttendance)}
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-text-secondary">Department:</span>
                <span className="font-semibold text-text-main">{selectedEmployee.department}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-text-secondary">Hospital Branch:</span>
                <span className="font-semibold text-text-main">{selectedEmployee.branchName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-text-secondary">Reporting Manager:</span>
                <span className="font-medium text-brand-blue">
                  {selectedEmployee.reportingManagerName}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-text-secondary">Official Email:</span>
                <span className="font-medium text-text-main">{selectedEmployee.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-text-secondary">Phone Number:</span>
                <span className="font-medium text-text-main">{selectedEmployee.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-text-secondary">Date of Joining:</span>
                <span className="font-medium text-text-main">
                  {formatDate(selectedEmployee.joiningDate)}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-text-secondary">Employment Status:</span>
                <Badge variant={selectedEmployee.status === 'ACTIVE' ? 'success' : 'neutral'} size="sm">
                  {selectedEmployee.status}
                </Badge>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setSelectedEmployee(null)}
              >
                Close Profile
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
