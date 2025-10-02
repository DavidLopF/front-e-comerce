import { NextRequest, NextResponse } from 'next/server';
import { MercadoLibreService } from '@/shared/services/MercadoLibreService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    console.log('Webhook recibido de MercadoLibre:', { type, data });

    if (type === 'payment' && data?.id) {
      const mercadoLibreService = new MercadoLibreService();
      const paymentStatus = await mercadoLibreService.getPaymentStatus(data.id);

      console.log('Estado del pago:', paymentStatus);

      // Aquí puedes agregar lógica adicional según el estado del pago
      switch (paymentStatus.status) {
        case 'approved':
          console.log('Pago aprobado:', paymentStatus.id);
          // Lógica para pago aprobado (enviar email, actualizar inventario, etc.)
          break;
        
        case 'rejected':
          console.log('Pago rechazado:', paymentStatus.id);
          // Lógica para pago rechazado
          break;
        
        case 'pending':
          console.log('Pago pendiente:', paymentStatus.id);
          // Lógica para pago pendiente
          break;
        
        case 'cancelled':
          console.log('Pago cancelado:', paymentStatus.id);
          // Lógica para pago cancelado
          break;
        
        default:
          console.log('Estado de pago no manejado:', paymentStatus.status);
      }

      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error al procesar webhook de MercadoLibre:', error);
    
    return NextResponse.json(
      { error: 'Error al procesar webhook' },
      { status: 500 }
    );
  }
}

// También manejar GET requests (por si MercadoLibre hace verificaciones)
export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'ok', message: 'Webhook endpoint is working' });
}
