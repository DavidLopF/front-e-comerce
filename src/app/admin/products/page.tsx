"use client";

import { usePermissions } from "@/shared/hooks/usePermissions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLayout from "@/shared/ui/AdminLayout";
import CreateProductModal from "@/shared/ui/CreateProductModal";
import {
  Button,
  Card,
  CardHeader,
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
  Pagination,
  LoadingState,
} from "@/shared/components";
import {
  Package,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  AlertTriangle,
  TrendingUp,
  Archive,
  Tag,
  ImageIcon,
} from "lucide-react";

// ============ TIPOS E INTERFACES ============

interface Producto {
  id: string;
  nombre: string;
  sku: string;
  categoria: string;
  precio: number;
  precioOferta?: number;
  stock: number;
  estado: "activo" | "inactivo" | "agotado";
  imagen: string;
  ventas: number;
  fechaCreacion: string;
}

// ============ DATOS MOCKUP ============

const productosMockup: Producto[] = [
  { id: "1", nombre: "Camiseta Premium Negra", sku: "CAM-001", categoria: "Ropa", precio: 89900, precioOferta: 79900, stock: 45, estado: "activo", imagen: "👕", ventas: 156, fechaCreacion: "2024-08-15" },
  { id: "2", nombre: "Zapatillas Running Pro", sku: "ZAP-002", categoria: "Calzado", precio: 259900, stock: 12, estado: "activo", imagen: "👟", ventas: 89, fechaCreacion: "2024-07-20" },
  { id: "3", nombre: "Mochila Urban Style", sku: "MOC-003", categoria: "Accesorios", precio: 129900, precioOferta: 99900, stock: 34, estado: "activo", imagen: "🎒", ventas: 78, fechaCreacion: "2024-09-01" },
  { id: "4", nombre: "Reloj Smart Watch X", sku: "REL-004", categoria: "Electrónica", precio: 450000, stock: 8, estado: "activo", imagen: "⌚", ventas: 65, fechaCreacion: "2024-06-10" },
  { id: "5", nombre: "Auriculares Bluetooth Pro", sku: "AUR-005", categoria: "Electrónica", precio: 189900, stock: 67, estado: "activo", imagen: "🎧", ventas: 54, fechaCreacion: "2024-10-05" },
  { id: "6", nombre: "Chaqueta Impermeable", sku: "CHA-006", categoria: "Ropa", precio: 289900, stock: 5, estado: "activo", imagen: "🧥", ventas: 32, fechaCreacion: "2024-05-18" },
  { id: "7", nombre: "Gafas de Sol Premium", sku: "GAF-007", categoria: "Accesorios", precio: 159900, stock: 0, estado: "agotado", imagen: "🕶️", ventas: 45, fechaCreacion: "2024-04-22" },
  { id: "8", nombre: "Pantalón Jogger Classic", sku: "PAN-008", categoria: "Ropa", precio: 119900, stock: 28, estado: "activo", imagen: "👖", ventas: 67, fechaCreacion: "2024-08-30" },
  { id: "9", nombre: "Billetera Cuero Premium", sku: "BIL-009", categoria: "Accesorios", precio: 89900, stock: 0, estado: "inactivo", imagen: "👛", ventas: 23, fechaCreacion: "2024-03-15" },
  { id: "10", nombre: "Gorra Snapback Urban", sku: "GOR-010", categoria: "Accesorios", precio: 49900, precioOferta: 39900, stock: 89, estado: "activo", imagen: "🧢", ventas: 112, fechaCreacion: "2024-09-20" },
];

const categoriaOptions = [
  { value: "Todas", label: "Todas las categorías" },
  { value: "Ropa", label: "Ropa" },
  { value: "Calzado", label: "Calzado" },
  { value: "Accesorios", label: "Accesorios" },
  { value: "Electrónica", label: "Electrónica" },
];

const estadoOptions = [
  { value: "todos", label: "Todos los estados" },
  { value: "activo", label: "Activos" },
  { value: "inactivo", label: "Inactivos" },
  { value: "agotado", label: "Agotados" },
];

const estadoConfig = {
  activo: { label: "Activo", variant: "success" as const },
  inactivo: { label: "Inactivo", variant: "secondary" as const },
  agotado: { label: "Agotado", variant: "danger" as const },
};

