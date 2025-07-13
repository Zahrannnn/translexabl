/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto';

interface BillingData {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  country: string;
  city: string;
  state: string;
  street: string;
  building?: string;
  floor?: string;
  apartment?: string;
  postal_code?: string;
}

interface OrderItem {
  name: string;
  amount_cents: number;
  description: string;
  quantity: number;
}

interface PaymobAuthResponse {
  token: string;
}

interface PaymobOrderResponse {
  id: number;
  created_at: string;
  delivery_needed: boolean;
  merchant: any;
  collector: any;
  amount_cents: number;
  shipping_data: any;
  currency: string;
  is_payment_locked: boolean;
  is_return: boolean;
  is_cancel: boolean;
  is_returned: boolean;
  is_canceled: boolean;
  merchant_order_id: string;
  wallet_notification: any;
  paid_amount_cents: number;
  notify_user_with_email: boolean;
  items: OrderItem[];
  order_url: string;
  commission_fees: number;
  delivery_fees_cents: number;
  delivery_vat_cents: number;
  payment_method: string;
  merchant_staff_tag: any;
  api_source: string;
  data: any;
}

interface PaymobPaymentKeyResponse {
  token: string;
}

export class PaymobService {
  private apiKey: string;
  private integrationId: string;
  private iframeId: string;
  private hmacKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.PAYMOB_API_KEY || '';
    this.integrationId = process.env.PAYMOB_INTEGRATION_ID || '';
    this.iframeId = process.env.PAYMOB_IFRAME_ID || '';
    this.hmacKey = process.env.PAYMOB_HMAC_KEY || '';
    this.baseUrl = process.env.PAYMOB_BASE_URL || 'https://accept.paymob.com/api';
  }

  /**
   * Step 1: Authentication - Get access token
   */
  async authenticate(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data: PaymobAuthResponse = await response.json();
      return data.token;
    } catch (error) {
      console.error('Paymob authentication error:', error);
      throw error;
    }
  }

  /**
   * Step 2: Order Registration - Create order
   */
  async createOrder(
    authToken: string,
    amountCents: number,
    currency: string = 'EGP',
    merchantOrderId?: string,
    items: OrderItem[] = []
  ): Promise<PaymobOrderResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/ecommerce/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_token: authToken,
          delivery_needed: false,
          amount_cents: amountCents,
          currency: currency,
          merchant_order_id: merchantOrderId,
          items: items,
        }),
      });

      if (!response.ok) {
        throw new Error(`Order creation failed: ${response.statusText}`);
      }

      const data: PaymobOrderResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Paymob order creation error:', error);
      throw error;
    }
  }

  /**
   * Step 3: Payment Key Generation - Generate payment token
   */
  async generatePaymentKey(
    authToken: string,
    orderId: number,
    amountCents: number,
    billingData: BillingData,
    currency: string = 'EGP'
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/acceptance/payment_keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_token: authToken,
          amount_cents: amountCents,
          expiration: 3600, // 1 hour
          order_id: orderId,
          billing_data: billingData,
          currency: currency,
          integration_id: parseInt(this.integrationId),
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment key generation failed: ${response.statusText}`);
      }

      const data: PaymobPaymentKeyResponse = await response.json();
      return data.token;
    } catch (error) {
      console.error('Paymob payment key generation error:', error);
      throw error;
    }
  }

  /**
   * Generate iframe URL for payment
   */
  getIframeUrl(paymentToken: string): string {
    return `https://accept.paymob.com/api/acceptance/iframes/${this.iframeId}?payment_token=${paymentToken}`;
  }

  /**
   * Complete payment flow - combines all steps
   */
  async initiatePayment(
    amountCents: number,
    billingData: BillingData,
    currency: string = 'EGP',
    merchantOrderId?: string,
    items: OrderItem[] = []
  ): Promise<{
    success: boolean;
    orderId?: number;
    paymentToken?: string;
    iframeUrl?: string;
    error?: string;
  }> {
    try {
      // Step 1: Authenticate
      const authToken = await this.authenticate();

      // Step 2: Create order
      const order = await this.createOrder(
        authToken,
        amountCents,
        currency,
        merchantOrderId,
        items
      );

      // Step 3: Generate payment key
      const paymentToken = await this.generatePaymentKey(
        authToken,
        order.id,
        amountCents,
        billingData,
        currency
      );

      // Step 4: Generate iframe URL
      const iframeUrl = this.getIframeUrl(paymentToken);

      return {
        success: true,
        orderId: order.id,
        paymentToken,
        iframeUrl,
      };
    } catch (error) {
      console.error('Payment initiation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Verify webhook callback signature
   */
  verifyCallback(callbackData: any, receivedHmac: string): boolean {
    try {
      // Paymob HMAC verification requires specific field order and naming
      const orderedData = [
        callbackData.amount_cents,
        callbackData.created_at,
        callbackData.currency,
        callbackData.error_occured,
        callbackData.has_parent_transaction,
        callbackData.id,
        callbackData.integration_id,
        callbackData.is_3d_secure,
        callbackData.is_auth,
        callbackData.is_capture,
        callbackData.is_refunded,
        callbackData.is_standalone_payment,
        callbackData.is_voided,
        callbackData.order?.id,
        callbackData.owner,
        callbackData.pending,
        callbackData.source_data?.pan || '',
        callbackData.source_data?.sub_type || '',
        callbackData.source_data?.type || '',
        callbackData.success,
      ].join('');

      const calculatedHmac = crypto
        .createHmac('sha512', this.hmacKey)
        .update(orderedData)
        .digest('hex');

      console.log('HMAC Debug:', {
        orderedData,
        calculatedHmac,
        receivedHmac,
        match: calculatedHmac === receivedHmac
      });

      return calculatedHmac === receivedHmac;
    } catch (error) {
      console.error('HMAC verification error:', error);
      return false;
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(transactionId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/acceptance/transactions/${transactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Transaction retrieval failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Transaction retrieval error:', error);
      throw error;
    }
  }

  /**
   * Refund transaction
   */
  async refundTransaction(transactionId: string, amountCents: number): Promise<any> {
    try {
      const authToken = await this.authenticate();
      
      const response = await fetch(`${this.baseUrl}/acceptance/void_refund/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_token: authToken,
          transaction_id: transactionId,
          amount_cents: amountCents,
        }),
      });

      if (!response.ok) {
        throw new Error(`Refund failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Refund error:', error);
      throw error;
    }
  }

  /**
   * Void transaction
   */
  async voidTransaction(transactionId: string): Promise<any> {
    try {
      const authToken = await this.authenticate();
      
      const response = await fetch(`${this.baseUrl}/acceptance/void_refund/void`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_token: authToken,
          transaction_id: transactionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Void failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Void error:', error);
      throw error;
    }
  }
}

export default PaymobService; 