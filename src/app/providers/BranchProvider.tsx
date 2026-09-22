import React, { createContext, useContext, useState, useEffect } from 'react';
import { Branch } from '@/types';
import { mockStore } from '@/services/mock/mockStore';

interface BranchContextType {
  selectedBranchId: string; // 'all' or a specific branch _id
  selectedBranch: Branch | null;
  branches: Branch[];
  setSelectedBranchId: (id: string) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const BranchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>(mockStore.getState().branches);
  const [selectedBranchId, setSelectedBranchIdState] = useState<string>(() => {
    return localStorage.getItem('superd_demo_selected_branch') || 'all';
  });

  useEffect(() => {
    const unsubscribe = mockStore.subscribe(() => {
      setBranches(mockStore.getState().branches);
    });
    return unsubscribe;
  }, []);

  const setSelectedBranchId = (id: string) => {
    setSelectedBranchIdState(id);
    try {
      localStorage.setItem('superd_demo_selected_branch', id);
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
