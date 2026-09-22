import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Phone,
  Mail,
  MapPin,
  BedDouble,
  DoorOpen,
  User,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Branch } from '@/types';
import { branchService } from '@/services/mock/branchService';
import { mockStore } from '@/services/mock/mockStore';
import { useToast } from '@/app/providers/ToastProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { TableSkeleton } from '@/components/ui/Skeleton';

export const BranchListView: React.FC = () => {
  const toast = useToast();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [managerName, setManagerName] = useState('');
  const [bedCapacity, setBedCapacity] = useState('100');
  const [consultationRooms, setConsultationRooms] = useState('15');

  const fetchBranches = () => {
    branchService.getAllBranches().then((data) => {
      setBranches(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchBranches();
    const unsubscribe = mockStore.subscribe(() => {
      setBranches(mockStore.getState().branches);
    });
    return unsubscribe;
  }, []);

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !city) {
      toast.error('Please fill in required branch fields');
      return;
    }

    try {
      await branchService.addBranch({
        name,
        code: code.toUpperCase().startsWith('BR-') ? code.toUpperCase() : `BR-${code.toUpperCase()}`,
        city,
        address,
        phone,
        email,
        managerId: `usr-bm-${Date.now()}`,
        managerName,
        status: 'ACTIVE',
        bedCapacity: Number(bedCapacity) || 50,
        consultationRooms: Number(consultationRooms) || 10,
        departments: ['General Medicine', 'Pediatrics', 'Emergency'],
      });

      toast.success(`Branch ${name} created successfully!`);
      setIsAddModalOpen(false);
      // Reset form
      setName('');
      setCode('');
      setCity('');
      setAddress('');
      setPhone('');
      setEmail('');
      setManagerName('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create branch');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
            Hospital Branch Network (Spec ADM-004)
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Administer multi-location hospital centers, capacity, clinical units, and regional managers.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Branch
        </Button>
      </div>

      {loading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {branches.map((branch) => (
            <Card
              key={branch._id}
              hoverEffect
              className="p-5 flex flex-col justify-between cursor-pointer border hover:border-brand-blue/30"
              onClick={() => setSelectedBranch(branch)}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-brand-teal shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-text-main leading-snug">
                        {branch.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-semibold text-slate-700">
                          {branch.code}
                        </span>
                        <span>•</span>
                        <span>{branch.city}</span>
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant={branch.status === 'ACTIVE' ? 'success' : 'warning'}
                    size="sm"
                    dot
                  >
                    {branch.status}
                  </Badge>
                </div>

                <p className="text-xs text-text-secondary flex items-start gap-1.5 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5" />
                  <span>{branch.address}</span>
                </p>

                {/* Key specs */}
                <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-4">
                  <div>
                    <span className="text-[11px] text-text-muted block mb-0.5">Bed Capacity</span>
                    <span className="font-bold text-text-main flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-brand-teal" />
                      {branch.bedCapacity}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-text-muted block mb-0.5">OPD Rooms</span>
                    <span className="font-bold text-text-main flex items-center gap-1">
                      <DoorOpen className="w-3.5 h-3.5 text-brand-blue" />
                      {branch.consultationRooms}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-text-muted block mb-0.5">Departments</span>
                    <span className="font-bold text-text-main">
                      {branch.departments?.length || 5} Units
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-text-secondary">
                <div className="flex items-center gap-1.5 truncate">
                  <User className="w-3.5 h-3.5 text-text-muted" />
                  <span className="truncate">Manager: {branch.managerName}</span>
                </div>
                <span className="text-brand-blue font-semibold hover:underline shrink-0">
                  View Details
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Branch Detail Modal */}
      <Modal
        isOpen={!!selectedBranch}
        onClose={() => setSelectedBranch(null)}
        title={selectedBranch?.name || 'Branch Details'}
        description={`Code: ${selectedBranch?.code} • Location: ${selectedBranch?.city}`}
        maxWidth="lg"
      >
        {selectedBranch && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Operational Status:</span>
                <Badge variant={selectedBranch.status === 'ACTIVE' ? 'success' : 'warning'} size="sm" dot>
                  {selectedBranch.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Branch Head / Medical Superintendent:</span>
                <span className="font-semibold text-text-main">{selectedBranch.managerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Emergency Desk Contact:</span>
                <span className="font-medium text-text-main">{selectedBranch.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Official Email:</span>
                <span className="font-medium text-text-main">{selectedBranch.email}</span>
              </div>
            </div>

            <div>
              <div className="font-semibold text-text-main text-xs mb-2">
                Active Medical & Clinical Departments
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedBranch.departments.map((dept) => (
                  <span
                    key={dept}
                    className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-100 font-medium"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button size="sm" onClick={() => setSelectedBranch(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add New Branch Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Hospital Branch"
        description="Register a new hospital location into the multi-branch network"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateBranch} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-main mb-1">Branch Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Coimbatore Regional Hospital"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-text-main mb-1">Branch Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. BR-CBE"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs uppercase focus:ring-2 focus:ring-brand-blue/30 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-main mb-1">City / Region *</label>
              <input
                type="text"
                required
                placeholder="e.g. Coimbatore"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-text-main mb-1">Branch Manager Name</label>
              <input
                type="text"
                placeholder="e.g. Dr. K. Srinivasan"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-text-main mb-1">Full Physical Address</label>
            <input
              type="text"
              placeholder="Building number, Street, Landmark"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-main mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+91 422 230 4455"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-text-main mb-1">Email</label>
              <input
                type="email"
                placeholder="coimbatore@superd.demo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-main mb-1">Bed Capacity</label>
              <input
                type="number"
                value={bedCapacity}
                onChange={(e) => setBedCapacity(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-text-main mb-1">Consultation Rooms</label>
              <input
                type="number"
                value={consultationRooms}
                onChange={(e) => setConsultationRooms(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Branch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
