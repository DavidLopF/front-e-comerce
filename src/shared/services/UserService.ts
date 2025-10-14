import { api } from '../api/client';
import { AuthService } from './AuthService';

export interface User {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  address?: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'vip';
  avatar?: string;
}

export interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Datos mock para desarrollo local
const mockUsers: User[] = [
  {
    id: "1",
    email: "ana.garcia@email.com",
    displayName: "Ana García",
    phone: "+1 234 567 8901",
    address: "Calle 123, Ciudad, País",
    joinDate: "2023-01-15",
    totalOrders: 12,
    totalSpent: 1540.50,
    status: "active"
  },
  {
    id: "2",
    email: "carlos.lopez@email.com",
    displayName: "Carlos López",
    phone: "+1 234 567 8902",
    address: "Avenida 456, Ciudad, País",
    joinDate: "2023-02-20",
    totalOrders: 8,
    totalSpent: 890.25,
    status: "active"
  },
  {
    id: "3",
    email: "maria.rodriguez@email.com",
    displayName: "María Rodríguez",
    phone: "+1 234 567 8903",
    address: "Plaza 789, Ciudad, País",
    joinDate: "2023-03-10",
    totalOrders: 15,
    totalSpent: 2340.80,
    status: "inactive"
  },
  {
    id: "4",
    email: "juan.martinez@email.com",
    displayName: "Juan Martínez",
    phone: "+1 234 567 8904",
    address: "Carrera 321, Ciudad, País",
    joinDate: "2023-04-05",
    totalOrders: 6,
    totalSpent: 445.30,
    status: "active"
  },
  {
    id: "5",
    email: "laura.sanchez@email.com",
    displayName: "Laura Sánchez",
    phone: "+1 234 567 8905",
    address: "Diagonal 654, Ciudad, País",
    joinDate: "2023-05-12",
    totalOrders: 20,
    totalSpent: 3120.75,
    status: "vip"
  }
];

export class UserService {
  /**
   * Obtener usuarios por tienda (Solo Admins)
   * @param storeId ID de la tienda
   * @param limit Número de usuarios por página (opcional)
   * @param page Número de página para paginación (opcional)
   */
  static async getUsersByStore(
    storeId: string,
    limit: number = 10,
    page: number = 1
  ): Promise<GetUsersResponse> {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      params.append('page', page.toString());

      const token = AuthService.getCurrentUserToken();
      const queryString = params.toString();
      const url = `/users/store/${storeId}?${queryString}`;

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await api.get<GetUsersResponse>(url, { headers });
      return response;
    } catch (error) {
      console.error('Error al obtener usuarios, usando datos mock:', error);
      
      // Si hay error con la API, usar datos mock
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = mockUsers.slice(startIndex, endIndex);
      
      return {
        users: paginatedUsers,
        total: mockUsers.length,
        page,
        limit,
        hasMore: endIndex < mockUsers.length
      };
    }
  }

  /**
   * Obtener estadísticas de usuarios por tienda
   * @param storeId ID de la tienda
   */
  static async getUserStats(storeId: string) {
    try {
      const response = await this.getUsersByStore(storeId);
      
      const totalUsers = response.total;
      const totalSpent = response.users.reduce((sum, user) => sum + user.totalSpent, 0);
      const vipUsers = response.users.filter(user => user.status === 'vip').length;
      const activeUsers = response.users.filter(user => user.status === 'active').length;
      
      // Calcular usuarios nuevos del mes actual
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const newThisMonth = response.users.filter(user => {
        const joinDate = new Date(user.joinDate);
        return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
      }).length;

      return {
        totalUsers,
        totalSpent,
        vipUsers,
        activeUsers,
        newThisMonth
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
}