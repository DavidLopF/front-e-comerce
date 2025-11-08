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
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getShippingCost,
    getTotalWithShipping,
  } = useCartStore();
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

  const [checkoutData, setCheckoutData] = useState<CheckoutFormData | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Move this import to the top of the file

  const subtotal = getTotalPrice();
  const shippingCost = getShippingCost();
  const totalPrice = getTotalWithShipping();

  // Colores dinámicos del tema
  const primaryColor = config?.theme?.colors?.primary || "#3b82f6";
  const primaryHover = config?.theme?.colors?.primaryHover || primaryColor;

  // Función para normalizar colores (agregar # si no lo tiene)
  const normalizeColor = (color: string | undefined, fallback: string) => {
    if (!color) return fallback;
    return color.startsWith("#") ? color : `#${color}`;
  };

  const normalizedPrimary = normalizeColor(primaryColor, "#3b82f6");

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
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      // Agregar el token de autorización si está disponible
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const userResponse = await fetch(
        `${apiUrl}/users/firebase/${user?.uid}`,
        {
          method: "GET",
          headers,
        }
      );

      if (!userResponse.ok) {
        const errorData = await userResponse.json().catch(() => ({}));
        const errorMsg =
          errorData.message ||
          `Error ${userResponse.status}: ${userResponse.statusText}`;
        throw new Error(errorMsg);
      }

      const userData = await userResponse.json();

      console.log("Datos del usuario obtenidos:", userData);

      // Preparar los datos del usuario para el modal de checkout
      const checkoutFormData = {
        nombre: userData.name || "",
        email: userData.email || "",
        telefono: userData.phone || "",
        direccion: userData.deliveryAddress || userData.address || "",
      };

      console.log("Datos mapeados para el checkout:", checkoutFormData);

      // Establecer los datos primero, luego mostrar el modal
      setCheckoutData(checkoutFormData);
      setShowCheckoutModal(true);
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Hubo un problema al obtener la información del usuario. Por favor, intenta nuevamente.";
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
  const handleCheckoutSubmit = async (formData: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
  }) => {
    setIsProcessingPayment(true);

    try {
      // Crear referencia externa única
      const externalReference = `cart_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Instanciar el servicio de pagos
      const paymentService = new PaymentBackendService();

      // Llamar directamente al backend NestJS
      console.log("🛒 Iniciando proceso de pago...", {
        itemCount: items.length,
        totalPrice,
        externalReference,
      });

      const paymentResponse = await paymentService.createPaymentPreference(
        items,
        formData.email,
        externalReference,
        {
          name: formData.nombre,
          phone: formData.telefono,
          address: formData.direccion,
        }
      );

      console.log("📦 Respuesta completa del servicio:", paymentResponse);

      if (paymentResponse.success && paymentResponse.data?.initPointUrl) {
        console.log("✅ Preferencia creada exitosamente:", {
          preferenceId: paymentResponse.data.preferenceId,
          initPointUrl: paymentResponse.data.initPointUrl,
        });

        // Cerrar el modal
        setShowCheckoutModal(false);

        console.log("🔄 Redirigiendo a:", paymentResponse.data.initPointUrl);

        // Redirigir a MercadoLibre
        window.location.href = paymentResponse.data.initPointUrl;
      } else {
        console.error("❌ Respuesta sin éxito:", paymentResponse);
        throw new Error(
          paymentResponse.error?.message || "Error al procesar el pago"
        );
      }
    } catch (error) {
      console.error("❌ Error al procesar pago:", error);
      alert(
        "Hubo un error al procesar el pago. Por favor, intenta nuevamente."
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <AiFillShopping className="mx-auto mb-4 text-gray-400" size={150} />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tu carrito está vacío
          </h1>
          <p className="text-gray-600 mb-8">
            ¡Agrega algunos productos para comenzar!
          </p>
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
          <p className="text-gray-600 mt-2">
            {items.length} {items.length === 1 ? "producto" : "productos"} en tu
            carrito
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              const finalPrice =
                item.product.discount && item.product.discount > 0
                  ? (item.product.priceCents * (100 - item.product.discount)) /
                    100
                  : item.product.priceCents;

              return (
                <div
                  key={item.product.id}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden ${
                    removingItemId === item.product.id
                      ? "cart-item-removing"
                      : ""
                  }`}
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex gap-4 sm:gap-5">
                      {/* Imagen del producto */}
                      <Link
                        href={`/producto/${item.product.slug}`}
                        className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-lg overflow-hidden group"
                      >
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-10 h-10 text-gray-300"
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
                        {item.product.discount && item.product.discount > 0 && (
                          <div className="absolute top-1 left-1 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                            -{item.product.discount}%
                          </div>
                        )}
                      </Link>

                      {/* Información del producto */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        {/* Título y botón eliminar */}
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <Link
                            href={`/producto/${item.product.slug}`}
                            className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 flex-1"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => handleRemoveItem(item.product.id)}
                            disabled={removingItemId === item.product.id}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all flex-shrink-0 disabled:opacity-50"
                            title="Eliminar"
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

                        {/* Precio original con descuento */}
                        {item.product.discount && item.product.discount > 0 && (
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm text-gray-400 line-through">
                              {formatPriceCOP(item.product.priceCents)}
                            </span>
                            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                              Ahorra{" "}
                              {formatPriceCOP(
                                (item.product.priceCents - finalPrice) *
                                  item.quantity
                              )}
                            </span>
                          </div>
                        )}

                        {/* Controles y precio - Desktop */}
                        <div className="hidden sm:flex items-center justify-between mt-auto">
                          {/* Selector de cantidad */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 text-gray-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
                              disabled={item.quantity <= 1}
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
                                  strokeWidth={2.5}
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>

                            <span className="w-12 text-center text-base font-bold text-gray-900 select-none">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 text-gray-700 transition-all"
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
                                  strokeWidth={2.5}
                                  d="M12 6v12m6-6H6"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Precio */}
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              {formatPriceCOP(finalPrice * item.quantity)}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formatPriceCOP(finalPrice)} c/u
                            </p>
                          </div>
                        </div>

                        {/* Controles y precio - Mobile */}
                        <div className="sm:hidden space-y-3 mt-auto">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 font-medium">
                              Cantidad:
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                                className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 text-gray-700 transition-all disabled:opacity-40"
                                disabled={item.quantity <= 1}
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
                                    strokeWidth={2.5}
                                    d="M20 12H4"
                                  />
                                </svg>
                              </button>

                              <span className="w-10 text-center text-base font-bold text-gray-900">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                                className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 text-gray-700 transition-all"
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
                                    strokeWidth={2.5}
                                    d="M12 6v12m6-6H6"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-sm text-gray-600 font-medium">
                              Subtotal:
                            </span>
                            <div className="text-right">
                              <p className="text-xl font-bold text-gray-900">
                                {formatPriceCOP(finalPrice * item.quantity)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatPriceCOP(finalPrice)} c/u
                              </p>
                            </div>
                          </div>
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
              className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Vaciar carrito</span>
            </button>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-100">
                Resumen del pedido
              </h2>

              <div className="space-y-4 mb-6">
                {/* Items count */}
                <div className="flex items-center justify-between text-gray-700">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      {items.reduce((total, item) => total + item.quantity, 0)}{" "}
                      {items.reduce(
                        (total, item) => total + item.quantity,
                        0
                      ) === 1
                        ? "producto"
                        : "productos"}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatPriceCOP(subtotal)}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex items-center justify-between text-gray-700">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                      />
                    </svg>
                    <span className="text-sm font-medium">Envío</span>
                  </div>
                  <span className="font-semibold text-blue-600">
                    {formatPriceCOP(shippingCost)}
                  </span>
                </div>

                {/* Total */}
                <div className="pt-4 border-t-2 border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPriceCOP(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleProceedToPayment}
                  disabled={isProcessingPayment}
                  className="w-full text-white py-3.5 px-6 rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
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
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceder al pago</span>
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
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </button>

                <Link
                  href="/store"
                  className="block text-center py-3 font-medium transition-all text-sm border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300"
                  style={{ color: normalizedPrimary }}
                >
                  Continuar comprando
                </Link>
              </div>

             
              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-6 h-6 text-green-600 mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span className="text-xs text-gray-600 font-medium">
                      Compra segura
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-6 h-6 text-blue-600 mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <span className="text-xs text-gray-600 font-medium">
                      Pago seguro
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-6 h-6 text-purple-600 mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-xs text-gray-600 font-medium">
                      Garantía
                    </span>
                  </div>
                </div>
              </div>
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
                <svg
                  className="w-6 h-6"
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
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">
                    Ha ocurrido un error
                  </p>
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
