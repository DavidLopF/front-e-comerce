"use client";

import { usePermissions } from "@/shared/hooks/usePermissions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminLayout from "@/shared/ui/AdminLayout";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowUpRight,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  Star,
} from "lucide-react";

// ============ DATOS MOCKUP - MÉTRICAS DE NEGOCIO ============

// Ventas mensuales
const ventasMensuales = [
  { mes: "Ago", ventas: 2850000, pedidos: 45 },
  { mes: "Sep", ventas: 3200000, pedidos: 52 },
  { mes: "Oct", ventas: 4100000, pedidos: 68 },
  { mes: "Nov", ventas: 5800000, pedidos: 95 },
];

// Productos más vendidos
const productosTopVentas = [
  { id: 1, nombre: "Camiseta Premium Negra", ventas: 156, ingresos: 12480000, stock: 45, imagen: "👕" },
  { id: 2, nombre: "Zapatillas Running Pro", ventas: 89, ingresos: 17800000, stock: 12, imagen: "👟" },
  { id: 3, nombre: "Mochila Urban Style", ventas: 78, ingresos: 7020000, stock: 34, imagen: "🎒" },
  { id: 4, nombre: "Reloj Smart Watch X", ventas: 65, ingresos: 19500000, stock: 8, imagen: "⌚" },
  { id: 5, nombre: "Auriculares Bluetooth", ventas: 54, ingresos: 4320000, stock: 67, imagen: "🎧" },
];

// Categorías más vendidas
const categoriasPorVentas = [
  { categoria: "Ropa", ventas: 45, color: "#3b82f6" },
  { categoria: "Calzado", ventas: 25, color: "#10b981" },
  { categoria: "Accesorios", ventas: 18, color: "#f59e0b" },
  { categoria: "Electrónica", ventas: 12, color: "#8b5cf6" },
];

// Pedidos recientes
const pedidosRecientes = [
  { id: "PED-2024-001", cliente: "María García", total: 285000, estado: "entregado", fecha: "Hace 2 horas", items: 3 },
  { id: "PED-2024-002", cliente: "Carlos López", total: 450000, estado: "enviado", fecha: "Hace 4 horas", items: 2 },
  { id: "PED-2024-003", cliente: "Ana Martínez", total: 125000, estado: "procesando", fecha: "Hace 5 horas", items: 1 },
  { id: "PED-2024-004", cliente: "Juan Rodríguez", total: 890000, estado: "pendiente", fecha: "Hace 6 horas", items: 5 },
  { id: "PED-2024-005", cliente: "Laura Sánchez", total: 340000, estado: "cancelado", fecha: "Hace 8 horas", items: 2 },
];

// Productos con bajo stock
const productosStockBajo = [
  { nombre: "Reloj Smart Watch X", stock: 8, minimo: 15, imagen: "⌚" },
  { nombre: "Zapatillas Running Pro", stock: 12, minimo: 20, imagen: "👟" },
  { nombre: "Chaqueta Impermeable", stock: 5, minimo: 10, imagen: "🧥" },
  { nombre: "Gafas de Sol Premium", stock: 3, minimo: 8, imagen: "🕶️" },
];

