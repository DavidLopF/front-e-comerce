import { NextRequest, NextResponse } from 'next/server';
import { PaymentBackendService } from '@/shared/services/PaymentBackendService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, externalReference, customerInfo } = body;
    
    console.log('🔍 DEBUG - API Payment Request (usando backend NestJS):', {
      userEmail,
      externalReference,
      customerInfo,
      cartItemsCount: body.cartItems?.length || 0,
      backendUrl: process.env.NEXT_PUBLIC_API_URL
    });

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email del usuario es requerido' },
        { status: 400 }
      );
    }

    // Obtener los items del carrito desde el store
    const cartItems = body.cartItems || [];

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'El carrito está vacío' },
        { status: 400 }
      );
    }

    const paymentBackendService = new PaymentBackendService();
    
    // Crear la preferencia de pago a través del backend seguro
    const paymentResponse = await paymentBackendService.createPaymentPreference(
      cartItems,
      userEmail,
      externalReference,
      customerInfo
    );

    // Verificar si la respuesta del backend fue exitosa
    if (!paymentResponse.success) {
      return NextResponse.json(
        { 
          error: 'Error al crear preferencia de pago',
          details: paymentResponse.error?.message || 'Error desconocido'
        },
        { status: 500 }
      );
    }

    // Obtener la URL de inicialización del backend
    const initPointUrl = paymentBackendService.getInitPointUrl(paymentResponse);
    
    console.log('🔍 DEBUG - Payment Response (desde backend):', {
      preferenceId: paymentResponse.data?.preferenceId,
      initPointUrl,
      externalReference: paymentResponse.data?.externalReference,
      success: paymentResponse.success
    });

    return NextResponse.json({
      success: true,
      paymentId: paymentResponse.data?.preferenceId,
      initPointUrl,
      sandbox: process.env.NODE_ENV === 'development' // Determinamos sandbox por el entorno
    });

  } catch (error) {
    console.error('Error al procesar pago con MercadoLibre:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID de pago es requerido' },
        { status: 400 }
      );
    }

    const paymentBackendService = new PaymentBackendService();
    const paymentStatus = await paymentBackendService.getPaymentStatus(paymentId);

    return NextResponse.json({
      success: true,
      payment: paymentStatus
    });

  } catch (error) {
    console.error('Error al obtener estado del pago:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
