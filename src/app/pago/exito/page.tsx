"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useStoreConfigContext } from '@/shared/providers/StoreConfigProvider';

function PagoExitoContent() {
  const { config } = useStoreConfigContext();
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  const paymentId = searchParams.get('payment_id');
  // const externalReference = searchParams.get('external_reference'); // No se usa actualmente

  // Colores dinámicos del tema
  const primaryColor = config?.theme?.colors?.primary || '#3b82f6';
  const normalizedPrimary = primaryColor.startsWith('#') ? primaryColor : `#${primaryColor}`;

  useEffect(() => {
    // Simular carga y luego mostrar el resultado
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Icono de éxito */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          ¡Pago Exitoso!
        </h1>

        <p className="text-gray-600 mb-6">
          Tu pago ha sido procesado correctamente. Recibirás un email de confirmación con los detalles de tu pedido.
        </p>

        {paymentId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">ID de Transacción:</p>
            <p className="font-mono text-sm text-gray-900 break-all">{paymentId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/store"
            className="block w-full text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: normalizedPrimary }}
          >
            Continuar Comprando
          </Link>
          
          <Link
            href="/"
            className="block w-full text-gray-600 py-3 px-6 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Ir al Inicio
          </Link>
        </div>
      </div>
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
