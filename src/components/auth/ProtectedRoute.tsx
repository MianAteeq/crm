import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AuthService } from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const hasToken = Boolean(AuthService.getToken());

  useEffect(() => {
    if (isAuthenticated && !hasToken) {
      logout();
    }
  }, [hasToken, isAuthenticated, logout]);

  if (!isAuthenticated || !hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle onboarding redirect
  if (user && user.onboardingStep < 4 && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
