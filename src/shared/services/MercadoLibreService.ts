import { MercadoLibrePaymentRequest, MercadoLibrePaymentResponse, MercadoLibrePaymentStatus } from '../types/MercadoLibre';
import { CartItem } from '../types/Cart';

export class MercadoLibreService {
  private readonly accessToken: string;
  private readonly baseUrl: string;
  private readonly isSandbox: boolean;

  constructor() {
    // Estas variables deben configurarse en las variables de entorno
    this.accessToken = process.env.MERCADOLIBRE_ACCESS_TOKEN || '';
    this.isSandbox = process.env.NODE_ENV === 'development' || 
                     process.env.MERCADOLIBRE_SANDBOX === 'true' ||
                     process.env.MERCADOLIBRE_SANDBOX === '1';
    this.baseUrl = 'https://api.mercadopago.com';
  }

  /**
   * Crea una preferencia de pago en MercadoLibre
   */
  async createPaymentPreference(cartItems: CartItem[], userEmail: string, externalReference?: string, customerInfo?: { name: string; phone: string; address: string }): Promise<MercadoLibrePaymentResponse> {
    const items = cartItems.map(item => ({
      id: item.product.id,
      title: item.product.name,
      description: item.product.description || '',
      picture_url: item.product.imageUrl || undefined,
      quantity: item.quantity,
      currency_id: 'COP' as const,
      unit_price: Math.round(this.calculateFinalPrice(item.product.priceCents, item.product.discount))
    }));

    // Obtener la URL base, con fallback a localhost para desarrollo
    // Nota: Para pruebas locales, MercadoLibre no puede acceder a localhost
    // Usa ngrok o una URL pública para pruebas
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Para desarrollo local, usar URLs simples
    const isLocalhost = baseUrl.includes('localhost');
    
    const paymentRequest: MercadoLibrePaymentRequest = {
      items,
      payer: {
        email: userEmail,
        name: customerInfo?.name,
        phone: customerInfo?.phone ? {
          number: customerInfo.phone
        } : undefined,
        address: customerInfo?.address ? {
          street_name: customerInfo.address,
          street_number: 1,
          zip_code: "00000"
        } : undefined
      },
      ...(isLocalhost ? {} : {
        back_urls: {
          success: `${baseUrl}/pago/exito`,
          failure: `${baseUrl}/pago/error`,
          pending: `${baseUrl}/pago/pendiente`
        },
        notification_url: `${baseUrl}/api/webhooks/mercadolibre`
      }),
      external_reference: externalReference
    };

    try {
      // Validar que tenemos el token de acceso
      if (!this.accessToken) {
        throw new Error('Access Token de MercadoLibre no configurado. Verifica la variable MERCADOLIBRE_ACCESS_TOKEN');
      }

      console.log('Creando preferencia con URLs:', {
        success: `${baseUrl}/pago/exito`,
        failure: `${baseUrl}/pago/error`,
        pending: `${baseUrl}/pago/pendiente`,
        webhook: `${baseUrl}/api/webhooks/mercadolibre`
      });


      const response = await fetch(`${this.baseUrl}/checkout/preferences`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRequest)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al crear preferencia de pago: ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene el estado de un pago
   */
  async getPaymentStatus(paymentId: string): Promise<MercadoLibrePaymentStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al obtener estado del pago: ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Valida una notificación webhook de MercadoLibre
   */
  async validateWebhookNotification(topic: string, id: string): Promise<MercadoLibrePaymentStatus | null> {
    if (topic === 'payment') {
      return await this.getPaymentStatus(id);
    }
    return null;
  }

  /**
   * Calcula el precio final considerando descuentos
   */
  private calculateFinalPrice(priceCents: number, discount?: number): number {
    if (discount && discount > 0) {
      return priceCents * (100 - discount) / 100;
    }
    return priceCents;
  }

  /**
   * Obtiene la URL de inicialización según el entorno
   */
  getInitPointUrl(response: MercadoLibrePaymentResponse): string {
    return this.isSandbox ? response.sandbox_init_point : response.init_point;
  }
}
