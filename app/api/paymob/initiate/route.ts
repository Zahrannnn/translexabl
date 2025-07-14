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

    console.log('Payment initiation request received:', {
      amount_cents: body.amount_cents,
      billing_data: body.billing_data,
      merchant_order_id: body.merchant_order_id
    });

    // Validate required fields
    if (!body.amount_cents || body.amount_cents <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      );
    }

    console.log('Billing data validation:', {
      has_billing_data: !!body.billing_data,
      email: body.billing_data?.email,
      first_name: body.billing_data?.first_name,
      last_name: body.billing_data?.last_name,
      email_empty: !body.billing_data?.email,
      first_name_empty: !body.billing_data?.first_name,
      last_name_empty: !body.billing_data?.last_name
    });

    if (!body.billing_data || !body.billing_data.email || !body.billing_data.first_name || !body.billing_data.last_name) {
      return NextResponse.json(
        { success: false, error: 'Billing data is incomplete. Email, first name, and last name are required.' },
        { status: 400 }
      );
    }

    // Ensure required billing fields have values
    const billingData = {
      ...body.billing_data,
      phone_number: body.billing_data.phone_number || '+201234567890',
      country: body.billing_data.country || 'Egypt',
      city: body.billing_data.city || 'Cairo',
      state: body.billing_data.state || 'Cairo',
      street: body.billing_data.street || '123 Main Street',
      building: body.billing_data.building || '1',
      floor: body.billing_data.floor || '1',
      apartment: body.billing_data.apartment || '1',
      postal_code: body.billing_data.postal_code || '12345'
    };

    console.log('Payment initiation request:', {
      amount_cents: body.amount_cents,
      currency: body.currency || 'EGP',
      merchant_order_id: body.merchant_order_id,
      billing_data: billingData,
      items: body.items || []
    });

    // Initialize Paymob service
    const paymobService = new PaymobService();

    // Initiate payment
    const result = await paymobService.initiatePayment(
      body.amount_cents,
      billingData,
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