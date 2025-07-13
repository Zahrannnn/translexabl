import PaymobService from '@/lib/paymob';
import { NextRequest, NextResponse } from 'next/server';

interface InitiatePaymentRequest {
  amount_cents: number;
  currency?: string;
  merchant_order_id?: string;
  billing_data: {
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
  };
  items?: Array<{
    name: string;
    amount_cents: number;
    description: string;
    quantity: number;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: InitiatePaymentRequest = await request.json();

    // Validate required fields
    if (!body.amount_cents || body.amount_cents <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (!body.billing_data || !body.billing_data.email || !body.billing_data.first_name) {
      return NextResponse.json(
        { success: false, error: 'Billing data is required' },
        { status: 400 }
      );
    }

    // Initialize Paymob service
    const paymobService = new PaymobService();

    // Initiate payment
    const result = await paymobService.initiatePayment(
      body.amount_cents,
      body.billing_data,
      body.currency || 'EGP',
      body.merchant_order_id,
      body.items || []
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        order_id: result.orderId,
        payment_token: result.paymentToken,
        iframe_url: result.iframeUrl,
      },
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Use POST method to initiate payment' },
    { status: 405 }
  );
} 