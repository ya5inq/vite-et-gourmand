import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/templates/DashboardLayout';

export const ProtectedRoute = () => {
  const { isReady, user, isEmployee } = useAuthContext();

  if (!isReady) return <div className="flex h-screen items-center justify-center">Chargement...</div>;
  if (!user || !isEmployee) return <Navigate to="/login" replace />;

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};
