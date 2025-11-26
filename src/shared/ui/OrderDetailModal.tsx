"use client";

import { useState } from "react";
import {
  X,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  FileText,
  Copy,
  ExternalLink,
  ChevronRight,
  Printer,
  MessageSquare,
  AlertCircle,
  Check,
} from "lucide-react";

interface OrderItem {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
  imagen: string;
  variante?: string;
}

interface Order {
  id: string;
  numeroOrden: string;
  cliente: {
    nombre: string;
    email: string;
    telefono: string;
    avatar?: string;
  };
  items: OrderItem[];
  subtotal: number;
  envio: number;
  total: number;
  estado: "pendiente" | "procesando" | "enviado" | "entregado" | "cancelado";
  metodoPago: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  direccionEnvio: {
    calle: string;
    ciudad: string;
    departamento: string;
    codigoPostal: string;
    pais: string;
  };
  notas?: string;
  tracking?: string;
}

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, newStatus: Order["estado"]) => void;
}

const estadosConfig = {
  pendiente: {
    label: "Pendiente",
    color: "orange",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
    icon: Clock,
  },
  procesando: {
    label: "Procesando",
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    icon: Package,
  },
  enviado: {
    label: "Enviado",
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    icon: Truck,
  },
  entregado: {
    label: "Entregado",
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    icon: CheckCircle,
  },
  cancelado: {
    label: "Cancelado",
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    icon: XCircle,
  },
};

const flujoEstados: Order["estado"][] = ["pendiente", "procesando", "enviado", "entregado"];

