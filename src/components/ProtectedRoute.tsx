import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export function ProtectedRoute({ children, requireProfile = true }: { children: React.ReactNode, requireProfile?: boolean }) {
  const { user, isLoadingAuth } = useAuth();
  const { profile, isLoading } = useApp();

  if (isLoadingAuth || isLoading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireProfile && !profile) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
}
