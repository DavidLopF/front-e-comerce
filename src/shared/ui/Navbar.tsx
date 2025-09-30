"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useCartStore } from "../store/cartStore";
import CartDropdown from "./CartDropdown";
import { useStoreConfigContext } from "../providers/StoreConfigProvider";

export default function Navbar() {
  const { config, loading } = useStoreConfigContext();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Colores dinámicos del tema
  const primaryColor = config?.theme?.colors?.primary || '#3b82f6';
  const primaryHover = config?.theme?.colors?.primaryHover || primaryColor;

  // Función para normalizar colores (agregar # si no lo tiene)
  const normalizeColor = (color: string | undefined, fallback: string) => {
    if (!color) return fallback;
    return color.startsWith('#') ? color : `#${color}`;
  };

  const normalizedPrimary = normalizeColor(primaryColor, '#3b82f6');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Si está cargando, mostrar navbar básico
  if (loading) {
    return (
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl sm:text-2xl font-bold text-gray-400">
              Cargando...
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo dinámico */}
          <Link href="/" className="flex items-center space-x-3">
            {config?.store?.logo ? (
              <Image
                src={config.store.logo.url}
                alt={config.store.logo.alt}
                width={config.store.logo.width || 180}
                height={config.store.logo.height || 50}
                className="h-8 w-auto sm:h-10"
              />
            ) : (
              <span 
                className="text-xl sm:text-2xl font-bold"
                style={{ color: primaryColor }}
              >
                {config?.store?.name || 'Mi Tienda'}
              </span>
            )}
          </Link>

          {/* Enlaces de navegación - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {config?.navigation?.menuItems?.map((item) => (
              <Link 
                key={item.id}
                href={item.href} 
                className="text-gray-700 hover:transition-colors font-medium flex items-center space-x-1"
                style={{ 
                  '--hover-color': primaryColor,
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = normalizedPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#374151';
                }}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">
                    {item.badge}
                  </span>
                )}
              </Link>
            )) || (
              <>
                <Link href="/" className="text-gray-700 hover:transition-colors font-medium">
                  Inicio
                </Link>
                <Link href="/store" className="text-gray-700 hover:transition-colors font-medium">
                  Tienda
                </Link>
                <Link href="/carrito" className="text-gray-700 hover:transition-colors font-medium">
                  Carrito
                </Link>
              </>
            )}
          </div>

          {/* Carrito - Desktop */}
          <div className="hidden md:block relative">
            <button 
              onClick={toggleCart}
              className="relative text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-md"
              style={{ 
                backgroundColor: normalizedPrimary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = normalizedPrimary;
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="font-semibold">Carrito</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[24px] h-6 px-2 flex items-center justify-center shadow-lg">
                  {totalItems}
                </span>
              )}
            </button>
            <CartDropdown isOpen={isCartOpen} onClose={closeCart} />
          </div>

          {/* Carrito - Mobile (solo ícono) */}
          <div className="md:hidden flex items-center space-x-3 relative">
            <button 
              onClick={toggleCart}
              className="relative text-white p-2 rounded-lg transition-colors shadow-md"
              style={{ 
                backgroundColor: normalizedPrimary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = normalizedPrimary;
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow-lg">
                  {totalItems}
                </span>
              )}
            </button>
            <CartDropdown isOpen={isCartOpen} onClose={closeCart} />

            {/* Botón hamburguesa */}
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 transition-colors p-2"
              aria-label="Abrir menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <Link
                href="/"
                onClick={closeMenu}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                Inicio
              </Link>
              <Link
                href="/store"
                onClick={closeMenu}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                Tienda
              </Link>
              <Link
                href="/carrito"
                onClick={closeMenu}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                Carrito
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
