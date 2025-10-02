import { MercadoLibrePaymentStatus } from '../types/MercadoLibre';

/**
 * Servicio backend para MercadoLibre que usa la clave privada (access token)
 * Este servicio debe ejecutarse solo en el backend
 */
export class MercadoLibreBackendService {
  private readonly accessToken: string;
  private readonly baseUrl: string;

  constructor() {
    // Usar la clave privada (access token) para operaciones backend
    this.accessToken = process.env.MERCADOLIBRE_ACCESS_TOKEN || '';
    this.baseUrl = 'https://api.mercadopago.com';
  }

  /**
   * Obtiene el estado de un pago usando la clave privada
   */
  async getPaymentStatus(paymentId: string): Promise<MercadoLibrePaymentStatus> {
    try {
      // Validar que tenemos el access token
      if (!this.accessToken) {
        throw new Error('Access Token de MercadoLibre no configurado. Verifica la variable MERCADOLIBRE_ACCESS_TOKEN');
      }

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
}
