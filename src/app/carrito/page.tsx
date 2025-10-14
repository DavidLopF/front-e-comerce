"use client";
import { AiFillShopping } from "react-icons/ai";

import { useState } from "react";
import { useCartStore } from "@/shared/store/cartStore";
import { formatPriceCOP } from "@/shared/utils/priceFormatter";
import Link from "next/link";
import { useStoreConfigContext } from "@/shared/providers/StoreConfigProvider";
import CheckoutModal from "@/shared/ui/CheckoutModal";
import AuthModal from "@/shared/ui/AuthModal";
import { PaymentBackendService } from "@/shared/services/PaymentBackendService";
import { useAuth } from "@/shared/providers/AuthProvider";
import { AuthService } from "@/shared/services/AuthService";

export default function CarritoPage() {
  const { config } = useStoreConfigContext();
  const { user, isAuthenticated } = useAuth();
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getShippingCost, getTotalWithShipping } = useCartStore();
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  // Tipo explícito para los datos del formulario de checkout
  interface CheckoutFormData {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
  }

  const [checkoutData, setCheckoutData] = useState<CheckoutFormData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Move this import to the top of the file

  const subtotal = getTotalPrice();
  const shippingCost = getShippingCost();
  const totalPrice = getTotalWithShipping();

  // Colores dinámicos del tema
  const primaryColor = config?.theme?.colors?.primary || '#3b82f6';
  const primaryHover = config?.theme?.colors?.primaryHover || primaryColor;

  // Función para normalizar colores (agregar # si no lo tiene)
  const normalizeColor = (color: string | undefined, fallback: string) => {
    if (!color) return fallback;
    return color.startsWith('#') ? color : `#${color}`;
  };

  const normalizedPrimary = normalizeColor(primaryColor, '#3b82f6');

  // Manejar eliminación con animación
  const handleRemoveItem = (productId: string) => {
    setRemovingItemId(productId);
    // Esperar a que termine la animación antes de eliminar
    setTimeout(() => {
      removeItem(productId);
      setRemovingItemId(null);
    }, 300); // Duración de la animación
  };

  // Manejar proceder al pago
  const handleProceedToPayment = async () => {
    if (items.length === 0) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      // Obtener el token de Firebase
      const token = await AuthService.getCurrentUserToken();
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const headers: HeadersInit = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      // Agregar el token de autorización si está disponible
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const userResponse = await fetch(`${apiUrl}/users/firebase/${user?.uid}`, {
        method: 'GET',
        headers
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json().catch(() => ({}));
        const errorMsg = errorData.message || `Error ${userResponse.status}: ${userResponse.statusText}`;
        throw new Error(errorMsg);
      }

      const userData = await userResponse.json();

      console.log("Datos del usuario obtenidos:", userData);

      // Preparar los datos del usuario para el modal de checkout
      const checkoutFormData = {
        nombre: userData.name || '',
        email: userData.email || '',
        telefono: userData.phone || '',
        direccion: userData.deliveryAddress || userData.address || ''
      };

      console.log("Datos mapeados para el checkout:", checkoutFormData);

      // Establecer los datos primero, luego mostrar el modal
      setCheckoutData(checkoutFormData);
      setShowCheckoutModal(true);
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      const message = error instanceof Error ? error.message : "Hubo un problema al obtener la información del usuario. Por favor, intenta nuevamente.";
      setErrorMessage(message);
      setShowErrorModal(true);
    }
  };

  // Manejar autenticación exitosa
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Mostrar el modal de checkout después de autenticarse
    setShowCheckoutModal(true);
  };

  // Manejar envío del formulario de checkout
  const handleCheckoutSubmit = async (formData: { nombre: string; email: string; telefono: string; direccion: string }) => {
    setIsProcessingPayment(true);
    
    try {
      // Crear referencia externa única
      const externalReference = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Instanciar el servicio de pagos
      const paymentService = new PaymentBackendService();

      // Llamar directamente al backend NestJS
      console.log('🛒 Iniciando proceso de pago...', {
        itemCount: items.length,
        totalPrice,
        externalReference
      });

      const paymentResponse = await paymentService.createPaymentPreference(
        items,
        formData.email,
        externalReference,
        {
          name: formData.nombre,
          phone: formData.telefono,
          address: formData.direccion
        }
      );

      console.log('📦 Respuesta completa del servicio:', paymentResponse);

      if (paymentResponse.success && paymentResponse.data?.initPointUrl) {
        console.log('✅ Preferencia creada exitosamente:', {
          preferenceId: paymentResponse.data.preferenceId,
          initPointUrl: paymentResponse.data.initPointUrl
        });
        
        // Cerrar el modal
        setShowCheckoutModal(false);
        
        console.log('🔄 Redirigiendo a:', paymentResponse.data.initPointUrl);
        
        // Redirigir a MercadoLibre
        window.location.href = paymentResponse.data.initPointUrl;
      } else {
        console.error('❌ Respuesta sin éxito:', paymentResponse);
        throw new Error(paymentResponse.error?.message || 'Error al procesar el pago');
      }

    } catch (error) {
      console.error('❌ Error al procesar pago:', error);
      alert('Hubo un error al procesar el pago. Por favor, intenta nuevamente.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <AiFillShopping className="mx-auto mb-4 text-gray-400" size={150} />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">¡Agrega algunos productos para comenzar!</p>
          <Link 
            href="/store" 
            className="inline-block text-white px-8 py-3 rounded-lg font-semibold transition-colors"
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
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Mi Carrito</h1>
          <p className="text-gray-600 mt-2">{items.length} {items.length === 1 ? 'producto' : 'productos'} en tu carrito</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const finalPrice = item.product.discount && item.product.discount > 0
                ? item.product.priceCents * (100 - item.product.discount) / 100
                : item.product.priceCents;

              return (
                <div 
                  key={item.product.id} 
                  className={`bg-white rounded-xl shadow-sm p-4 sm:p-6 ${removingItemId === item.product.id ? 'cart-item-removing' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Imagen del producto */}
                    <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0">
                          <Link 
                            href={`/producto/${item.product.slug}`}
                            className="text-base sm:text-lg font-semibold text-gray-900 block truncate transition-colors"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = normalizedPrimary;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#111827';
                            }}
                          >
                            {item.product.name}
                          </Link>
                          {item.product.discount && item.product.discount > 0 && (
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm text-gray-500 line-through">
                                {formatPriceCOP(item.product.priceCents)}
                              </span>
                              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">
                                -{item.product.discount}% OFF
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.product.id)}
                          disabled={removingItemId === item.product.id}
                          className="text-red-500 hover:text-red-700 p-2 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar producto"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Selector de cantidad */}
                        <div className="flex items-center justify-center sm:justify-start">
                          <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 transition-colors font-bold"
                              disabled={item.quantity <= 1}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                              </svg>
                            </button>
                            <input
                              type="text"
                              value={item.quantity}
                              readOnly
                              className="w-14 px-3 py-2 text-center text-base font-bold text-gray-900 border-x-2 border-gray-300 bg-gray-50"
                            />
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-3 py-2 transition-colors font-bold"
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
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Precio total del item */}
                        <div className="text-center sm:text-right">
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {formatPriceCOP(finalPrice * item.quantity)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatPriceCOP(finalPrice)} c/u
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Botón para vaciar carrito */}
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-semibold flex items-center space-x-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Vaciar carrito</span>
            </button>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 sticky top-20 lg:top-24">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Resumen del pedido</h2>
              
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span className="break-words">Subtotal ({items.reduce((total, item) => total + item.quantity, 0)} productos)</span>
                  <span className="font-semibold flex-shrink-0 ml-2">{formatPriceCOP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span>Envío</span>
                  <span className="font-semibold text-blue-600 flex-shrink-0 ml-2">
                    {formatPriceCOP(shippingCost)}
                  </span>
                </div>
                <div className="border-t pt-3 sm:pt-4">
                  <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="flex-shrink-0 ml-2">{formatPriceCOP(totalPrice)}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleProceedToPayment}
                disabled={isProcessingPayment}
                className="w-full text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg transition-colors shadow-lg hover:shadow-xl mb-3 sm:mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: normalizedPrimary,
                }}
                onMouseEnter={(e) => {
                  if (!isProcessingPayment) {
                    e.currentTarget.style.backgroundColor = primaryHover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isProcessingPayment) {
                    e.currentTarget.style.backgroundColor = normalizedPrimary;
                  }
                }}
              >
                {isProcessingPayment ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  'Proceder al pago'
                )}
              </button>

              <Link 
                href="/store"
                className="block text-center font-semibold transition-colors text-sm sm:text-base"
                style={{ color: normalizedPrimary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = normalizedPrimary;
                }}
              >
                Continuar comprando
              </Link>

              {/* Información de envío gratis */}
              {totalPrice < 5000000 && (
                <div 
                  className="mt-4 sm:mt-6 rounded-lg p-3 sm:p-4"
                  style={{ backgroundColor: `${normalizedPrimary}10` }}
                >
                  <p 
                    className="text-xs sm:text-sm font-semibold mb-1"
                    style={{ color: normalizedPrimary }}
                  >
                    ¡Envío gratis en compras superiores a {formatPriceCOP(5000000)}!
                  </p>
                  <p 
                    className="text-xs sm:text-sm mb-2"
                    style={{ color: `${normalizedPrimary}CC` }}
                  >
                    Te faltan {formatPriceCOP(5000000 - totalPrice)} para obtener envío gratis
                  </p>
                  <div 
                    className="rounded-full h-2"
                    style={{ backgroundColor: `${normalizedPrimary}30` }}
                  >
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        backgroundColor: normalizedPrimary,
                        width: `${Math.min((totalPrice / 5000000) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Autenticación */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Modal de Checkout */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onSubmit={handleCheckoutSubmit}
        isLoading={isProcessingPayment}
        initialData={checkoutData ?? undefined}
      />

      {/* Modal de Error */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slideUp">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-red-600">Error</h2>
              <button 
                onClick={() => setShowErrorModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Ha ocurrido un error</p>
                  <p className="text-gray-600 text-sm mt-1">{errorMessage}</p>
                </div>
              </div>
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
