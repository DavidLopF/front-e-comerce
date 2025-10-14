"use client";

import { usePermissions } from "@/shared/hooks/usePermissions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminLayout from "@/shared/ui/AdminLayout";
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
  Cell,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Package,
  ShoppingCart,
  Settings,
} from "lucide-react";

// Datos de ejemplo para las gráficas
const revenueData = [
  { name: "Ene", value: 4000, customers: 2400 },
  { name: "Feb", value: 3000, customers: 1398 },
  { name: "Mar", value: 2000, customers: 9800 },
  { name: "Abr", value: 2780, customers: 3908 },
  { name: "May", value: 1890, customers: 4800 },
  { name: "Jun", value: 2390, customers: 3800 },
  { name: "Jul", value: 3490, customers: 4300 },
];

const deviceData = [
  { name: "Desktop", value: 55, color: "#3b82f6" },
  { name: "Mobile", value: 35, color: "#f97316" },
  { name: "Tablet", value: 10, color: "#06b6d4" },
];

export default function StoreAdminPage() {
  const { isStoreAdmin, loading, permissions } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!loading && permissions && !isStoreAdmin()) {
      router.push("/");
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
            onClick={() => router.push("/")}
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
      <div className="p-6 bg-white min-h-screen">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administrador</h1>
          <p className="text-gray-600">Resumen de la actividad de tu tienda</p>
        </div>

        {/* Sección de Acciones Rápidas */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Acciones Rápidas</h2>
            <div className="ml-4 h-px bg-gray-300 flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Gestionar Productos */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-500 bg-opacity-20">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Gestionar Productos</h3>
                  <p className="text-sm text-gray-600">Agregar, editar y administrar inventario</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Productos en stock</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                Administrar Productos
                <Package className="ml-2 w-4 h-4" />
              </button>
            </div>

            {/* Gestionar Pedidos */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-green-500 bg-opacity-20">
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
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                Ver Pedidos
                <ShoppingCart className="ml-2 w-4 h-4" />
              </button>
            </div>

            {/* Configuración */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-purple-500 bg-opacity-20">
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
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "90%" }}></div>
                </div>
              </div>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                Configurar Tienda
                <Settings className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sección de Estadísticas y Métricas */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Estadísticas y Métricas</h2>
            <div className="ml-4 h-px bg-gray-300 flex-1"></div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Revenue Card */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos</p>
                  <p className="text-2xl font-bold text-gray-900">$163.4k</p>
                  <div className="flex items-center mt-1">
                    <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-500">-2.4%</span>
                  </div>
                </div>
                <div className="w-16 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData.slice(-4)}>
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Customers Card */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clientes</p>
                  <p className="text-2xl font-bold text-gray-900">1.5M</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">+1.24%</span>
                  </div>
                </div>
                <div className="w-16 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData.slice(-4)}>
                      <Line type="monotone" dataKey="customers" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Conversion Rate Card */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tasa de conversión</p>
                  <p className="text-2xl font-bold text-gray-900">0.7%</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">+2%</span>
                  </div>
                </div>
                <div className="w-16 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData.slice(-4)}>
                      <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Device Stats */}
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 border border-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600">Uso por Dispositivo</p>
              </div>
              <div className="space-y-3">
                {deviceData.map((device, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: device.color }}></div>
                      <span className="text-sm text-gray-600">{device.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{device.value}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="flex rounded-full overflow-hidden h-2 bg-gray-200">
                  {deviceData.map((device, index) => (
                    <div
                      key={index}
                      className="h-2"
                      style={{ backgroundColor: device.color, width: `${device.value}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Gráficas Principales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Website Performance */}
            <div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Rendimiento del Sitio Web</h3>
                  <p className="text-sm text-gray-500 mt-1">Estadísticas del último mes</p>
                </div>
                <div className="bg-blue-50 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-blue-600">Último mes</span>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="flex items-center mb-1">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">4.5%</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">163.4M</div>
                  <div className="text-sm text-gray-500">Visitas del último mes</div>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-500">1.12%</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">$768k</div>
                  <div className="text-sm text-gray-500">Ingresos del último mes</div>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">2%</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">6,567</div>
                  <div className="text-sm text-gray-500">Transacciones promedio</div>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">4.5%</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">6,010</div>
                  <div className="text-sm text-gray-500">Clientes</div>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} />
                    <Line type="monotone" dataKey="customers" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Dispositivos Chart */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Uso por Dispositivo</h3>
                <p className="text-sm text-gray-500 mt-1">Distribución de visitantes por tipo de dispositivo</p>
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
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-gray-900">100k</div>
                <div className="text-sm text-gray-500">Visitantes únicos</div>
              </div>

              <div className="space-y-3">
                {deviceData.map((device, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: device.color }}></div>
                      <span className="text-sm text-gray-600">{device.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{device.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}