"use client";

import AdminLayout from '@/shared/ui/AdminLayout';
import { useState } from 'react';
import Image from 'next/image';
import {
  Button,
  Input,
  Select,
  Card,
  CardHeader,
  StatCard,
  Tabs,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Badge,
  AvatarWithInfo,
  SearchInput,
} from '@/shared/components';
import {
  Settings,
  Palette,
  Building2,
  Users,
  Save,
  Upload,
  Image as ImageIcon,
  X,
  Edit2,
  Trash2,
  Plus,
  Shield,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'super_admin' | 'admin' | 'vendedor' | 'cliente';
  estado: 'activo' | 'inactivo';
  fechaRegistro: string;
}

const rolesConfig: Record<string, { label: string; variant: 'purple' | 'primary' | 'success' | 'secondary'; avatarVariant: 'purple' | 'blue' | 'green' | 'gray' }> = {
  super_admin: { label: 'Super Admin', variant: 'purple', avatarVariant: 'purple' },
  admin: { label: 'Administrador', variant: 'primary', avatarVariant: 'blue' },
  vendedor: { label: 'Vendedor', variant: 'success', avatarVariant: 'green' },
  cliente: { label: 'Cliente', variant: 'secondary', avatarVariant: 'gray' },
};

const usuariosMockup: Usuario[] = [
  { id: '1', nombre: 'David López', email: 'david@techstore.com', rol: 'super_admin', estado: 'activo', fechaRegistro: '2024-01-15' },
  { id: '2', nombre: 'María González', email: 'maria@techstore.com', rol: 'admin', estado: 'activo', fechaRegistro: '2024-02-20' },
  { id: '3', nombre: 'Carlos Ruiz', email: 'carlos@techstore.com', rol: 'vendedor', estado: 'activo', fechaRegistro: '2024-03-10' },
  { id: '4', nombre: 'Ana Martínez', email: 'ana@techstore.com', rol: 'vendedor', estado: 'activo', fechaRegistro: '2024-03-15' },
  { id: '5', nombre: 'Pedro Sánchez', email: 'pedro@techstore.com', rol: 'vendedor', estado: 'inactivo', fechaRegistro: '2024-04-01' },
];

