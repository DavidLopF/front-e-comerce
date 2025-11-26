"use client";

import { usePermissions } from "@/shared/hooks/usePermissions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLayout from "@/shared/ui/AdminLayout";
import { Button, Card, CardHeader, LoadingState } from "@/shared/components";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Line,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Eye,
  MousePointer,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
  LucideIcon,
} from "lucide-react";

// ============ DATOS MOCKUP - ANALÍTICAS ============

// Ventas por día (últimos 30 días)
const ventasDiarias = [
  { fecha: "1 Nov", ventas: 1250000, pedidos: 18 },
  { fecha: "2 Nov", ventas: 980000, pedidos: 14 },
  { fecha: "3 Nov", ventas: 1450000, pedidos: 21 },
  { fecha: "4 Nov", ventas: 1120000, pedidos: 16 },
  { fecha: "5 Nov", ventas: 1680000, pedidos: 24 },
  { fecha: "6 Nov", ventas: 1320000, pedidos: 19 },
  { fecha: "7 Nov", ventas: 890000, pedidos: 13 },
  { fecha: "8 Nov", ventas: 1560000, pedidos: 22 },
  { fecha: "9 Nov", ventas: 1780000, pedidos: 26 },
  { fecha: "10 Nov", ventas: 1450000, pedidos: 21 },
  { fecha: "11 Nov", ventas: 2100000, pedidos: 30 },
  { fecha: "12 Nov", ventas: 1890000, pedidos: 27 },
  { fecha: "13 Nov", ventas: 1650000, pedidos: 24 },
  { fecha: "14 Nov", ventas: 1420000, pedidos: 20 },
  { fecha: "15 Nov", ventas: 1980000, pedidos: 28 },
  { fecha: "16 Nov", ventas: 2250000, pedidos: 32 },
  { fecha: "17 Nov", ventas: 1870000, pedidos: 27 },
  { fecha: "18 Nov", ventas: 1540000, pedidos: 22 },
  { fecha: "19 Nov", ventas: 2100000, pedidos: 30 },
  { fecha: "20 Nov", ventas: 2450000, pedidos: 35 },
  { fecha: "21 Nov", ventas: 1980000, pedidos: 28 },
  { fecha: "22 Nov", ventas: 2680000, pedidos: 38 },
  { fecha: "23 Nov", ventas: 3100000, pedidos: 44 },
  { fecha: "24 Nov", ventas: 2890000, pedidos: 41 },
  { fecha: "25 Nov", ventas: 3250000, pedidos: 46 },
  { fecha: "26 Nov", ventas: 2150000, pedidos: 31 },
];

// Ventas por hora del día
const ventasPorHora = [
  { hora: "00:00", ventas: 120000 },
  { hora: "02:00", ventas: 80000 },
  { hora: "04:00", ventas: 45000 },
  { hora: "06:00", ventas: 95000 },
  { hora: "08:00", ventas: 280000 },
  { hora: "10:00", ventas: 520000 },
  { hora: "12:00", ventas: 680000 },
  { hora: "14:00", ventas: 590000 },
  { hora: "16:00", ventas: 720000 },
  { hora: "18:00", ventas: 890000 },
  { hora: "20:00", ventas: 950000 },
  { hora: "22:00", ventas: 450000 },
];

// Productos más vendidos
const productosTopVentas = [
  { nombre: "Camiseta Premium Negra", ventas: 156, ingresos: 12480000, crecimiento: 23 },
  { nombre: "Zapatillas Running Pro", ventas: 89, ingresos: 17800000, crecimiento: 15 },
  { nombre: "Mochila Urban Style", ventas: 78, ingresos: 7020000, crecimiento: 8 },
  { nombre: "Reloj Smart Watch X", ventas: 65, ingresos: 19500000, crecimiento: -5 },
  { nombre: "Auriculares Bluetooth", ventas: 54, ingresos: 4320000, crecimiento: 32 },
];

