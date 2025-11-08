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
          
          const orderItems: OrderItem[] = items.map((item: any) => {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: normalizedPrimary }}></div>
          <p className="text-gray-600">Verificando pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header con animación de éxito */}
        <div className="text-center mb-8 print:mb-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce-once shadow-lg">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            ¡Pago Confirmado!
          </h1>
          <p className="text-gray-700 text-lg">
            Tu pedido ha sido procesado exitosamente
          </p>
        </div>

        {/* Factura */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 print:shadow-none print:rounded-none print:border-0">
          {/* Header de la factura */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 py-6 print:bg-blue-600" style={{ backgroundColor: normalizedPrimary }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {config?.store?.name || 'Mi Tienda'}
                </h2>
                <p className="text-white text-sm opacity-90">Factura de Compra</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-white text-sm opacity-90">Fecha</p>
                <p className="text-white font-semibold">{currentDate}</p>
              </div>
            </div>
          </div>

          {/* Información de la transacción */}
          <div className="px-6 sm:px-8 py-6 bg-blue-50 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold mb-1">ID de Transacción</p>
                <p className="font-mono text-sm text-gray-900 break-all">
                  {paymentId || collectionId || 'N/A'}
                </p>
              </div>
              {externalReference && (
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Referencia</p>
                  <p className="font-mono text-sm text-gray-900 break-all">
                    {externalReference}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Estado</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  {collectionStatus === 'approved' ? 'Aprobado' : 'Completado'}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Método de Pago</p>
                <p className="text-sm text-gray-900 font-medium">MercadoPago</p>
              </div>
            </div>
          </div>

          {/* Detalles del pedido */}
          {orderData && orderData.items.length > 0 && (
            <div className="px-6 sm:px-8 py-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Detalles del Pedido</h3>
              
              {/* Tabla de productos */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase">Producto</th>
                      <th className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase">Cant.</th>
                      <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase">Precio Unit.</th>
                      <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 px-2 text-sm text-gray-900">{item.name}</td>
                        <td className="py-4 px-2 text-sm text-gray-600 text-center">{item.quantity}</td>
                        <td className="py-4 px-2 text-sm text-gray-600 text-right">
                          {formatPriceCOP(item.unitPrice)}
                        </td>
                        <td className="py-4 px-2 text-sm font-semibold text-gray-900 text-right">
                          {formatPriceCOP(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totales */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900 font-medium">{formatPriceCOP(orderData.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío:</span>
                    <span className="text-gray-900 font-medium">{formatPriceCOP(orderData.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">{formatPriceCOP(orderData.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mensaje de agradecimiento */}
          <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: normalizedPrimary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Gracias por tu compra
                </p>
                <p className="text-sm text-gray-700">
                  Recibirás un correo electrónico con la confirmación de tu pedido y los detalles de envío.
                  Si tienes alguna pregunta, no dudes en contactarnos.
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="px-6 sm:px-8 py-6 bg-white print:hidden">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimir Factura
              </button>
              
              <Link
                href="/store"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                style={{ backgroundColor: normalizedPrimary }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Continuar Comprando
              </Link>
            </div>
            
            <Link
              href="/"
              className="block text-center w-full text-gray-600 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors mt-3"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-8 text-sm text-gray-600 print:hidden bg-white rounded-lg py-4 px-6 shadow-sm">
          <p>Si tienes algún problema con tu pedido, contáctanos a través de nuestros canales de atención.</p>
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
