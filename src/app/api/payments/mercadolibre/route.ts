import { NextRequest, NextResponse } from 'next/server';
import { MercadoLibreService } from '@/shared/services/MercadoLibreService';
import { MercadoLibreBackendService } from '@/shared/services/MercadoLibreBackendService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, externalReference, customerInfo } = body;
    
    console.log('🔍 DEBUG - API Payment Request:', {
      userEmail,
      externalReference,
      customerInfo,
      cartItemsCount: body.cartItems?.length || 0,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL
    });

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email del usuario es requerido' },
        { status: 400 }
      );
    }

    // Obtener los items del carrito desde el store
    // Nota: En un entorno real, esto debería venir del request o de una sesión
    const cartItems = body.cartItems || [];

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'El carrito está vacío' },
        { status: 400 }
      );
    }

    const mercadoLibreService = new MercadoLibreService();
    
    // Crear la preferencia de pago con información del cliente
    const paymentResponse = await mercadoLibreService.createPaymentPreference(
      cartItems,
      userEmail,
      externalReference,
      customerInfo
    );

    // Obtener la URL de inicialización
    const initPointUrl = mercadoLibreService.getInitPointUrl(paymentResponse);
    
    console.log('🔍 DEBUG - Payment Response:', {
      paymentId: paymentResponse.id,
      initPointUrl,
      sandbox: mercadoLibreService['isSandbox'],
      initPoint: paymentResponse.init_point,
      sandboxInitPoint: paymentResponse.sandbox_init_point
    });

    return NextResponse.json({
      success: true,
      paymentId: paymentResponse.id,
      initPointUrl,
      sandbox: mercadoLibreService['isSandbox']
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

    const mercadoLibreBackendService = new MercadoLibreBackendService();
    const paymentStatus = await mercadoLibreBackendService.getPaymentStatus(paymentId);

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
