"use client";

import { useAuth } from '@/shared/providers/AuthProvider';
import { useStoreConfigContext } from '@/shared/providers/StoreConfigProvider';
import { useRouter } from 'next/navigation';
import { ReactNode, useState, useRef, useEffect } from 'react';
import EditProfileModal from './EditProfileModal';
import { 
  LayoutGrid,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  Bell,
  Edit3,
  ChevronDown
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  currentPage?: string;
}

export default function AdminLayout({ children, currentPage = 'dashboard' }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const { config } = useStoreConfigContext();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleEditProfile = () => {
    setShowProfileDropdown(false);
    setShowEditProfileModal(true);
  };

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard', href: '/admin/store' },
    { id: 'products', icon: Package, label: 'Productos', href: '/admin/products' },
    { id: 'orders', icon: ShoppingCart, label: 'Pedidos', href: '/admin/orders' },
    { id: 'customers', icon: Users, label: 'Clientes', href: '/admin/customers' },
    { id: 'analytics', icon: BarChart3, label: 'Analíticas', href: '/admin/analytics' },
    { id: 'settings', icon: Settings, label: 'Configuración', href: '/admin/settings' },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold">{config?.store?.name || 'TechStore Pro'}</h2>
              <p className="text-xs text-slate-400">Panel de Admin</p>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.href)}
                className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-slate-800">
          {!isCollapsed && (
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.displayName?.[0] || user?.email?.[0] || 'A'}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {user?.displayName || 'Admin'}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {user?.email}
                </div>
              </div>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Cerrar Sesión</span>}
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Panel de Administrador</h1>
              <p className="text-gray-600">Resumen de la actividad de tu tienda</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                <Bell size={20} className="text-gray-600" />
              </button>
              
              {/* User Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.displayName?.[0] || user?.email?.[0] || 'A'}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.displayName || 'Admin'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Administrador
                    </div>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-400 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} 
                  />
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.displayName || 'Administrador'}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {user?.email}
                      </div>
                    </div>
                    
                    <button
                      onClick={handleEditProfile}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Edit3 size={16} className="mr-3" />
                      Editar Perfil
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} className="mr-3" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-white">
          {children}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={showEditProfileModal} 
        onClose={() => setShowEditProfileModal(false)} 
      />
    </div>
  );
}