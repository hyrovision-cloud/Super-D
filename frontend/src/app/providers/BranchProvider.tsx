import React, { createContext, useContext, useState, useEffect } from 'react';
import { Branch } from '@/types';
import { branchApi } from '@/services/api/branchApi';

interface BranchContextType {
  selectedBranchId: string; // 'all' or a specific branch _id
  selectedBranch: Branch | null;
  branches: Branch[];
  setSelectedBranchId: (id: string) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const DEFAULT_SUPERD_BRANCHES: Branch[] = [
  {
    _id: 'branch-trichy',
    name: 'Trichy Main Hospital',
    code: 'TRY',
    city: 'Trichy',
    address: '45 Salai Road, Thillai Nagar, Trichy, Tamil Nadu 620018',
    phone: '+91 431 270 1234',
    email: 'trichy@superd.hospital',
    status: 'ACTIVE',
    managerId: 'EMP-TRY-001',
    managerName: 'Dr. Arun Kumar',
    bedCapacity: 120,
    consultationRooms: 12,
    departments: ['General Medicine', 'Orthopedics', 'Cardiology', 'Pediatrics'],
  },
  {
    _id: 'branch-chennai',
    name: 'Chennai Super Speciality',
    code: 'CHN',
    city: 'Chennai',
    address: '102 Anna Salai, Guindy, Chennai, Tamil Nadu 600032',
    phone: '+91 44 2250 5678',
    email: 'chennai@superd.hospital',
    status: 'ACTIVE',
    managerId: 'EMP-CHN-001',
    managerName: 'Dr. Meena Raman',
    bedCapacity: 200,
    consultationRooms: 20,
    departments: ['General Medicine', 'Cardiology', 'Neurology', 'Oncology', 'Pediatrics'],
  },
  {
    _id: 'branch-madurai',
    name: 'Madurai City Hospital',
    code: 'MDU',
    city: 'Madurai',
    address: '18 West Veli Street, Madurai, Tamil Nadu 625001',
    phone: '+91 452 234 9012',
    email: 'madurai@superd.hospital',
    status: 'ACTIVE',
    managerId: 'EMP-MDU-001',
    managerName: 'Dr. Karthik Devi',
    bedCapacity: 150,
    consultationRooms: 16,
    departments: ['General Medicine', 'Orthopedics', 'Dermatology', 'Day Care'],
  },
  {
    _id: 'branch-pudukkottai',
    name: 'Pudukkottai Healthcare Center',
    code: 'PDK',
    city: 'Pudukkottai',
    address: '89 Main Road, Pudukkottai, Tamil Nadu 622001',
    phone: '+91 4322 221 456',
    email: 'pudukkottai@superd.hospital',
    status: 'ACTIVE',
    managerId: 'EMP-PDK-001',
    managerName: 'Dr. Nivetha Raj',
    bedCapacity: 80,
    consultationRooms: 8,
    departments: ['General Medicine', 'Pediatrics', 'OP Consultation', 'Emergency'],
  },
];

export const BranchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>(DEFAULT_SUPERD_BRANCHES);
  const [selectedBranchId, setSelectedBranchIdState] = useState<string>(() => {
    return localStorage.getItem('superd_selected_branch') || 'all';
  });

  const loadBranches = React.useCallback(async () => {
    try {
      const data = await branchApi.getBranches();
      if (Array.isArray(data) && data.length > 0) {
        setBranches(data);
      }
    } catch {
      // Retain DEFAULT_SUPERD_BRANCHES so users always have branch selection capability
    }
  }, []);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  const setSelectedBranchId = (id: string) => {
    setSelectedBranchIdState(id);
    try {
      localStorage.setItem('superd_selected_branch', id);
    } catch {
      // ignore
    }
  };

  const selectedBranch =
    selectedBranchId === 'all'
      ? null
      : branches.find((b) => b._id === selectedBranchId) || null;

  return (
    <BranchContext.Provider
      value={{
        selectedBranchId,
        selectedBranch,
        branches,
        setSelectedBranchId,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) throw new Error('useBranch must be used within BranchProvider');
  return context;
};
