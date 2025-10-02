import { MercadoLibrePaymentRequest, MercadoLibrePaymentResponse, MercadoLibrePaymentStatus } from '../types/MercadoLibre';
import { CartItem } from '../types/Cart';

export class MercadoLibreService {
  private readonly accessToken: string;
  private readonly baseUrl: string;
  private readonly isSandbox: boolean;

  constructor() {
    // Para crear preferencias necesitamos el access token (clave privada)
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

    // Obtener la URL base desde variables de entorno (sin slash final)
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://front-e-comerce-seven.vercel.app';
    baseUrl = baseUrl.replace(/\/+$/, ''); // Remover slash final si existe
    
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
          zip_code: "110111" // Código postal válido para Colombia
        } : undefined
      },
      // URLs de retorno
      back_urls: {
        success: `${baseUrl}/pago/exito`,
        failure: `${baseUrl}/pago/error`,
        pending: `${baseUrl}/pago/pendiente`
      },
      external_reference: externalReference,
      auto_return: 'approved',
      // Configuraciones específicas para Colombia
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 1
      },
      binary_mode: false
    };
    
    // Agregar notification_url para webhooks
    if (!baseUrl.includes('localhost')) {
      paymentRequest.notification_url = `${baseUrl}/api/webhooks/mercadolibre`;
    }

    try {
      // Validar que tenemos el access token
      if (!this.accessToken) {
        throw new Error('Access Token de MercadoLibre no configurado. Verifica la variable MERCADOLIBRE_ACCESS_TOKEN');
      }

      console.log('🔍 DEBUG - Creando preferencia con configuración:', {
        sandbox: this.isSandbox,
        baseUrl,
        accessToken: this.accessToken ? `${this.accessToken.substring(0, 20)}...` : 'NO_TOKEN',
        itemsCount: items.length,
        userEmail,
        paymentRequest: JSON.stringify(paymentRequest, null, 2)
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
        console.error('Error de MercadoPago:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          requestBody: JSON.stringify(paymentRequest, null, 2)
        });
        throw new Error(`Error al crear preferencia de pago: ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene el estado de un pago (requiere clave privada - usar en backend)
   */
  async getPaymentStatus(paymentId: string): Promise<MercadoLibrePaymentStatus> {
    // Este método requiere la clave privada y debe ejecutarse en el backend
    // Para el frontend, usar el endpoint de la API interna
    const response = await fetch(`/api/payments/mercadolibre/status/${paymentId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al obtener estado del pago: ${errorData.message || response.statusText}`);
    }

    return await response.json();
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
    console.log('URLs disponibles:', {
      sandbox: this.isSandbox,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point
    });
    
    // En sandbox, usar sandbox_init_point
    if (this.isSandbox && response.sandbox_init_point) {
      return response.sandbox_init_point;
    }
    
    // En producción, usar init_point
    return response.init_point;
  }
}
