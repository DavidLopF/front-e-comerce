"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useStoreConfigContext } from '@/shared/providers/StoreConfigProvider';

function PagoErrorContent() {
  const { config } = useStoreConfigContext();
  const searchParams = useSearchParams();

  const paymentId = searchParams.get('payment_id');
  // const externalReference = searchParams.get('external_reference'); // No se usa actualmente

  // Colores dinámicos del tema
  const primaryColor = config?.theme?.colors?.primary || '#3b82f6';
  const normalizedPrimary = primaryColor.startsWith('#') ? primaryColor : `#${primaryColor}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Icono de error */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Error en el Pago
        </h1>

        <p className="text-gray-600 mb-6">
          Hubo un problema al procesar tu pago. Por favor, intenta nuevamente o contacta con nuestro equipo de soporte.
        </p>

        {paymentId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">ID de Transacción:</p>
            <p className="font-mono text-sm text-gray-900 break-all">{paymentId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/carrito"
            className="block w-full text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: normalizedPrimary }}
          >
            Intentar Nuevamente
          </Link>
          
          <Link
            href="/store"
            className="block w-full text-gray-600 py-3 px-6 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PagoErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 border-blue-600"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <PagoErrorContent />
    </Suspense>
  );
}
