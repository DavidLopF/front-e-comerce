"use client";

import { usePermissions } from "@/shared/hooks/usePermissions";
import { useStoreConfigContext } from "@/shared/providers/StoreConfigProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLayout from "@/shared/ui/AdminLayout";
import { UserService, User } from "@/shared/services/UserService";
import { 
  Button, 
  Badge, 
  TextInput, 
  Select
} from 'flowbite-react';
import { 
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign
} from 'lucide-react';



export default function CustomersAdminPage() {
  const { isStoreAdmin, loading, permissions } = usePermissions();
  const { config } = useStoreConfigContext();
  const router = useRouter();
  const [customers, setCustomers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingData, setLoadingData] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSpent: 0,
    newThisMonth: 0
  });

  // Función para cargar datos de usuarios
  const loadCustomers = async () => {
    // Usamos un ID temporal para la tienda (en producción esto vendría del contexto o configuración)
    const storeId = "store123"; // TODO: Obtener el ID real de la tienda
    
    setLoadingData(true);
    try {
      const response = await UserService.getUsersByStore(storeId);
      setCustomers(response.users);
      
      const statsData = await UserService.getUserStats(storeId);
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      // Los datos mock se cargan automáticamente en caso de error
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!loading && permissions && !isStoreAdmin()) {
      router.push("/");
    }
  }, [loading, permissions, isStoreAdmin, router]);

  // Cargar datos cuando el componente se monta
  useEffect(() => {
    if (config?.store && isStoreAdmin()) {
      loadCustomers();
    }
  }, [config?.store, isStoreAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!isStoreAdmin()) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta página</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // Filtrar clientes basado en búsqueda y estado
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });



  // Funciones para manejar acciones
  const handleViewCustomer = (customer: User) => {
    alert(`Viendo detalles de: ${customer.displayName}\nEmail: ${customer.email}\nPedidos: ${customer.totalOrders}\nTotal gastado: $${customer.totalSpent}`);
  };

  const handleEditCustomer = (customerId: string) => {
    // Implementar edición
    console.log("Editando cliente:", customerId);
    alert("Función de edición - En desarrollo");
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
      setCustomers(customers.filter(c => c.id !== customerId));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge color="success" size="sm">Activo</Badge>;
      case 'inactive':
        return <Badge color="gray" size="sm">Inactivo</Badge>;
      case 'vip':
        return <Badge color="purple" size="sm">VIP</Badge>;
      default:
        return <Badge color="gray" size="sm">Desconocido</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout currentPage="customers">
      <div className="p-6 bg-white min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Clientes</h1>
              <p className="text-gray-600">Administra y visualiza información de los clientes</p>
            </div>
            <Button color="blue" size="md">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Cliente
            </Button>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 rounded-lg bg-blue-100">
                <ShoppingBag className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-6">
                <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loadingData ? "..." : stats.totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 rounded-lg bg-green-100">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-6">
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loadingData ? "..." : formatCurrency(stats.totalSpent)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 rounded-lg bg-orange-100">
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
              <div className="ml-6">
                <p className="text-sm font-medium text-gray-600">Nuevos este Mes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loadingData ? "..." : stats.newThisMonth}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <TextInput
                icon={Search}
                placeholder="Buscar clientes por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                icon={Filter}
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="vip">VIP</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabla de Clientes */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedidos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Gastado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-medium">
                            {customer.displayName.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.displayName}</div>
                          <div className="text-sm text-gray-500">ID: {customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="flex items-center mb-1">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{customer.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(customer.joinDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.totalOrders} pedidos
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(customer.totalSpent)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(customer.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="xs"
                          color="blue"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="xs"
                          color="gray"
                          onClick={() => handleEditCustomer(customer.id)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="xs"
                          color="red"
                          onClick={() => handleDeleteCustomer(customer.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {loadingData && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando clientes...</p>
          </div>
        )}

        {!loadingData && filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No se encontraron clientes</div>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== "all" 
                ? "Intenta ajustar los filtros de búsqueda"
                : "Aún no tienes clientes registrados"
              }
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}