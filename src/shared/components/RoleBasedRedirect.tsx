"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/providers/AuthProvider';
import { usePermissions } from '@/shared/hooks/usePermissions';

interface RoleBasedRedirectProps {
  onRedirectComplete?: () => void;
}

export default function RoleBasedRedirect({ onRedirectComplete }: RoleBasedRedirectProps) {
  const { user, isAuthenticated } = useAuth();
  const { getUserType, loading: permissionsLoading, permissions, refetchPermissions } = usePermissions();
  const hasRedirected = useRef(false);
  const router = useRouter();
  const [isWaitingForPermissions, setIsWaitingForPermissions] = useState(true);

  // Forzar la carga de permisos cuando el componente se monta
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔄 RoleBasedRedirect: Forzando carga de permisos...');
      refetchPermissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  // Esperar a que los permisos se carguen
  useEffect(() => {
    if (!permissionsLoading && permissions !== null) {
      setIsWaitingForPermissions(false);
    }
    // Si no hay loading y ya intentamos cargar, esperar un poco más para el primer intento
    if (!permissionsLoading && permissions === null && isAuthenticated && user) {
      const timer = setTimeout(() => {
        setIsWaitingForPermissions(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [permissionsLoading, permissions, isAuthenticated, user]);

  useEffect(() => {
    console.log('🔄 RoleBasedRedirect: Checking...', {
      isAuthenticated,
      user: !!user,
      permissionsLoading,
      isWaitingForPermissions,
      hasRedirected: hasRedirected.current,
      permissions
    });

    // Solo proceder si el usuario está autenticado, no estamos esperando permisos y no hemos redirigido
    if (!isAuthenticated || !user || permissionsLoading || isWaitingForPermissions || hasRedirected.current) {
      return;
    }

    const userType = getUserType();
    console.log('👤 RoleBasedRedirect: UserType =', userType);
    
    hasRedirected.current = true;

    // Redirigir según el tipo de usuario
    if (userType === 'super-admin' || userType === 'admin-store') {
      const redirectPath = userType === 'super-admin' ? '/admin/super' : '/admin/store';
      console.log('🚀 RoleBasedRedirect: Redirecting admin to', redirectPath);
      router.push(redirectPath);
      // Para admins, esperar un momento antes de cerrar el modal para que la redirección tenga efecto
      setTimeout(() => {
        onRedirectComplete?.();
      }, 300);
    } else {
      // Para clientes, cerrar el modal inmediatamente
      console.log('✅ RoleBasedRedirect: Closing modal for client/guest');
      onRedirectComplete?.();
    }
  }, [isAuthenticated, user, permissionsLoading, isWaitingForPermissions, permissions, router, onRedirectComplete, getUserType]);

  // Mostrar loading mientras se procesan los permisos
  if (isAuthenticated && (permissionsLoading || isWaitingForPermissions)) {
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