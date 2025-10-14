"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/providers/AuthProvider';
import { usePermissions } from '@/shared/hooks/usePermissions';

interface RoleBasedRedirectProps {
  onRedirectComplete?: () => void;
}

export default function RoleBasedRedirect({ onRedirectComplete }: RoleBasedRedirectProps) {
  const { user, isAuthenticated } = useAuth();
  const { getUserType, loading: permissionsLoading } = usePermissions();
  const hasRedirected = useRef(false);
  const router = useRouter();

  useEffect(() => {
    // Solo proceder si el usuario está autenticado y no hemos redirigido ya
    if (!isAuthenticated || !user || permissionsLoading || hasRedirected.current) {
      return;
    }

    const userType = getUserType();

    // Solo redirigir para usuarios con roles administrativos
    if (userType === 'super-admin' || userType === 'admin-store') {
      hasRedirected.current = true;
      
      const redirectPath = userType === 'super-admin' ? '/admin/super' : '/admin/store';
      router.push(redirectPath);
      
      onRedirectComplete?.();
    }
  }, [isAuthenticated, user, getUserType, permissionsLoading, router, onRedirectComplete]);

  // Mostrar loading mientras se procesan los permisos
  if (isAuthenticated && permissionsLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando permisos...</p>
        </div>
      </div>
    );
  }

  return null;
}