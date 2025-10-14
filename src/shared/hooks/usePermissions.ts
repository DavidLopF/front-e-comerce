"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/shared/providers/AuthProvider';
import { PermissionsService, UserPermissions } from '@/shared/services/PermissionsService';
import { AuthService } from '@/shared/services/AuthService';

export function usePermissions() {
  const { user, isAuthenticated } = useAuth();
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [hasLoadedForUser, setHasLoadedForUser] = useState<string | null>(null);

  const loadPermissions = useCallback(async (forceReload = false) => {
    const userKey = user?.uid;
    
    if (!userKey || !isAuthenticated) {
      console.log('❌ usePermissions: Usuario no autenticado o sin UID');
      setPermissions(null);
      setHasLoadedForUser(null);
      return;
    }

    // Evitar cargas duplicadas para el mismo usuario
    if (hasLoadedForUser === userKey && !forceReload) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await AuthService.getCurrentUserToken();
      const storeId = process.env.NEXT_STORE_NAME || 'techstore-pro';
      
      const userPermissions = await PermissionsService.getUserPermissions(
        userKey,
        storeId,
        token || undefined
      );

      setPermissions(userPermissions);
      setHasLoadedForUser(userKey);
    } catch (err) {
      console.error('❌ usePermissions: Error cargando permisos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setPermissions(null);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, isAuthenticated, hasLoadedForUser]);

  useEffect(() => {
    const userKey = user?.uid;
    
    if (userKey && isAuthenticated && hasLoadedForUser !== userKey) {
      loadPermissions();
    }
  }, [user?.uid, isAuthenticated, hasLoadedForUser, loadPermissions]);

  // Funciones de utilidad
  const hasRole = useCallback((roleId: string) => {
    return PermissionsService.hasRole(permissions, roleId);
  }, [permissions]);

  const hasPermission = useCallback((permission: string) => {
    return PermissionsService.hasPermission(permissions, permission);
  }, [permissions]);

  const isSuperAdmin = useCallback(() => {
    return PermissionsService.isSuperAdmin(permissions);
  }, [permissions]);

  const isStoreAdmin = useCallback(() => {
    return PermissionsService.isStoreAdmin(permissions);
  }, [permissions]);

  const isStoreUser = useCallback(() => {
    return PermissionsService.isStoreUser(permissions);
  }, [permissions]);

  const getUserType = useCallback(() => {
    return PermissionsService.getUserType(permissions);
  }, [permissions]);

  return {
    permissions,
    loading,
    error,
    hasRole,
    hasPermission,
    isSuperAdmin,
    isStoreAdmin,
    isStoreUser,
    getUserType,
    refetchPermissions: () => loadPermissions(true)
  };
}