export default function ProductsAdminPage() {
  const { isStoreAdmin, loading, permissions } = usePermissions();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!loading && permissions && !isStoreAdmin()) {
      router.push("/");
    }
  }, [loading, permissions, isStoreAdmin, router]);

  // Filtrar productos
  const productosFiltrados = productosMockup.filter((producto) => {
    const matchSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       producto.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaFiltro === "Todas" || producto.categoria === categoriaFiltro;
    const matchEstado = estadoFiltro === "todos" || producto.estado === estadoFiltro;
    return matchSearch && matchCategoria && matchEstado;
  });

  // Estadísticas
  const totalProductos = productosMockup.length;
  const productosActivos = productosMockup.filter(p => p.estado === "activo").length;
  const productosAgotados = productosMockup.filter(p => p.stock === 0).length;
  const productosBajoStock = productosMockup.filter(p => p.stock > 0 && p.stock < 15).length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price);
  };

  if (loading) {
    return (
      <AdminLayout currentPage="products">
        <div className="p-6">
          <LoadingState message="Verificando permisos..." />
        </div>
      </AdminLayout>
    );
  }

  if (!isStoreAdmin()) {
    return (
      <AdminLayout currentPage="products">
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
            <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta página</p>
            <Button onClick={() => router.push("/")}>Volver al Inicio</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="products">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
            <p className="text-gray-600">Administra el catálogo de tu tienda</p>
          </div>
          <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => setShowCreateModal(true)} className="mt-4 sm:mt-0">
            Nuevo Producto
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Productos" value={totalProductos} icon={<Package className="w-6 h-6" />} variant="primary" />
          <StatCard title="Productos Activos" value={productosActivos} icon={<TrendingUp className="w-6 h-6" />} variant="success" trend={{ value: ((productosActivos/totalProductos)*100), isPositive: true }} />
          <StatCard title="Stock Bajo" value={productosBajoStock} icon={<AlertTriangle className="w-6 h-6" />} variant="warning" />
          <StatCard title="Agotados" value={productosAgotados} icon={<Archive className="w-6 h-6" />} variant="danger" />
        </div>

        {/* Filtros */}
        <Card padding="sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchInput placeholder="Buscar por nombre o SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Tag className="text-gray-400 w-5 h-5" />
              <Select options={categoriaOptions} value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)} />
            </div>
            <Select options={estadoOptions} value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} />
          </div>
        </Card>

        {/* Tabla */}
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell><div className="flex items-center gap-2 cursor-pointer hover:text-gray-700">Producto <ArrowUpDown className="w-4 h-4" /></div></TableHeaderCell>
              <TableHeaderCell>SKU</TableHeaderCell>
              <TableHeaderCell>Categoría</TableHeaderCell>
              <TableHeaderCell><div className="flex items-center gap-2 cursor-pointer hover:text-gray-700">Precio <ArrowUpDown className="w-4 h-4" /></div></TableHeaderCell>
              <TableHeaderCell><div className="flex items-center gap-2 cursor-pointer hover:text-gray-700">Stock <ArrowUpDown className="w-4 h-4" /></div></TableHeaderCell>
              <TableHeaderCell>Estado</TableHeaderCell>
              <TableHeaderCell>Ventas</TableHeaderCell>
              <TableHeaderCell align="right">Acciones</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productosFiltrados.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">{producto.imagen}</div>
                    <div>
                      <p className="font-medium text-gray-900">{producto.nombre}</p>
                      <p className="text-xs text-gray-500">{new Date(producto.fechaCreacion).toLocaleDateString("es-CO")}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{producto.sku}</span></TableCell>
                <TableCell className="text-gray-700">{producto.categoria}</TableCell>
                <TableCell>
                  {producto.precioOferta ? (
                    <div>
                      <p className="font-semibold text-green-600">{formatPrice(producto.precioOferta)}</p>
                      <p className="text-xs text-gray-400 line-through">{formatPrice(producto.precio)}</p>
                    </div>
                  ) : (
                    <p className="font-semibold text-gray-900">{formatPrice(producto.precio)}</p>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${producto.stock === 0 ? "text-red-600" : producto.stock < 15 ? "text-yellow-600" : "text-gray-900"}`}>
                      {producto.stock}
                    </span>
                    {producto.stock > 0 && producto.stock < 15 && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                  </div>
                </TableCell>
                <TableCell><Badge variant={estadoConfig[producto.estado].variant}>{estadoConfig[producto.estado].label}</Badge></TableCell>
                <TableCell className="font-medium">{producto.ventas}</TableCell>
                <TableCell align="right">
                  <div className="relative">
                    <button onClick={() => setMenuAbierto(menuAbierto === producto.id ? null : producto.id)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                    {menuAbierto === producto.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Eye className="w-4 h-4 mr-3 text-gray-400" />Ver detalles</button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Edit className="w-4 h-4 mr-3 text-gray-400" />Editar</button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><ImageIcon className="w-4 h-4 mr-3 text-gray-400" />Cambiar imagen</button>
                        <hr className="my-1" />
                        <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4 mr-3" />Eliminar</button>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Paginación */}
        <Pagination currentPage={currentPage} totalPages={3} onPageChange={setCurrentPage} totalItems={productosFiltrados.length} />

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader title="Acciones Masivas" />
            <div className="space-y-3">
              <Button variant="outline" fullWidth leftIcon={<Package className="w-4 h-4" />}>Importar Productos</Button>
              <Button variant="outline" fullWidth leftIcon={<Archive className="w-4 h-4" />}>Exportar Catálogo</Button>
            </div>
          </Card>

          <Card>
            <CardHeader title="Sin Imagen" icon={<ImageIcon className="w-5 h-5 text-yellow-600" />} />
            <p className="text-3xl font-bold text-yellow-600 mb-2">3</p>
            <p className="text-sm text-gray-500">Productos sin foto principal</p>
            <button className="mt-4 text-sm text-blue-600 font-medium hover:underline">Ver productos →</button>
          </Card>

          <Card>
            <CardHeader title="Más Vendidos" icon={<TrendingUp className="w-5 h-5 text-purple-600" />} />
            <div className="space-y-2">
              {productosMockup.slice(0, 3).map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-6">#{idx + 1}</span>
                    <span className="text-sm text-gray-700 truncate">{p.nombre.substring(0, 18)}...</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{p.ventas}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <CreateProductModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSave={(product) => { console.log("Producto creado:", product); setShowCreateModal(false); }} />
    </AdminLayout>
  );
}
