// Tipos para la integración con MercadoLibre

export interface MercadoLibrePaymentRequest {
  items: MercadoLibreItem[];
  payer: MercadoLibrePayer;
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: 'approved' | 'all';
  notification_url?: string;
  external_reference?: string;
}

export interface MercadoLibreItem {
  id: string;
  title: string;
  description?: string;
  picture_url?: string;
  category_id?: string;
  quantity: number;
  currency_id: 'COP';
  unit_price: number;
}

export interface MercadoLibrePayer {
  name?: string;
  surname?: string;
  email: string;
  phone?: {
    area_code?: string;
    number: string;
  };
  identification?: {
    type: string;
    number: string;
  };
  address?: {
    street_name: string;
    street_number: number;
    zip_code: string;
  };
}

export interface MercadoLibrePaymentResponse {
  id: string;
  init_point: string;
  sandbox_init_point: string;
  date_created: string;
  status: string;
}

export interface MercadoLibreWebhookNotification {
  id: number;
  live_mode: boolean;
  type: string;
  date_created: string;
  application_id: number;
  user_id: number;
  version: number;
  api_version: string;
  action: string;
  data: {
    id: string;
  };
}

export interface MercadoLibrePaymentStatus {
  id: string;
  status: 'pending' | 'approved' | 'authorized' | 'in_process' | 'in_mediation' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back';
  status_detail: string;
  currency_id: string;
  description: string;
  external_reference?: string;
  date_approved?: string;
  date_created: string;
  date_last_updated: string;
  money_release_date?: string;
  collector_id: number;
  payer: {
    id: string;
    email: string;
    identification: {
      type: string;
      number: string;
    };
    phone: {
      area_code: string;
      number: string;
    };
    first_name: string;
    last_name: string;
  };
  metadata: Record<string, unknown>;
  order: {
    id: number;
    type: string;
  };
  transaction_amount: number;
  transaction_amount_refunded: number;
  coupon_amount: number;
  differential_pricing_id?: string;
  deduction_schema?: string;
  transaction_details: {
    payment_method_reference_id?: string;
    net_received_amount: number;
    total_paid_amount: number;
    overpaid_amount: number;
    external_resource_url?: string;
    installment_amount: number;
    financial_institution?: string;
    payable_deferral_period?: string;
    acquirer_reference?: string;
  };
  fee_details: Array<{
    type: string;
    amount: number;
    fee_payer: string;
  }>;
  captured: boolean;
  binary_mode: boolean;
  call_for_authorize_id?: string;
  statement_descriptor?: string;
  card?: {
    id: string;
    last_four_digits: string;
    first_six_digits: string;
    expiration_month: number;
    expiration_year: number;
    security_code: {
      length: number;
      card_location: string;
    };
    cardholder: {
      name: string;
      identification: {
        type: string;
        number: string;
      };
    };
  };
  notification_url?: string;
  refunds: unknown[];
  additional_info?: string;
  payment_method_id: string;
  issuer_id?: string;
  processing_mode?: string;
  merchant_account_id?: string;
  merchant_number?: string;
  acquirer?: string;
  acquirer_reconciliation?: unknown[];
  point_of_interaction?: {
    type: string;
    application_data?: {
      name: string;
      version: string;
    };
    transaction_data?: {
      qr_code?: string;
      qr_code_base64?: string;
      ticket_url?: string;
    };
  };
}
