import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';

export const PublicRoute = () => {
  const { isReady, user, isEmployee } = useAuthContext();

  if (!isReady) return <div className="flex h-screen items-center justify-center">Chargement...</div>;
  if (user && isEmployee) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};
