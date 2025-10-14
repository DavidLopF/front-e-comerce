import { CartItem } from '../types/Cart';
import { AuthService } from './AuthService';

// Interfaces para el nuevo backend
export interface BackendCreatePreferenceRequest {
  items: BackendItemRequest[];
  notification_url?: string;
  external_reference?: string;
}

export interface BackendItemRequest {
  id: string;
  title: string;
  description: string;
  quantity: number;
  unit_price: number;
  picture_url?: string;
}

export interface BackendCreatePreferenceResponse {
  success: boolean;
  data?: {
    preferenceId: string;
    initPointUrl: string;
    sandboxInitPointUrl?: string;
    externalReference?: string;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Servicio para comunicarse con el backend NestJS
 * Este servicio reemplaza la comunicación directa con MercadoLibre
 */
export class PaymentBackendService {
  private readonly backendUrl: string;

  constructor() {
    // URL del backend NestJS
    this.backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7008';
  }

  /**
   * Crea una preferencia de pago a través del backend seguro
   */
  async createPaymentPreference(
    cartItems: CartItem[], 
    userEmail: string, 
    externalReference?: string, 
    customerInfo?: { name: string; phone: string; address: string }
  ): Promise<BackendCreatePreferenceResponse> {
    try {
      // Transformar los items del carrito al formato que espera el backend
      const backendItems: BackendItemRequest[] = cartItems.map(item => ({
        id: item.product.id,
        title: item.product.name,
        description: item.product.description || '',
        quantity: item.quantity,
        unit_price: Math.round(this.calculateFinalPrice(item.product.priceCents, item.product.discount)),
        picture_url: item.product.imageUrl || undefined
      }));

      // Agregar el costo de envío como un ítem adicional
      if (cartItems.length > 0) {
        backendItems.push({
          id: 'shipping',
          title: 'Costo de Envío',
          description: 'Envío a domicilio',
          quantity: 1,
          unit_price: 3000, // $3,000 COP (misma unidad que product.priceCents)
          picture_url: undefined
        });
      }

      // Construir la URL de notificación si estamos en producción
      let notificationUrl: string | undefined;
      if (typeof window !== 'undefined') {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        if (!baseUrl.includes('localhost')) {
          notificationUrl = `${baseUrl}/webhooks/mercadolibre`;
        }
      }

      const requestBody: BackendCreatePreferenceRequest = {
        items: backendItems,
        external_reference: externalReference,
        notification_url: notificationUrl
      };

      const fullUrl = `${this.backendUrl}/payments/create-preferences`;
      const token = await AuthService.getCurrentUserToken();

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error del backend:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Error del backend: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log('✅ Respuesta cruda del backend:', result);

      // Adaptar la respuesta de MercadoLibre a nuestro formato esperado
      // El backend puede retornar directamente la respuesta de MercadoLibre
      if (result.id && (result.init_point || result.sandbox_init_point)) {
        // Es la respuesta directa de MercadoLibre
        const isSandbox = process.env.NODE_ENV === 'development';
        const initPointUrl = isSandbox && result.sandbox_init_point 
          ? result.sandbox_init_point 
          : result.init_point;

        console.log('✅ Preferencia creada exitosamente:', {
          preferenceId: result.id,
          initPointUrl,
          isSandbox
        });

        return {
          success: true,
          data: {
            preferenceId: result.id,
            initPointUrl,
            sandboxInitPointUrl: result.sandbox_init_point,
            externalReference: result.external_reference
          }
        };
      }

      // Si ya viene en el formato esperado, retornarlo tal cual
      return result;

    } catch (error) {
      console.error('Error al crear preferencia de pago:', error);
      throw error;
    }
  }

  /**
   * Obtiene el estado de un pago a través del backend
   */
  async getPaymentStatus(paymentId: string): Promise<unknown> {
    try {
      const response = await fetch(`${this.backendUrl}/payments/status/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener estado del pago: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener estado del pago:', error);
      throw error;
    }
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
   * Ahora el backend maneja esta lógica
   */
  getInitPointUrl(response: BackendCreatePreferenceResponse): string {
    // Validar que la respuesta tenga la estructura esperada
    if (!response) {
      throw new Error('Respuesta vacía del backend');
    }

    if (!response.success) {
      const errorMsg = response.error?.message || 'Error desconocido';
      throw new Error(`Error al crear preferencia: ${errorMsg}`);
    }

    if (!response.data?.initPointUrl) {
      console.error('Respuesta inválida:', response);
      throw new Error('La respuesta no contiene initPointUrl');
    }

    console.log('🎯 URL de redirección:', response.data.initPointUrl);
    return response.data.initPointUrl;
  }
}