import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, profile, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <p className="loading-text">AXIOM</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/checkout" replace />;
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
