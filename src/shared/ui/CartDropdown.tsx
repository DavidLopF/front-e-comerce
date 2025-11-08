"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { useCartStore } from "../store/cartStore";
import { formatPriceCOP } from "../utils/priceFormatter";
import { useStoreConfigContext } from "../providers/StoreConfigProvider";

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const { config } = useStoreConfigContext();
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getShippingCost,
    getTotalWithShipping,
  } = useCartStore();
  const subtotal = getTotalPrice();
  const shippingCost = getShippingCost();
  const totalPrice = getTotalWithShipping();
  const autoCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  // Colores dinámicos del tema
  const primaryColor = config?.theme?.colors?.primary || "#3b82f6";
  const primaryHover = config?.theme?.colors?.primaryHover || primaryColor;

  // Función para normalizar colores (agregar # si no lo tiene)
  const normalizeColor = (color: string | undefined, fallback: string) => {
    if (!color) return fallback;
    return color.startsWith("#") ? color : `#${color}`;
  };

  const normalizedPrimary = normalizeColor(primaryColor, "#3b82f6");

  // Función para reiniciar el timer de auto-cierre
  const resetAutoClose = useCallback(() => {
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }
    autoCloseTimeoutRef.current = setTimeout(() => {
      onClose();
    }, 8000);
  }, [onClose]);

  // Auto-cierre inteligente
  useEffect(() => {
    if (isOpen) {
      resetAutoClose();

      // Limpiar timeout al desmontar o cuando se cierre manualmente
      return () => {
        if (autoCloseTimeoutRef.current) {
          clearTimeout(autoCloseTimeoutRef.current);
        }
      };
    }
  }, [isOpen, onClose, resetAutoClose]);

  // Manejar interacciones del usuario para pausar el auto-cierre
  const handleUserInteraction = () => {
    resetAutoClose();
  };

  // Manejar eliminación con animación
  const handleRemoveItem = (productId: string) => {
    setRemovingItemId(productId);
    // Esperar a que termine la animación antes de eliminar
    setTimeout(() => {
      removeItem(productId);
      setRemovingItemId(null);
      handleUserInteraction();
    }, 300); // Duración de la animación
  };

  // Limpiar timeout cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay elegante con blur */}
      <div
        className="fixed inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/5 backdrop-blur-sm z-[9998] animate-fade-in"
        onClick={onClose}
      />

      {/* Dropdown del carrito */}
      <div
        className="cart-dropdown fixed right-4 top-20 w-80 sm:w-96 bg-white rounded-xl border border-gray-200 z-[9999] max-h-[calc(100vh-100px)] overflow-hidden animate-slide-down"
        onMouseEnter={handleUserInteraction}
        onMouseMove={handleUserInteraction}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Mi Carrito</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {items.length} {items.length === 1 ? "producto" : "productos"}
          </p>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-6 text-center">
              {/* Icono consistente con el usado en la página principal del carrito */}
              <svg
                className="w-12 h-12 mx-auto mb-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 6h15l-1.5 9H9.5L6 6z" />
                <circle cx="10" cy="19" r="1.4" />
                <circle cx="18" cy="19" r="1.4" />
              </svg>
              <p className="text-gray-500 text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {items.slice(0, 3).map((item) => {
                const finalPrice =
                  item.product.discount && item.product.discount > 0
                    ? (item.product.priceCents *
                        (100 - item.product.discount)) /
                      100
                    : item.product.priceCents;

                return (
                  <div
                    key={item.product.id}
                    className={`cart-item flex gap-3 p-2 rounded-lg ${
                      removingItemId === item.product.id
                        ? "cart-item-removing"
                        : ""
                    }`}
                  >
                    {/* Imagen del producto */}
                    <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/producto/${item.product.slug}`}
                        onClick={onClose}
                        className="text-sm font-medium text-gray-900 block truncate transition-colors"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = normalizedPrimary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#111827";
                        }}
                      >
                        {item.product.name}
                      </Link>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1
                              );
                              handleUserInteraction();
                            }}
                            className="w-6 h-6 bg-red-50 hover:bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="text-sm font-semibold px-2">
                            {item.quantity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1
                              );
                              handleUserInteraction();
                            }}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                            style={{
                              backgroundColor: `${normalizedPrimary}20`,
                              color: normalizedPrimary,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = `${normalizedPrimary}30`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = `${normalizedPrimary}20`;
                            }}
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatPriceCOP(finalPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Botón eliminar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item.product.id);
                      }}
                      disabled={removingItemId === item.product.id}
                      className="text-red-400 hover:text-red-600 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}

              {/* Mostrar más productos si hay más de 3 */}
              {items.length > 3 && (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-500">
                    y {items.length - 3} productos más...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer del dropdown */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-1 text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPriceCOP(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
              <span>Envío</span>
              <span className="font-semibold text-blue-600">
                {shippingCost === 0 ? "GRATIS" : formatPriceCOP(shippingCost)}
              </span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-900">Total:</span>
              <span className="text-lg font-bold text-gray-900">
                {formatPriceCOP(totalPrice)}
              </span>
            </div>

            <div className="space-y-2">
              <Link
                href="/carrito"
                onClick={onClose}
                className="w-full text-white py-2 px-4 rounded-lg font-semibold text-sm transition-colors text-center block"
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
                Ver carrito completo
              </Link>

              <button
                onClick={onClose}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium text-sm transition-colors text-center"
              >
                Continuar comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
