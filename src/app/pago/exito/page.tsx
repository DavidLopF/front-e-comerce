"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useStoreConfigContext } from '@/shared/providers/StoreConfigProvider';
import { formatPriceCOP } from '@/shared/utils/priceFormatter';

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

function PagoExitoContent() {
  const { config } = useStoreConfigContext();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<{
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
  } | null>(null);

  const paymentId = searchParams.get('payment_id');
  const collectionId = searchParams.get('collection_id');
  const collectionStatus = searchParams.get('collection_status');
  const externalReference = searchParams.get('external_reference');

  // Colores dinámicos del tema
  const primaryColor = config?.theme?.colors?.primary || '#3b82f6';
  const normalizedPrimary = primaryColor.startsWith('#') ? primaryColor : `#${primaryColor}`;

  useEffect(() => {
    // Simular carga de datos del pedido
    const timer = setTimeout(() => {
      // Aquí podrías hacer un fetch al backend para obtener los detalles reales
      // Por ahora, usamos datos de ejemplo del localStorage si están disponibles
      const cartData = typeof window !== 'undefined' ? localStorage.getItem('cart-storage') : null;
      
      if (cartData) {
        try {
          const cart = JSON.parse(cartData);
          const items = cart.state?.items || [];
          
          const orderItems: OrderItem[] = items.map((item: { product: { name: string; discount?: number; priceCents: number }; quantity: number }) => {
            const finalPrice = item.product.discount && item.product.discount > 0
              ? item.product.priceCents * (100 - item.product.discount) / 100
              : item.product.priceCents;
            
            return {
              name: item.product.name,
              quantity: item.quantity,
              unitPrice: finalPrice,
              total: finalPrice * item.quantity
            };
          });

          const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
          const shipping = 3000;
          const total = subtotal + shipping;

          setOrderData({
            items: orderItems,
            subtotal,
            shipping,
            total
          });
        } catch (error) {
          console.error('Error parsing cart data:', error);
        }
      }
      
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const currentDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mb-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: normalizedPrimary }}></div>
          <p className="text-gray-600">Verificando pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full mx-auto">
        {/* Header con animación de éxito - más compacto */}
        <div className="text-center mb-2.5">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-1.5 animate-bounce-once shadow-lg">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            ¡Pago Confirmado!
          </h1>
          <p className="text-gray-700 text-sm">
            Tu pedido ha sido procesado exitosamente
          </p>
        </div>

  {/* Factura en layout horizontal */}
  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 print:shadow-none print:rounded-none print:border-0">
          {/* Header de la factura - más compacto */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 sm:px-6 py-3 print:bg-blue-600" style={{ backgroundColor: normalizedPrimary }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {config?.store?.name || 'Mi Tienda'}
                </h2>
                <p className="text-white text-sm opacity-90">Factura de Compra</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-white text-xs opacity-90">Fecha</p>
                <p className="text-white text-sm font-semibold">{currentDate}</p>
              </div>
            </div>
          </div>

          {/* Contenido en dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-5">
            {/* Columna izquierda: Info de transacción */}
            <div className="space-y-3">
              {/* Información de la transacción */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="text-sm font-bold text-gray-900 mb-2.5">Información de Pago</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">ID Transacción</p>
                    <p className="font-mono text-xs text-gray-900 break-all">
                      {paymentId || collectionId || 'N/A'}
                    </p>
                  </div>
                  {externalReference && (
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Referencia</p>
                      <p className="font-mono text-xs text-gray-900 break-all">
                        {externalReference}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Estado</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5"></span>
                      {collectionStatus === 'approved' ? 'Aprobado' : 'Completado'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Método de Pago</p>
                    <p className="text-sm text-gray-900 font-medium">MercadoPago</p>
                  </div>
                </div>
              </div>

              {/* Mensaje de agradecimiento */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3.5 border border-blue-100">
                <div className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: normalizedPrimary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Gracias por tu compra
                    </p>
                    <p className="text-sm text-gray-700">
                      Recibirás un correo con la confirmación y detalles de envío.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha: Detalles del pedido */}
            <div className="space-y-3">
              {orderData && orderData.items.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-2.5">Detalles del Pedido</h3>
                  
                  {/* Lista compacta de productos */}
                  <div className="space-y-2 mb-3">
                    {orderData.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start border-b border-gray-200 pb-2">
                        <div className="flex-1 pr-2">
                          <p className="text-gray-900 font-medium text-sm">{item.name}</p>
                          <p className="text-gray-600 text-sm">Cant: {item.quantity} × {formatPriceCOP(item.unitPrice)}</p>
                        </div>
                        <p className="text-gray-900 font-semibold whitespace-nowrap text-sm">
                          {formatPriceCOP(item.total)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totales compactos */}
                  <div className="space-y-1.5 pt-2 border-t-2 border-gray-300">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-900 font-medium">{formatPriceCOP(orderData.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Envío:</span>
                      <span className="text-gray-900 font-medium">{formatPriceCOP(orderData.shipping)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-1.5 border-t border-gray-300">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-gray-900">{formatPriceCOP(orderData.total)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción - en una sola fila */}
          <div className="px-4 sm:px-5 py-3 bg-gray-50 border-t border-gray-200 print:hidden">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg transition-colors border border-gray-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span className="text-sm">Imprimir</span>
              </button>
              
              <Link
                href="/store"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                style={{ backgroundColor: normalizedPrimary }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-sm">Seguir Comprando</span>
              </Link>

              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
              >
                <span className="text-sm">Ir al Inicio</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos para impresión */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          .print\\:mb-4 {
            margin-bottom: 1rem !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
          .print\\:bg-blue-600 {
            background-color: #2563eb !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            margin: 1cm;
          }
        }
        
        @keyframes bounce-once {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        
        .animate-bounce-once {
          animation: bounce-once 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default function PagoExitoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 border-blue-600"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <PagoExitoContent />
    </Suspense>
  );
}
