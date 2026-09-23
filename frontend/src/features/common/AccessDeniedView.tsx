import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { getAuthorizedItems } from '@/routes/rolePermissions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const AccessDeniedView: React.FC = () => {
  const { currentRole, permissions } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const attemptedPath = (location.state as any)?.from || 'the requested screen';
  const allowedRoutes = getAuthorizedItems(permissions).map((item) => item.path);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 bg-white border border-slate-200/80 rounded-3xl shadow-lg text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8 stroke-[1.75]" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 uppercase tracking-wider inline-block">
            Access Restricted (403)
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Permission Denied</h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Your current assigned role <strong className="text-slate-800 font-semibold">{currentRole}</strong> does not have authorization to view <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">{attemptedPath}</code> under the Super D Role-Based Access Control matrix.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            Allowed Modules for {currentRole}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allowedRoutes.map((r) => (
              <Link
                key={r}
                to={r}
                className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 border border-slate-200 rounded-lg transition"
              >
                {r}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 border-slate-200 text-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};