// Categorías
const ventasPorCategoria = [
  { categoria: "Ropa", ventas: 45, monto: 18500000, color: "#3b82f6" },
  { categoria: "Calzado", ventas: 25, monto: 12800000, color: "#10b981" },
  { categoria: "Accesorios", ventas: 18, monto: 8200000, color: "#f59e0b" },
  { categoria: "Electrónica", ventas: 12, monto: 15600000, color: "#8b5cf6" },
];

// Métodos de pago
const metodosPago = [
  { metodo: "Tarjeta Crédito", porcentaje: 45, monto: 24750000, color: "#3b82f6" },
  { metodo: "PSE", porcentaje: 30, monto: 16500000, color: "#10b981" },
  { metodo: "Efectivo", porcentaje: 15, monto: 8250000, color: "#f59e0b" },
  { metodo: "MercadoPago", porcentaje: 10, monto: 5500000, color: "#8b5cf6" },
];

// Dispositivos
const traficoDispositivos = [
  { dispositivo: "Mobile", porcentaje: 58, sesiones: 12540, color: "#3b82f6", icon: Smartphone },
  { dispositivo: "Desktop", porcentaje: 35, sesiones: 7560, color: "#10b981", icon: Monitor },
  { dispositivo: "Tablet", porcentaje: 7, sesiones: 1512, color: "#f59e0b", icon: Tablet },
];

// Ciudades
const ventasPorCiudad = [
  { ciudad: "Bogotá", ventas: 42, monto: 23100000 },
  { ciudad: "Medellín", ventas: 28, monto: 15400000 },
  { ciudad: "Cali", ventas: 15, monto: 8250000 },
  { ciudad: "Barranquilla", ventas: 8, monto: 4400000 },
  { ciudad: "Cartagena", ventas: 7, monto: 3850000 },
];

// Métricas de conversión
const embudoConversion = [
  { etapa: "Visitantes", valor: 21612, porcentaje: 100 },
  { etapa: "Vieron Producto", valor: 8645, porcentaje: 40 },
  { etapa: "Agregaron al Carrito", valor: 2161, porcentaje: 10 },
  { etapa: "Iniciaron Checkout", valor: 864, porcentaje: 4 },
  { etapa: "Completaron Compra", valor: 432, porcentaje: 2 },
];

// Comparación mensual
const comparacionMensual = [
  { mes: "Jul", actual: 28500000, anterior: 24000000 },
  { mes: "Ago", actual: 32000000, anterior: 28500000 },
  { mes: "Sep", actual: 35500000, anterior: 32000000 },
  { mes: "Oct", actual: 41000000, anterior: 35500000 },
  { mes: "Nov", actual: 55000000, anterior: 41000000 },
];

// ============ COMPONENTES INTERNOS ============

interface KpiCardProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  title: string;
  value: string;
  trend: number;
  subtitle: string;
}

function KpiCard({ icon: Icon, iconBgColor, iconColor, title, value, trend, subtitle }: KpiCardProps) {
  const isPositive = trend >= 0;
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${iconBgColor}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
            {isPositive ? '+' : ''}{trend}%
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
      </div>
    </Card>
  );
}

interface ProgressBarProps {
  label: string;
  value: number;
  maxValue?: number;
  percentage?: number;
  color?: string;
  subLabel?: string;
}

function ProgressBar({ label, value, maxValue = 100, percentage, color = "#3b82f6", subLabel }: ProgressBarProps) {
  const percent = percentage ?? (value / maxValue) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">{value.toLocaleString()}</span>
          {percentage !== undefined && (
            <span className="text-xs text-gray-500">({percentage}%)</span>
          )}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${percent}%`, backgroundColor: color }}
        ></div>
      </div>
      {subLabel && <p className="text-xs text-gray-500 mt-1">{subLabel}</p>}
    </div>
  );
}

interface RankedListItemProps {
  rank: number;
  title: string;
  subtitle?: string;
  value: string;
  subValue?: string;
  trend?: number;
}

function RankedListItem({ rank, title, subtitle, value, subValue, trend }: RankedListItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
          {rank}
        </span>
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900">{value}</p>
        {trend !== undefined && (
          <p className={`text-xs flex items-center justify-end ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {Math.abs(trend)}%
          </p>
        )}
        {subValue && !trend && <p className="text-xs text-gray-500">{subValue}</p>}
      </div>
    </div>
  );
}

