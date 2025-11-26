import { NextResponse } from 'next/server';
import { MercadoLibreBackendService } from '@/shared/services/MercadoLibreBackendService';

export async function POST(request: Request) {
  try {
    // Verificar la clave secreta si está configurada
    const webhookSecret = process.env.MERCADOLIBRE_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get('x-signature');
      if (!signature) {
      
        return NextResponse.json({ error: 'Sin firma' }, { status: 401 });
      }
      // Nota: Aquí deberías implementar la validación real de la firma
      // Por ahora solo verificamos que existe
    }

    const body = await request.json();
    const { type, data } = body;


    if (type === 'payment' && data?.id) {
      const mercadoLibreBackendService = new MercadoLibreBackendService();
      const paymentStatus = await mercadoLibreBackendService.getPaymentStatus(data.id);


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
export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Webhook endpoint is working' });
}
