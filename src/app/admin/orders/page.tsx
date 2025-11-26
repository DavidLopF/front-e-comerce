"use client";

import { usePermissions } from "@/shared/hooks/usePermissions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLayout from "@/shared/ui/AdminLayout";
import OrderDetailModal from "@/shared/ui/OrderDetailModal";
import {
  Button,
  Card,
  StatCard,
  SearchInput,
  Select,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Badge,
  Avatar,
  LoadingState,
} from "@/shared/components";
import {
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Eye,
  Calendar,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// ============ TIPOS ============

export interface OrderItem {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
  imagen: string;
  variante?: string;
}

export interface Order {
  id: string;
  numeroOrden: string;
  cliente: { nombre: string; email: string; telefono: string; };
  items: OrderItem[];
  subtotal: number;
  envio: number;
  total: number;
  estado: "pendiente" | "procesando" | "enviado" | "entregado" | "cancelado";
  metodoPago: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  direccionEnvio: { calle: string; ciudad: string; departamento: string; codigoPostal: string; pais: string; };
  notas?: string;
  tracking?: string;
}

// ============ DATOS MOCKUP ============

const pedidosMockup: Order[] = [
  { id: "1", numeroOrden: "PED-2024-001", cliente: { nombre: "María García López", email: "maria.garcia@email.com", telefono: "+57 300 123 4567" }, items: [{ id: "1", nombre: "Camiseta Premium Negra", cantidad: 2, precio: 79900, imagen: "👕", variante: "Talla M" }, { id: "2", nombre: "Gorra Snapback Urban", cantidad: 1, precio: 39900, imagen: "🧢" }], subtotal: 199700, envio: 15000, total: 214700, estado: "pendiente", metodoPago: "Tarjeta de Crédito", fechaCreacion: "2024-11-26T10:30:00", fechaActualizacion: "2024-11-26T10:30:00", direccionEnvio: { calle: "Calle 123 #45-67, Apto 301", ciudad: "Bogotá", departamento: "Cundinamarca", codigoPostal: "110111", pais: "Colombia" }, notas: "Entregar en horario de tarde" },
  { id: "2", numeroOrden: "PED-2024-002", cliente: { nombre: "Carlos Andrés López", email: "carlos.lopez@email.com", telefono: "+57 311 987 6543" }, items: [{ id: "3", nombre: "Zapatillas Running Pro", cantidad: 1, precio: 259900, imagen: "👟", variante: "Talla 42" }], subtotal: 259900, envio: 0, total: 259900, estado: "pendiente", metodoPago: "PSE", fechaCreacion: "2024-11-26T09:15:00", fechaActualizacion: "2024-11-26T09:15:00", direccionEnvio: { calle: "Carrera 50 #30-20", ciudad: "Medellín", departamento: "Antioquia", codigoPostal: "050001", pais: "Colombia" } },
  { id: "3", numeroOrden: "PED-2024-003", cliente: { nombre: "Ana María Martínez", email: "ana.martinez@email.com", telefono: "+57 315 456 7890" }, items: [{ id: "4", nombre: "Mochila Urban Style", cantidad: 1, precio: 99900, imagen: "🎒" }, { id: "5", nombre: "Auriculares Bluetooth Pro", cantidad: 1, precio: 189900, imagen: "🎧" }], subtotal: 289800, envio: 12000, total: 301800, estado: "procesando", metodoPago: "Tarjeta de Crédito", fechaCreacion: "2024-11-25T16:45:00", fechaActualizacion: "2024-11-26T08:00:00", direccionEnvio: { calle: "Avenida 6N #25-30", ciudad: "Cali", departamento: "Valle del Cauca", codigoPostal: "760001", pais: "Colombia" } },
  { id: "4", numeroOrden: "PED-2024-004", cliente: { nombre: "Juan Pablo Rodríguez", email: "juan.rodriguez@email.com", telefono: "+57 320 111 2233" }, items: [{ id: "6", nombre: "Reloj Smart Watch X", cantidad: 1, precio: 450000, imagen: "⌚" }], subtotal: 450000, envio: 0, total: 450000, estado: "procesando", metodoPago: "MercadoPago", fechaCreacion: "2024-11-25T14:20:00", fechaActualizacion: "2024-11-26T09:30:00", direccionEnvio: { calle: "Calle 80 #15-45", ciudad: "Bogotá", departamento: "Cundinamarca", codigoPostal: "110121", pais: "Colombia" }, notas: "Regalo - incluir empaque especial" },
  { id: "5", numeroOrden: "PED-2024-005", cliente: { nombre: "Laura Sánchez Pérez", email: "laura.sanchez@email.com", telefono: "+57 318 222 3344" }, items: [{ id: "7", nombre: "Pantalón Jogger Classic", cantidad: 2, precio: 119900, imagen: "👖", variante: "Talla S" }], subtotal: 319700, envio: 15000, total: 334700, estado: "enviado", metodoPago: "Tarjeta de Crédito", fechaCreacion: "2024-11-24T11:00:00", fechaActualizacion: "2024-11-25T15:00:00", direccionEnvio: { calle: "Carrera 7 #45-67", ciudad: "Bucaramanga", departamento: "Santander", codigoPostal: "680001", pais: "Colombia" }, tracking: "COL123456789" },
  { id: "6", numeroOrden: "PED-2024-006", cliente: { nombre: "Diego Hernández", email: "diego.hernandez@email.com", telefono: "+57 301 333 4455" }, items: [{ id: "9", nombre: "Chaqueta Impermeable", cantidad: 1, precio: 289900, imagen: "🧥", variante: "Talla L" }], subtotal: 289900, envio: 18000, total: 307900, estado: "enviado", metodoPago: "PSE", fechaCreacion: "2024-11-23T09:30:00", fechaActualizacion: "2024-11-25T10:00:00", direccionEnvio: { calle: "Calle 10 #5-20", ciudad: "Cartagena", departamento: "Bolívar", codigoPostal: "130001", pais: "Colombia" }, tracking: "COL987654321" },
  { id: "7", numeroOrden: "PED-2024-007", cliente: { nombre: "Valentina Torres", email: "valentina.torres@email.com", telefono: "+57 316 444 5566" }, items: [{ id: "10", nombre: "Gafas de Sol Premium", cantidad: 1, precio: 159900, imagen: "🕶️" }], subtotal: 249800, envio: 12000, total: 261800, estado: "entregado", metodoPago: "Tarjeta de Crédito", fechaCreacion: "2024-11-20T14:00:00", fechaActualizacion: "2024-11-24T16:30:00", direccionEnvio: { calle: "Avenida El Dorado #68-90", ciudad: "Bogotá", departamento: "Cundinamarca", codigoPostal: "110131", pais: "Colombia" }, tracking: "COL456789123" },
  { id: "8", numeroOrden: "PED-2024-008", cliente: { nombre: "Sebastián Morales", email: "sebastian.morales@email.com", telefono: "+57 319 555 6677" }, items: [{ id: "12", nombre: "Zapatillas Running Pro", cantidad: 1, precio: 259900, imagen: "👟", variante: "Talla 44" }], subtotal: 639700, envio: 0, total: 639700, estado: "entregado", metodoPago: "MercadoPago", fechaCreacion: "2024-11-18T10:15:00", fechaActualizacion: "2024-11-22T11:00:00", direccionEnvio: { calle: "Carrera 15 #100-50", ciudad: "Bogotá", departamento: "Cundinamarca", codigoPostal: "110111", pais: "Colombia" }, tracking: "COL789123456" },
  { id: "9", numeroOrden: "PED-2024-009", cliente: { nombre: "Camila Ruiz", email: "camila.ruiz@email.com", telefono: "+57 322 666 7788" }, items: [{ id: "14", nombre: "Mochila Urban Style", cantidad: 1, precio: 99900, imagen: "🎒" }], subtotal: 99900, envio: 15000, total: 114900, estado: "cancelado", metodoPago: "PSE", fechaCreacion: "2024-11-22T08:45:00", fechaActualizacion: "2024-11-22T12:00:00", direccionEnvio: { calle: "Calle 50 #40-30", ciudad: "Pereira", departamento: "Risaralda", codigoPostal: "660001", pais: "Colombia" }, notas: "Cancelado por el cliente" },
];

const kanbanColumns = [
  { id: "pendiente", titulo: "Pendientes", bgColor: "bg-orange-50", borderColor: "border-orange-200", textColor: "text-orange-700", icon: Clock },
  { id: "procesando", titulo: "Procesando", bgColor: "bg-blue-50", borderColor: "border-blue-200", textColor: "text-blue-700", icon: Package },
  { id: "enviado", titulo: "Enviados", bgColor: "bg-purple-50", borderColor: "border-purple-200", textColor: "text-purple-700", icon: Truck },
  { id: "entregado", titulo: "Entregados", bgColor: "bg-green-50", borderColor: "border-green-200", textColor: "text-green-700", icon: CheckCircle },
  { id: "cancelado", titulo: "Cancelados", bgColor: "bg-red-50", borderColor: "border-red-200", textColor: "text-red-700", icon: XCircle },
];

const fechaOptions = [
  { value: "all", label: "Todas las fechas" },
  { value: "today", label: "Hoy" },
  { value: "week", label: "Esta semana" },
  { value: "month", label: "Este mes" },
];

export default function OrdersAdminPage() {
  const { isStoreAdmin, loading, permissions } = usePermissions();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [fechaFiltro, setFechaFiltro] = useState("all");

  useEffect(() => {
    if (!loading && permissions && !isStoreAdmin()) {
      router.push("/");
    }
  }, [loading, permissions, isStoreAdmin, router]);

  const pedidosFiltrados = pedidosMockup.filter((pedido) =>
    pedido.numeroOrden.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pedidosPorEstado = kanbanColumns.reduce((acc, col) => {
    acc[col.id] = pedidosFiltrados.filter((p) => p.estado === col.id);
    return acc;
  }, {} as Record<string, Order[]>);

  const totalPedidos = pedidosMockup.length;
  const pedidosPendientes = pedidosMockup.filter((p) => p.estado === "pendiente").length;
  const ventasHoy = pedidosMockup.filter((p) => p.estado !== "cancelado").reduce((acc, p) => acc + p.total, 0);
  const ticketPromedio = ventasHoy / pedidosMockup.filter((p) => p.estado !== "cancelado").length;

  const formatPrice = (price: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const getTimeAgo = (dateString: string) => {
    const diffHours = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays > 0) return `Hace ${diffDays}d`;
    if (diffHours > 0) return `Hace ${diffHours}h`;
    return "Ahora";
  };

  if (loading) return <AdminLayout currentPage="orders"><div className="p-6"><LoadingState message="Verificando permisos..." /></div></AdminLayout>;

  if (!isStoreAdmin()) {
    return (
      <AdminLayout currentPage="orders">
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
            <Button onClick={() => router.push("/")}>Volver al Inicio</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="orders">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h1>
            <p className="text-gray-600">Administra y da seguimiento a los pedidos</p>
          </div>
          <Button variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={() => setViewMode(viewMode === "kanban" ? "list" : "kanban")} className="mt-4 sm:mt-0">
            {viewMode === "kanban" ? "Vista Lista" : "Vista Kanban"}
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Pedidos" value={totalPedidos} icon={<ShoppingBag className="w-6 h-6" />} variant="primary" />
          <StatCard title="Pendientes" value={pedidosPendientes} icon={<AlertCircle className="w-6 h-6" />} variant="warning" />
          <StatCard title="Ventas Hoy" value={formatPrice(ventasHoy)} icon={<DollarSign className="w-6 h-6" />} variant="success" trend={{ value: 12, isPositive: true }} />
          <StatCard title="Ticket Promedio" value={formatPrice(ticketPromedio)} icon={<TrendingUp className="w-6 h-6" />} variant="purple" />
        </div>

        {/* Filtros */}
        <Card padding="sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchInput placeholder="Buscar por orden, cliente o email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-400 w-5 h-5" />
              <Select options={fechaOptions} value={fechaFiltro} onChange={(e) => setFechaFiltro(e.target.value)} />
            </div>
          </div>
        </Card>

        {/* Vista Kanban */}
        {viewMode === "kanban" && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {kanbanColumns.map((column) => {
              const Icon = column.icon;
              const pedidosColumna = pedidosPorEstado[column.id] || [];
              return (
                <div key={column.id} className={`flex-shrink-0 w-80 ${column.bgColor} rounded-xl border ${column.borderColor}`}>
                  <div className="p-4 border-b border-gray-200/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${column.textColor}`} />
                        <h3 className={`font-semibold ${column.textColor}`}>{column.titulo}</h3>
                      </div>
                      <Badge variant="secondary">{pedidosColumna.length}</Badge>
                    </div>
                  </div>
                  <div className="p-3 space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                    {pedidosColumna.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Sin pedidos</p>
                      </div>
                    ) : (
                      pedidosColumna.map((pedido) => (
                        <div key={pedido.id} onClick={() => setSelectedOrder(pedido)} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{pedido.numeroOrden}</p>
                              <p className="text-xs text-gray-500">{getTimeAgo(pedido.fechaCreacion)}</p>
                            </div>
                            <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded"><MoreHorizontal className="w-4 h-4 text-gray-400" /></button>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar name={pedido.cliente.nombre} size="sm" variant="blue" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{pedido.cliente.nombre}</p>
                              <p className="text-xs text-gray-500 truncate">{pedido.cliente.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            {pedido.items.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-sm">{item.imagen}</div>
                            ))}
                            {pedido.items.length > 3 && <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">+{pedido.items.length - 3}</div>}
                            <span className="text-xs text-gray-500 ml-2">{pedido.items.reduce((acc, item) => acc + item.cantidad, 0)} items</span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="text-sm font-bold text-gray-900">{formatPrice(pedido.total)}</span>
                            <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium" onClick={(e) => { e.stopPropagation(); setSelectedOrder(pedido); }}>
                              <Eye className="w-3.5 h-3.5" />Ver
                            </button>
                          </div>
                          {pedido.tracking && <div className="mt-3 flex items-center gap-2 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded"><Truck className="w-3.5 h-3.5" />{pedido.tracking}</div>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Vista Lista */}
        {viewMode === "list" && (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Pedido</TableHeaderCell>
                <TableHeaderCell>Cliente</TableHeaderCell>
                <TableHeaderCell>Items</TableHeaderCell>
                <TableHeaderCell>Total</TableHeaderCell>
                <TableHeaderCell>Estado</TableHeaderCell>
                <TableHeaderCell>Fecha</TableHeaderCell>
                <TableHeaderCell align="right">Acciones</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidosFiltrados.map((pedido) => {
                const estadoConfig = kanbanColumns.find((c) => c.id === pedido.estado);
                return (
                  <TableRow key={pedido.id} onClick={() => setSelectedOrder(pedido)} isClickable>
                    <TableCell>
                      <p className="font-semibold text-gray-900">{pedido.numeroOrden}</p>
                      <p className="text-xs text-gray-500">{pedido.metodoPago}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900">{pedido.cliente.nombre}</p>
                      <p className="text-xs text-gray-500">{pedido.cliente.email}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {pedido.items.slice(0, 2).map((item, idx) => <span key={idx} className="text-lg">{item.imagen}</span>)}
                        {pedido.items.length > 2 && <span className="text-xs text-gray-500">+{pedido.items.length - 2}</span>}
                      </div>
                    </TableCell>
                    <TableCell><p className="font-semibold text-gray-900">{formatPrice(pedido.total)}</p></TableCell>
                    <TableCell><Badge variant={estadoConfig?.id === "pendiente" ? "warning" : estadoConfig?.id === "procesando" ? "primary" : estadoConfig?.id === "enviado" ? "purple" : estadoConfig?.id === "entregado" ? "success" : "danger"}>{estadoConfig?.titulo}</Badge></TableCell>
                    <TableCell className="text-gray-700">{formatDate(pedido.fechaCreacion)}</TableCell>
                    <TableCell align="right"><button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Ver detalle</button></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <OrderDetailModal order={selectedOrder} isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} />
    </AdminLayout>
  );
}