const rolOptions = [
  { value: 'todos', label: 'Todos los roles' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Administrador' },
  { value: 'vendedor', label: 'Vendedor' },
  { value: 'cliente', label: 'Cliente' },
];

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState('apariencia');
  const [searchUsuario, setSearchUsuario] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');

  // Estados para Apariencia
  const [colorPrimario, setColorPrimario] = useState('#3B82F6');
  const [colorSecundario, setColorSecundario] = useState('#10B981');
  const [colorFondo, setColorFondo] = useState('#F9FAFB');
  const [logoUrl, setLogoUrl] = useState('');
  const [heroImages, setHeroImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200',
  ]);

  // Estados para Información de la Empresa
  const [nombreEmpresa, setNombreEmpresa] = useState('TechStore Pro');
  const [descripcion, setDescripcion] = useState('Tu tienda de tecnología de confianza');
  const [email, setEmail] = useState('contacto@techstore.com');
  const [telefono, setTelefono] = useState('+57 300 123 4567');
  const [direccion, setDireccion] = useState('Calle 123 #45-67, Bogotá, Colombia');
  const [sitioWeb, setSitioWeb] = useState('https://techstore.com');

  const usuariosFiltrados = usuariosMockup.filter((usuario) => {
    const matchSearch = usuario.nombre.toLowerCase().includes(searchUsuario.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchUsuario.toLowerCase());
    const matchRol = filtroRol === 'todos' || usuario.rol === filtroRol;
    return matchSearch && matchRol;
  });

  const tabs = [
    { id: 'apariencia', label: 'Apariencia', icon: <Palette className="w-5 h-5" /> },
    { id: 'empresa', label: 'Información de la Empresa', icon: <Building2 className="w-5 h-5" /> },
    { id: 'usuarios', label: 'Gestión de Usuarios', icon: <Users className="w-5 h-5" /> },
  ];

  const handleAddHeroImage = () => {
    const newUrl = prompt('Ingresa la URL de la imagen:');
    if (newUrl) setHeroImages([...heroImages, newUrl]);
  };

  const renderApariencia = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Paleta de Colores" icon={<Palette className="w-5 h-5" />} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color Primario</label>
            <div className="flex items-center gap-3">
              <input type="color" value={colorPrimario} onChange={(e) => setColorPrimario(e.target.value)} className="w-16 h-10 rounded border border-gray-300 cursor-pointer" />
              <Input value={colorPrimario} onChange={(e) => setColorPrimario(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color Secundario</label>
            <div className="flex items-center gap-3">
              <input type="color" value={colorSecundario} onChange={(e) => setColorSecundario(e.target.value)} className="w-16 h-10 rounded border border-gray-300 cursor-pointer" />
              <Input value={colorSecundario} onChange={(e) => setColorSecundario(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color de Fondo</label>
            <div className="flex items-center gap-3">
              <input type="color" value={colorFondo} onChange={(e) => setColorFondo(e.target.value)} className="w-16 h-10 rounded border border-gray-300 cursor-pointer" />
              <Input value={colorFondo} onChange={(e) => setColorFondo(e.target.value)} />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Logo de la Tienda" icon={<ImageIcon className="w-5 h-5" />} />
        <div className="space-y-4">
          <Input label="URL del Logo" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://ejemplo.com/logo.png" />
          <div className="flex items-center gap-4">
            <Button variant="secondary" leftIcon={<Upload className="w-4 h-4" />}>Subir Logo</Button>
            {logoUrl && (
              <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                <div className="relative h-16 w-32">
                  <Image src={logoUrl} alt="Logo preview" fill className="object-contain" />
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader 
          title="Imágenes del Hero (Carrusel)" 
          icon={<ImageIcon className="w-5 h-5" />}
          action={<Button leftIcon={<Plus className="w-4 h-4" />} onClick={handleAddHeroImage}>Agregar Imagen</Button>}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {heroImages.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <Image src={url} alt={`Hero ${index + 1}`} fill className="object-cover" />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                <button onClick={() => setHeroImages(heroImages.filter((_, i) => i !== index))} className="opacity-0 group-hover:opacity-100 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-opacity">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 truncate">{url}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button leftIcon={<Save className="w-4 h-4" />} onClick={() => alert('Configuración guardada')}>Guardar Cambios</Button>
      </div>
    </div>
  );

  const renderEmpresa = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Información Básica" icon={<Building2 className="w-5 h-5" />} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input label="Nombre de la Empresa" value={nombreEmpresa} onChange={(e) => setNombreEmpresa(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Información de Contacto" icon={<Phone className="w-5 h-5" />} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Email de Contacto" leftIcon={<Mail className="w-4 h-4" />} value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          <Input label="Teléfono" leftIcon={<Phone className="w-4 h-4" />} value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          <div className="md:col-span-2">
            <Input label="Dirección" leftIcon={<MapPin className="w-4 h-4" />} value={direccion} onChange={(e) => setDireccion(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Input label="Sitio Web" value={sitioWeb} onChange={(e) => setSitioWeb(e.target.value)} type="url" />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button leftIcon={<Save className="w-4 h-4" />} onClick={() => alert('Información guardada')}>Guardar Cambios</Button>
      </div>
    </div>
  );

  const renderUsuarios = () => (
    <div className="space-y-6">
      <Card padding="sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchInput placeholder="Buscar por nombre o email..." value={searchUsuario} onChange={(e) => setSearchUsuario(e.target.value)} />
          </div>
          <Select options={rolOptions} value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)} />
          <Button leftIcon={<Plus className="w-4 h-4" />}>Nuevo Usuario</Button>
        </div>
      </Card>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Usuario</TableHeaderCell>
            <TableHeaderCell>Rol</TableHeaderCell>
            <TableHeaderCell>Estado</TableHeaderCell>
            <TableHeaderCell>Fecha Registro</TableHeaderCell>
            <TableHeaderCell align="right">Acciones</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuariosFiltrados.map((usuario) => {
            const rolConfig = rolesConfig[usuario.rol];
            return (
              <TableRow key={usuario.id}>
                <TableCell>
                  <AvatarWithInfo name={usuario.nombre} subtitle={usuario.email} variant={rolConfig.avatarVariant} />
                </TableCell>
                <TableCell>
                  <Badge variant={rolConfig.variant} icon={<Shield className="w-3 h-3" />}>{rolConfig.label}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={usuario.estado === 'activo' ? 'success' : 'danger'}>
                    {usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-500">
                  {new Date(usuario.fechaRegistro).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                </TableCell>
                <TableCell align="right">
                  <button className="text-blue-600 hover:text-blue-900 mr-3"><Edit2 className="w-4 h-4" /></button>
                  <button className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Super Admins" value={usuariosMockup.filter((u) => u.rol === 'super_admin').length} icon={<Shield className="w-8 h-8" />} variant="purple" />
        <StatCard title="Administradores" value={usuariosMockup.filter((u) => u.rol === 'admin').length} icon={<Users className="w-8 h-8" />} variant="primary" />
        <StatCard title="Vendedores" value={usuariosMockup.filter((u) => u.rol === 'vendedor').length} icon={<Users className="w-8 h-8" />} variant="success" />
        <StatCard title="Usuarios Activos" value={usuariosMockup.filter((u) => u.estado === 'activo').length} icon={<Users className="w-8 h-8" />} variant="default" />
      </div>
    </div>
  );

  return (
    <AdminLayout currentPage="settings">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-7 h-7" />
            Configuración
          </h1>
          <p className="text-gray-600 mt-1">Personaliza tu tienda y gestiona usuarios</p>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div>
          {activeTab === 'apariencia' && renderApariencia()}
          {activeTab === 'empresa' && renderEmpresa()}
          {activeTab === 'usuarios' && renderUsuarios()}
        </div>
      </div>
    </AdminLayout>
  );
}
