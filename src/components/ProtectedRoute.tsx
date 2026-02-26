import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-icon animate-float">✦</div>
        <p className="loading-text">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/checkout" replace />;
  }

  return <>{children}</>;
}
