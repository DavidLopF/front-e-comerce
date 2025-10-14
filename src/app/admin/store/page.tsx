"use client";

import { usePermissions } from '@/shared/hooks/usePermissions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLayout from '@/shared/ui/AdminLayout';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  ArrowUpRight,
  ArrowDownRight,
  Package,
  ShoppingCart,
  Settings
} from 'lucide-react';

// Datos de ejemplo para las gráficas
const revenueData = [
  { name: 'Ene', value: 4000, customers: 2400 },
  { name: 'Feb', value: 3000, customers: 1398 },
  { name: 'Mar', value: 2000, customers: 9800 },
  { name: 'Abr', value: 2780, customers: 3908 },
  { name: 'May', value: 1890, customers: 4800 },
  { name: 'Jun', value: 2390, customers: 3800 },
  { name: 'Jul', value: 3490, customers: 4300 },
];

const deviceData = [
  { name: 'Desktop', value: 55, color: '#3b82f6' },
  { name: 'Mobile', value: 35, color: '#f97316' },
  { name: 'Tablet', value: 10, color: '#06b6d4' },
];

export default function StoreAdminPage() {
  const { isStoreAdmin, loading, permissions } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    // Verificar que el usuario tenga permisos de admin de tienda
    // Solo redirigir si los permisos ya se cargaron y el usuario NO es admin
    if (!loading && permissions && !isStoreAdmin()) {
      router.push('/');
    }
  }, [loading, permissions, isStoreAdmin, router]);

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
    <AdminLayout currentPage="dashboard">
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Revenue Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$163.4k</p>
                <div className="flex items-center mt-1">
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-500">-2.4%</span>
                </div>
              </div>
              <div className="w-16 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData.slice(-4)}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Customers Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-gray-900">1.5M</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+1.24%</span>
                </div>
              </div>
              <div className="w-16 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData.slice(-4)}>
                    <Line 
                      type="monotone" 
                      dataKey="customers" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Conversion Rate Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion rate</p>
                <p className="text-2xl font-bold text-gray-900">0.7%</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+2%</span>
                </div>
              </div>
              <div className="w-16 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData.slice(-4)}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Device Stats */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Device Usage</p>
              </div>
            </div>
            <div className="space-y-3">
              {deviceData.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: device.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{device.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{device.value}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex">
              {deviceData.map((device, index) => (
                <div 
                  key={index}
                  className="h-2 first:rounded-l-full last:rounded-r-full"
                  style={{ 
                    backgroundColor: device.color,
                    width: `${device.value}%`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Website Performance */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Website performance</h3>
              <div className="text-sm text-gray-500">Last month website stats.</div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <div className="flex items-center mb-1">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">4.5%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">163.4M</div>
                <div className="text-sm text-gray-500">Last month website visits</div>
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-500">1.12%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">$768k</div>
                <div className="text-sm text-gray-500">Last month revenue</div>
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">2%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">6,567</div>
                <div className="text-sm text-gray-500">Avg transaction</div>
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">4.5%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">6,010</div>
                <div className="text-sm text-gray-500">Customers</div>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="customers" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Referrers */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Referrers</h3>
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-gray-900">100k</div>
              <div className="text-sm text-gray-500">Unique visitors</div>
            </div>

            <div className="space-y-3">
              {deviceData.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: device.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{device.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{device.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gestionar Productos */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Gestionar Productos</h3>
                <p className="text-sm text-gray-600">Agregar, editar y administrar el inventario de productos</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Productos en stock</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              Administrar Productos
              <Package className="ml-2 w-4 h-4" />
            </button>
          </div>

          {/* Gestionar Pedidos */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-lg bg-green-100">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Gestionar Pedidos</h3>
                <p className="text-sm text-gray-600">Ver y procesar pedidos de clientes</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Pedidos pendientes</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
              Ver Pedidos
              <ShoppingCart className="ml-2 w-4 h-4" />
            </button>
          </div>

          {/* Configuración */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Configuración</h3>
                <p className="text-sm text-gray-600">Personalizar configuración de la tienda</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Configuración completa</span>
                <span>90%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
              Configurar Tienda
              <Settings className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}