// ============ PÁGINA PRINCIPAL ============

export default function AnalyticsAdminPage() {
  const { isStoreAdmin, loading, permissions } = usePermissions();
  const router = useRouter();
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && permissions && !isStoreAdmin()) {
      router.push("/");
    }
  }, [loading, permissions, isStoreAdmin, router]);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatFullPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  // KPIs calculados
  const totalVentas = ventasDiarias.reduce((acc, d) => acc + d.ventas, 0);
  const totalPedidos = ventasDiarias.reduce((acc, d) => acc + d.pedidos, 0);
  const ticketPromedio = totalVentas / totalPedidos;
  const tasaConversion = 2;

  if (loading) {
    return <LoadingState message="Verificando permisos..." />;
  }

  if (!isStoreAdmin()) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta página</p>
          <Button onClick={() => router.push("/")}>Volver al Inicio</Button>
        </div>
      </div>
    );
  }

  const periodos = [
    { id: "7d", label: "7 días" },
    { id: "30d", label: "30 días" },
    { id: "90d", label: "90 días" },
  ];

  return (
    <AdminLayout currentPage="analytics">
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analíticas</h1>
            <p className="text-gray-600">Métricas y rendimiento de tu tienda</p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            {/* Selector de período */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
              {periodos.map((periodo) => (
                <button
                  key={periodo.id}
                  onClick={() => setPeriodoSeleccionado(periodo.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    periodoSeleccionado === periodo.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {periodo.label}
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button leftIcon={<Download className="w-4 h-4" />}>Exportar</Button>
          </div>
        </div>

        {/* KPIs Principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard
            icon={DollarSign}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            title="Ventas Totales"
            value={formatPrice(totalVentas)}
            trend={34.2}
            subtitle="vs período anterior"
          />
          <KpiCard
            icon={ShoppingCart}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
            title="Total Pedidos"
            value={totalPedidos.toString()}
            trend={28.5}
            subtitle="vs período anterior"
          />
          <KpiCard
            icon={Target}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
            title="Ticket Promedio"
            value={formatFullPrice(ticketPromedio)}
            trend={4.3}
            subtitle="Por pedido"
          />
          <KpiCard
            icon={MousePointer}
            iconBgColor="bg-orange-100"
            iconColor="text-orange-600"
            title="Tasa de Conversión"
            value={`${tasaConversion}%`}
            trend={-0.3}
            subtitle="Visitantes a compradores"
          />
        </div>

        {/* Gráfica Principal de Ventas */}
        <Card className="mb-8">
          <CardHeader
            title="Evolución de Ventas"
            subtitle="Ingresos y pedidos diarios"
            action={
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600">Ventas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Pedidos</span>
                </div>
              </div>
            }
          />
          <div className="p-6 pt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ventasDiarias}>
                  <defs>
                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="fecha" stroke="#888" fontSize={12} />
                  <YAxis
                    yAxisId="left"
                    stroke="#3b82f6"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === "ventas" ? formatFullPrice(value) : value,
                      name === "ventas" ? "Ventas" : "Pedidos",
                    ]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="ventas"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVentas)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="pedidos"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Segunda fila: Categorías + Productos Top */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ventas por Categoría */}
          <Card>
            <CardHeader title="Ventas por Categoría" subtitle="Distribución de ingresos" icon={<PieChartIcon className="w-5 h-5" />} />
            <div className="p-6 pt-0">
              <div className="flex items-center gap-8">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ventasPorCategoria}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="ventas"
                      >
                        {ventasPorCategoria.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value}%`, "Porcentaje"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-4">
                  {ventasPorCategoria.map((cat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        <span className="text-sm text-gray-700">{cat.categoria}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{cat.ventas}%</p>
                        <p className="text-xs text-gray-500">{formatPrice(cat.monto)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Productos Top */}
          <Card>
            <CardHeader title="Productos Más Vendidos" subtitle="Top 5 del período" icon={<Package className="w-5 h-5" />} />
            <div className="p-6 pt-0 space-y-4">
              {productosTopVentas.map((producto, index) => (
                <RankedListItem
                  key={index}
                  rank={index + 1}
                  title={producto.nombre}
                  subtitle={`${producto.ventas} unidades`}
                  value={formatPrice(producto.ingresos)}
                  trend={producto.crecimiento}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Tercera fila: Embudo + Comparación */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Embudo de Conversión */}
          <Card>
            <CardHeader title="Embudo de Conversión" subtitle="Del visitante a la compra" icon={<Activity className="w-5 h-5" />} />
            <div className="p-6 pt-0 space-y-4">
              {embudoConversion.map((etapa, index) => (
                <ProgressBar
                  key={index}
                  label={etapa.etapa}
                  value={etapa.valor}
                  percentage={etapa.porcentaje}
                  color="#3b82f6"
                />
              ))}
            </div>
          </Card>

          {/* Comparación Mensual */}
          <Card>
            <CardHeader title="Comparación Mensual" subtitle="Año actual vs anterior" icon={<BarChart3 className="w-5 h-5" />} />
            <div className="p-6 pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparacionMensual}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="mes" stroke="#888" fontSize={12} />
                    <YAxis
                      stroke="#888"
                      fontSize={12}
                      tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatFullPrice(value), ""]}
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                    />
                    <Legend />
                    <Bar dataKey="anterior" name="Año Anterior" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" name="Año Actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        {/* Cuarta fila: Tráfico + Ciudades + Métodos de Pago */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Tráfico por Dispositivo */}
          <Card>
            <CardHeader title="Dispositivos" icon={<Eye className="w-5 h-5" />} />
            <div className="p-6 pt-0 space-y-4">
              {traficoDispositivos.map((device, index) => {
                const Icon = device.icon;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${device.color}20` }}>
                      <Icon className="w-5 h-5" style={{ color: device.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{device.dispositivo}</span>
                        <span className="text-sm font-semibold text-gray-900">{device.porcentaje}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${device.porcentaje}%`, backgroundColor: device.color }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{device.sesiones.toLocaleString()} sesiones</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Ventas por Ciudad */}
          <Card>
            <CardHeader title="Top Ciudades" icon={<MapPin className="w-5 h-5" />} />
            <div className="p-6 pt-0 space-y-4">
              {ventasPorCiudad.map((ciudad, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700">{ciudad.ciudad}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{ciudad.ventas}%</p>
                    <p className="text-xs text-gray-500">{formatPrice(ciudad.monto)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Métodos de Pago */}
          <Card>
            <CardHeader title="Métodos de Pago" icon={<DollarSign className="w-5 h-5" />} />
            <div className="p-6 pt-0 space-y-4">
              {metodosPago.map((metodo, index) => (
                <ProgressBar
                  key={index}
                  label={metodo.metodo}
                  value={metodo.porcentaje}
                  maxValue={100}
                  color={metodo.color}
                  subLabel={formatPrice(metodo.monto)}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Quinta fila: Horas pico */}
        <Card>
          <CardHeader title="Ventas por Hora del Día" subtitle="Identifica las horas pico de tu tienda" icon={<Clock className="w-5 h-5" />} />
          <div className="p-6 pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ventasPorHora}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hora" stroke="#888" fontSize={12} />
                  <YAxis
                    stroke="#888"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatFullPrice(value), "Ventas"]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                  />
                  <Bar dataKey="ventas" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {ventasPorHora.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.ventas > 700000 ? "#3b82f6" : "#93c5fd"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-gray-600">Hora pico (&gt;$700k)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-300"></div>
                <span className="text-gray-600">Hora normal</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
