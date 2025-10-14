"use client";

import { usePermissions } from '@/shared/hooks/usePermissions';
import { useAuth } from '@/shared/providers/AuthProvider';
import { useStoreConfigContext } from '@/shared/providers/StoreConfigProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StoreAdminPage() {
  const { user, logout } = useAuth();
  const { isStoreAdmin, loading, permissions } = usePermissions();
  const { config } = useStoreConfigContext();
  const router = useRouter();

  const primaryColor = config?.theme?.colors?.primary || '#3b82f6';
  const normalizedPrimary = primaryColor.startsWith('#') ? primaryColor : `#${primaryColor}`;

  useEffect(() => {
    // Verificar que el usuario tenga permisos de admin de tienda
    // Solo redirigir si los permisos ya se cargaron y el usuario NO es admin
    if (!loading && permissions && !isStoreAdmin()) {
      router.push('/');
    }
  }, [loading, permissions, isStoreAdmin, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!isStoreAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta página</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administrador</h1>
              <p className="text-gray-600">{config?.store?.name || 'Mi Tienda'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.displayName?.[0] || user?.email?.[0] || 'A'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.displayName || 'Admin'}</p>
                  <p className="text-xs text-gray-600">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta de Productos */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md" style={{ backgroundColor: `${normalizedPrimary}20` }}>
                <svg className="w-8 h-8" style={{ color: normalizedPrimary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Productos</h3>
                <p className="text-gray-600">Gestionar inventario</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                className="w-full py-2 px-4 rounded-lg text-white font-medium"
                style={{ backgroundColor: normalizedPrimary }}
              >
                Administrar Productos
              </button>
            </div>
          </div>

          {/* Tarjeta de Pedidos */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md" style={{ backgroundColor: `${normalizedPrimary}20` }}>
                <svg className="w-8 h-8" style={{ color: normalizedPrimary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Pedidos</h3>
                <p className="text-gray-600">Ver y gestionar pedidos</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                className="w-full py-2 px-4 rounded-lg text-white font-medium"
                style={{ backgroundColor: normalizedPrimary }}
              >
                Ver Pedidos
              </button>
            </div>
          </div>

          {/* Tarjeta de Configuración */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md" style={{ backgroundColor: `${normalizedPrimary}20` }}>
                <svg className="w-8 h-8" style={{ color: normalizedPrimary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Configuración</h3>
                <p className="text-gray-600">Configurar tienda</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                className="w-full py-2 px-4 rounded-lg text-white font-medium"
                style={{ backgroundColor: normalizedPrimary }}
              >
                Configurar Tienda
              </button>
            </div>
          </div>
        </div>

        {/* Información de Permisos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Permisos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Roles:</h4>
              <ul className="space-y-1">
                {permissions?.roles?.map((role, index) => (
                  <li key={index} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {role}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Permisos:</h4>
              <ul className="space-y-1">
                {permissions?.permissions?.map((permission, index) => (
                  <li key={index} className="text-sm text-gray-600 bg-blue-100 px-2 py-1 rounded">
                    {permission}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}