// Métodos de pago más usados
const metodosPago = [
  { metodo: "Tarjeta Crédito", porcentaje: 45, color: "#3b82f6" },
  { metodo: "PSE", porcentaje: 30, color: "#10b981" },
  { metodo: "Efectivo (Contraentrega)", porcentaje: 15, color: "#f59e0b" },
  { metodo: "MercadoPago", porcentaje: 10, color: "#8b5cf6" },
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
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Ventas</h1>
          <p className="text-gray-600">Resumen del rendimiento de tu negocio - Noviembre 2024</p>
        </div>

        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Ventas del Mes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-100">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +41.5%
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Ventas del Mes</p>
            <p className="text-2xl font-bold text-gray-900">$5.800.000</p>
            <p className="text-xs text-gray-400 mt-2">vs $4.100.000 mes anterior</p>
          </div>

          {/* Pedidos Totales */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +39.7%
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Pedidos del Mes</p>
            <p className="text-2xl font-bold text-gray-900">95</p>
            <p className="text-xs text-gray-400 mt-2">vs 68 mes anterior</p>
          </div>

          {/* Ticket Promedio */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +1.3%
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Ticket Promedio</p>
            <p className="text-2xl font-bold text-gray-900">$61.053</p>
            <p className="text-xs text-gray-400 mt-2">Valor promedio por pedido</p>
          </div>

          {/* Clientes Nuevos */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-orange-100">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +28%
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Clientes Nuevos</p>
            <p className="text-2xl font-bold text-gray-900">32</p>
            <p className="text-xs text-gray-400 mt-2">vs 25 mes anterior</p>
          </div>
        </div>

        {/* Gráfica de Ventas y Productos Top */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Gráfica de Ventas */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tendencia de Ventas</h3>
                <p className="text-sm text-gray-500">Últimos 4 meses</p>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-gray-600">Ventas ($M)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-gray-600">Pedidos</span>
                </div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ventasMensuales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" stroke="#888" />
                  <YAxis yAxisId="left" stroke="#3b82f6" tickFormatter={(value) => `$${value/1000000}M`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'ventas' ? `$${value.toLocaleString()}` : value,
                      name === 'ventas' ? 'Ventas' : 'Pedidos'
                    ]}
                  />
                  <Bar yAxisId="left" dataKey="ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="pedidos" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categorías más vendidas */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ventas por Categoría</h3>
            <p className="text-sm text-gray-500 mb-6">Distribución de ventas</p>
            
            <div className="flex justify-center mb-6">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoriasPorVentas}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="ventas"
                    >
                      {categoriasPorVentas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Porcentaje']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-3">
              {categoriasPorVentas.map((cat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-sm text-gray-700">{cat.categoria}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{cat.ventas}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Productos Top y Pedidos Recientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Productos Más Vendidos */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h3>
                <p className="text-sm text-gray-500">Top 5 del mes</p>
              </div>
              <button className="text-blue-600 text-sm font-medium hover:underline flex items-center">
                Ver todos <Eye className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="space-y-4">
              {productosTopVentas.map((producto, index) => (
                <div key={producto.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center text-xl mr-3">
                      {producto.imagen}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{producto.nombre}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 mr-1" />
                          {producto.ventas} vendidos
                        </span>
                        <span className="mx-2">•</span>
                        <span className={producto.stock < 15 ? 'text-red-500' : 'text-gray-500'}>
                          Stock: {producto.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${(producto.ingresos / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-gray-500">#{index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pedidos Recientes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pedidos Recientes</h3>
                <p className="text-sm text-gray-500">Últimas transacciones</p>
              </div>
              <button className="text-blue-600 text-sm font-medium hover:underline flex items-center">
                Ver todos <Eye className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="space-y-3">
              {pedidosRecientes.map((pedido) => (
                <div key={pedido.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      pedido.estado === 'entregado' ? 'bg-green-100' :
                      pedido.estado === 'enviado' ? 'bg-blue-100' :
                      pedido.estado === 'procesando' ? 'bg-yellow-100' :
                      pedido.estado === 'pendiente' ? 'bg-orange-100' : 'bg-red-100'
                    }`}>
                      {pedido.estado === 'entregado' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                       pedido.estado === 'enviado' ? <Truck className="w-5 h-5 text-blue-600" /> :
                       pedido.estado === 'procesando' ? <Clock className="w-5 h-5 text-yellow-600" /> :
                       pedido.estado === 'pendiente' ? <Package className="w-5 h-5 text-orange-600" /> :
                       <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{pedido.id}</p>
                      <p className="text-xs text-gray-500">{pedido.cliente} • {pedido.items} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${pedido.total.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{pedido.fecha}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alertas y Métodos de Pago */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alertas de Stock Bajo */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-lg bg-red-100 mr-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Alertas de Stock</h3>
                <p className="text-sm text-gray-500">Productos con inventario bajo</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {productosStockBajo.map((producto, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{producto.imagen}</span>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{producto.nombre}</p>
                      <p className="text-xs text-red-600">Mínimo recomendado: {producto.minimo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">{producto.stock}</p>
                    <p className="text-xs text-gray-500">en stock</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
              <Package className="w-4 h-4 mr-2" />
              Gestionar Inventario
            </button>
          </div>

          {/* Métodos de Pago */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-lg bg-blue-100 mr-3">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Métodos de Pago</h3>
                <p className="text-sm text-gray-500">Preferencia de los clientes</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {metodosPago.map((metodo, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">{metodo.metodo}</span>
                    <span className="text-sm font-semibold text-gray-900">{metodo.porcentaje}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${metodo.porcentaje}%`, backgroundColor: metodo.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Total Transacciones</p>
                  <p className="text-xs text-gray-500">Este mes</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">$5.8M</p>
                  <p className="text-xs text-green-600">+41.5% vs anterior</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}