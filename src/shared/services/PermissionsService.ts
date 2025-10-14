export interface BackendRole {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  userId: string;
  storeId: string;
  roleId: string;
  role: BackendRole;
}

export interface BackendPermissionsResponse {
  roles: UserRole[];
}

export interface UserPermissions {
  roles: string[];
  permissions: string[];
}

export class PermissionsService {
  private static readonly API_URL = process.env.NEXT_PUBLIC_API_URL;

  /**
   * Obtener permisos del usuario por Firebase UID
   */
  static async getUserPermissions(firebaseUid: string, storeId: string, token?: string): Promise<UserPermissions | null> {
    const url = `${this.API_URL}/users/permissions/${firebaseUid}/${storeId}`;

    try {
      const headers: HeadersInit = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const backendResponse: BackendPermissionsResponse = await response.json();

      // Transformar la respuesta del backend al formato esperado por el frontend
      const roleNames = backendResponse.roles?.map(userRole => userRole.role.name) || [];

      const userPermissions: UserPermissions = {
        roles: roleNames,
        permissions: []
      };

      return userPermissions;
    } catch (error) {
      console.error('❌ PermissionsService: Error obteniendo permisos:', error);
      return null;
    }
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  static hasRole(userPermissions: UserPermissions | null, roleId: string): boolean {
    return userPermissions?.roles?.includes(roleId) || false;
  }

  /**
   * Verificar si el usuario es super admin
   */
  static isSuperAdmin(userPermissions: UserPermissions | null): boolean {
    return this.hasRole(userPermissions, 'super-admin');
  }

  /**
   * Verificar si el usuario es admin de tienda
   */
  static isStoreAdmin(userPermissions: UserPermissions | null): boolean {
    return this.hasRole(userPermissions, 'admin-store');
  }

  /**
   * Verificar si el usuario es un usuario regular de la tienda
   */
  static isStoreUser(userPermissions: UserPermissions | null): boolean {
    return this.hasRole(userPermissions, 'user-store');
  }

  /**
   * Obtener el tipo de usuario basado en sus roles (prioridad: super-admin > admin-store > user-store > guest)
   */
  static getUserType(userPermissions: UserPermissions | null): 'super-admin' | 'admin-store' | 'user-store' | 'guest' {
    if (this.isSuperAdmin(userPermissions)) return 'super-admin';
    if (this.isStoreAdmin(userPermissions)) return 'admin-store';
    if (this.isStoreUser(userPermissions)) return 'user-store';
    return 'guest';
  }

  /**
   * Verificar si el usuario tiene un permiso específico
   */
  static hasPermission(userPermissions: UserPermissions | null, permission: string): boolean {
    return userPermissions?.permissions?.includes(permission) || false;
  }
}