export default function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
}: OrderDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"detalle" | "timeline" | "notas">("detalle");
  const [newNote, setNewNote] = useState("");
  const [copied, setCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !order) return null;

  const estadoActual = estadosConfig[order.estado];
  const EstadoIcon = estadoActual.icon;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.numeroOrden);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateStatus = async (newStatus: Order["estado"]) => {
    setIsUpdating(true);
    // Simular actualización
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (onUpdateStatus) {
      onUpdateStatus(order.id, newStatus);
    }
    setIsUpdating(false);
  };

  const getNextStatus = (): Order["estado"] | null => {
    const currentIndex = flujoEstados.indexOf(order.estado);
    if (currentIndex === -1 || currentIndex === flujoEstados.length - 1) return null;
    return flujoEstados[currentIndex + 1];
  };

  const nextStatus = getNextStatus();

  // Timeline mockup
  const timeline = [
    {
      estado: "pendiente",
      fecha: order.fechaCreacion,
      descripcion: "Pedido recibido",
      completado: true,
    },
    {
      estado: "procesando",
      fecha: order.estado !== "pendiente" ? order.fechaActualizacion : null,
      descripcion: "Preparando pedido",
      completado: ["procesando", "enviado", "entregado"].includes(order.estado),
    },
    {
      estado: "enviado",
      fecha: ["enviado", "entregado"].includes(order.estado) ? order.fechaActualizacion : null,
      descripcion: order.tracking ? `Enviado - ${order.tracking}` : "En camino",
      completado: ["enviado", "entregado"].includes(order.estado),
    },
    {
      estado: "entregado",
      fecha: order.estado === "entregado" ? order.fechaActualizacion : null,
      descripcion: "Entregado al cliente",
      completado: order.estado === "entregado",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-10">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-gray-900">{order.numeroOrden}</h2>
                <button
                  onClick={handleCopyOrderNumber}
                  className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copiar número de orden"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${estadoActual.bgColor} ${estadoActual.textColor}`}
                >
                  <EstadoIcon className="w-4 h-4" />
                  {estadoActual.label}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Creado el {formatDate(order.fechaCreacion)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-6 bg-white">
            {[
              { id: "detalle", label: "Detalle del Pedido", icon: FileText },
              { id: "timeline", label: "Timeline", icon: Clock },
              { id: "notas", label: "Notas", icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
            {/* Tab: Detalle */}
            {activeTab === "detalle" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna principal */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Productos */}
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-gray-400" />
                      Productos ({order.items.length})
                    </h3>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-100"
                        >
                          <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                            {item.imagen}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.nombre}</p>
                            {item.variante && (
                              <p className="text-sm text-gray-500">{item.variante}</p>
                            )}
                            <p className="text-sm text-gray-400">Cantidad: {item.cantidad}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatPrice(item.precio * item.cantidad)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatPrice(item.precio)} c/u
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Resumen de precios */}
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Envío</span>
                        <span className="text-gray-900">
                          {order.envio === 0 ? "Gratis" : formatPrice(order.envio)}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                        <span className="text-gray-900">Total</span>
                        <span className="text-blue-600">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dirección de envío */}
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      Dirección de Envío
                    </h3>
                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                      <p className="font-medium text-gray-900">{order.cliente.nombre}</p>
                      <p className="text-gray-600 mt-1">{order.direccionEnvio.calle}</p>
                      <p className="text-gray-600">
                        {order.direccionEnvio.ciudad}, {order.direccionEnvio.departamento}
                      </p>
                      <p className="text-gray-600">
                        {order.direccionEnvio.codigoPostal} - {order.direccionEnvio.pais}
                      </p>
                      
                      {order.tracking && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-purple-600">
                              <Truck className="w-4 h-4" />
                              <span className="text-sm font-medium">Número de guía:</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="text-sm bg-purple-50 px-2 py-1 rounded">
                                {order.tracking}
                              </code>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <ExternalLink className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Columna lateral */}
                <div className="space-y-6">
                  {/* Info del cliente */}
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Cliente</h3>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {order.cliente.nombre
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.cliente.nombre}</p>
                        <p className="text-sm text-gray-500">Cliente frecuente</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <a
                        href={`mailto:${order.cliente.email}`}
                        className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Mail className="w-4 h-4 text-gray-400" />
                        {order.cliente.email}
                      </a>
                      <a
                        href={`tel:${order.cliente.telefono}`}
                        className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Phone className="w-4 h-4 text-gray-400" />
                        {order.cliente.telefono}
                      </a>
                    </div>
                  </div>

                  {/* Método de pago */}
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Pago</h3>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-gray-200">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.metodoPago}</p>
                        <p className="text-sm text-green-600">Pago confirmado</p>
                      </div>
                    </div>
                  </div>

                  {/* Fechas */}
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Fechas</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Creado</p>
                          <p className="text-sm text-gray-900">
                            {formatShortDate(order.fechaCreacion)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Última actualización</p>
                          <p className="text-sm text-gray-900">
                            {formatShortDate(order.fechaActualizacion)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Timeline */}
            {activeTab === "timeline" && (
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  {/* Línea vertical */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

                  {/* Items del timeline */}
                  <div className="space-y-8">
                    {timeline.map((item, index) => {
                      const config = estadosConfig[item.estado as keyof typeof estadosConfig];
                      const Icon = config.icon;
                      return (
                        <div key={index} className="relative flex gap-4">
                          {/* Icono */}
                          <div
                            className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                              item.completado
                                ? config.bgColor
                                : "bg-gray-100"
                            }`}
                          >
                            <Icon
                              className={`w-5 h-5 ${
                                item.completado ? config.textColor : "text-gray-400"
                              }`}
                            />
                          </div>

                          {/* Contenido */}
                          <div className="flex-1 pt-2">
                            <div className="flex items-center justify-between">
                              <h4
                                className={`font-medium ${
                                  item.completado ? "text-gray-900" : "text-gray-400"
                                }`}
                              >
                                {config.label}
                              </h4>
                              {item.fecha && (
                                <span className="text-sm text-gray-500">
                                  {formatShortDate(item.fecha)}
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-sm mt-1 ${
                                item.completado ? "text-gray-600" : "text-gray-400"
                              }`}
                            >
                              {item.descripcion}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {/* Estado cancelado si aplica */}
                    {order.estado === "cancelado" && (
                      <div className="relative flex gap-4">
                        <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center bg-red-100">
                          <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1 pt-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-red-600">Cancelado</h4>
                            <span className="text-sm text-gray-500">
                              {formatShortDate(order.fechaActualizacion)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {order.notas || "Pedido cancelado"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Notas */}
            {activeTab === "notas" && (
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Nota del cliente */}
                {order.notas && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-1">
                          Nota del cliente
                        </h4>
                        <p className="text-yellow-700">{order.notas}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Agregar nota interna */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Agregar nota interna</h3>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Escribe una nota sobre este pedido..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Guardar Nota
                  </button>
                </div>

                {/* Historial de notas (mockup) */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Historial de notas</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">Admin</span>
                        <span className="text-xs text-gray-500">Hace 2 horas</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Cliente contactado para confirmar dirección de envío.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer con acciones */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">
                <Printer className="w-4 h-4" />
                Imprimir
              </button>
            </div>

            <div className="flex items-center gap-3">
              {order.estado === "cancelado" ? (
                <span className="text-sm text-gray-500">Este pedido fue cancelado</span>
              ) : order.estado === "entregado" ? (
                <span className="text-sm text-green-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Pedido completado
                </span>
              ) : (
                <>
                  {order.estado !== "pendiente" && (
                    <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      Cancelar Pedido
                    </button>
                  )}
                  {nextStatus && (
                    <button
                      onClick={() => handleUpdateStatus(nextStatus)}
                      disabled={isUpdating}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Actualizando...
                        </>
                      ) : (
                        <>
                          Marcar como {estadosConfig[nextStatus].label}
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
