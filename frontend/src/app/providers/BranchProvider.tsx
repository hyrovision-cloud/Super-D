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

export const BranchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchIdState] = useState<string>(() => {
    return localStorage.getItem('superd_selected_branch') || 'all';
  });

  useEffect(() => {
    let mounted = true;
    branchApi.getBranches().then((data) => mounted && setBranches(data)).catch(() => mounted && setBranches([]));
    return () => { mounted = false; };
  }, []);

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
