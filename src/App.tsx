import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/AppRouter';
import { AuthProvider } from './app/providers/AuthProvider';
import { BranchProvider } from './app/providers/BranchProvider';
import { ToastProvider } from './app/providers/ToastProvider';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BranchProvider>
          <RouterProvider router={router} />
        </BranchProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
