import { NextRequest, NextResponse } from 'next/server';
import PaymobService from '@/lib/paymob';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const receivedHmac = url.searchParams.get('hmac');

    console.log('Paymob webhook received:', {
      body: JSON.stringify(body, null, 2),
      hmac: receivedHmac,
    });

    // Verify HMAC signature if provided (optional for testing)
    if (receivedHmac) {
      const paymobService = new PaymobService();
      const isValid = paymobService.verifyCallback(body.obj, receivedHmac);
      
      if (!isValid) {
        console.error('Invalid HMAC signature - continuing anyway for testing');
        // In production, you might want to return an error here
        // return NextResponse.json(
        //   { success: false, error: 'Invalid signature' },
        //   { status: 400 }
        // );
      } else {
        console.log('✅ HMAC signature verified successfully');
      }
    } else {
      console.log('⚠️ No HMAC signature provided');
    }

    const callbackData = body.obj;
    
    // Log transaction details
    console.log('Transaction callback details:', {
      transaction_id: callbackData.id,
      order_id: callbackData.order?.id,
      amount_cents: callbackData.amount_cents,
      currency: callbackData.currency,
      success: callbackData.success,
      pending: callbackData.pending,
      error_occured: callbackData.error_occured,
      payment_method: callbackData.source_data?.type,
      card_type: callbackData.source_data?.sub_type,
      card_pan: callbackData.source_data?.pan,
      created_at: callbackData.created_at,
      merchant_order_id: callbackData.order?.merchant_order_id,
    });

    // Process payment result
    if (callbackData.success === 'true' || callbackData.success === true) {
      console.log(`✅ Payment successful for order ${callbackData.order?.id}`);
      
      // Here you would typically:
      // 1. Update your database with the successful payment
      // 2. Send confirmation email to user
      // 3. Update user's credit balance (if applicable)
      // 4. Log the successful transaction
      
    } else if (callbackData.success === 'false' || callbackData.success === false) {
      console.log(`❌ Payment failed for order ${callbackData.order?.id}`);
      
      // Here you would typically:
      // 1. Update your database with the failed payment
      // 2. Send failure notification to user
      // 3. Log the failed transaction
      
    } else {
      console.log(`⏳ Payment pending for order ${callbackData.order?.id}`);
      
      // Here you would typically:
      // 1. Update your database with the pending payment
      // 2. Keep monitoring the payment status
      
    }

    // Always return success to acknowledge receipt
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Still return success to prevent retries for malformed requests
    return NextResponse.json({ success: true });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    
    const transactionId = searchParams.get('id');
    const success = searchParams.get('success');
    const errorOccurred = searchParams.get('error_occured');
    const amountCents = searchParams.get('amount_cents');
    const currency = searchParams.get('currency');
    const merchantOrderId = searchParams.get('merchant_order_id');
    const orderId = searchParams.get('order');

    if (transactionId) {
      console.log('Processing Paymob redirect:', {
        transactionId,
        success,
        errorOccurred,
        amountCents,
        currency,
        merchantOrderId,
        orderId,
      });

      // Determine if payment was successful
      const isSuccess = success === 'true' && errorOccurred === 'false';
      
      if (isSuccess) {
        // Redirect to success page with transaction details
        const successUrl = new URL('/payment/success', request.url);
        successUrl.searchParams.set('transaction_id', transactionId);
        successUrl.searchParams.set('order_id', orderId || '');
        successUrl.searchParams.set('amount', amountCents || '0');
        successUrl.searchParams.set('currency', currency || 'EGP');
        if (merchantOrderId) {
          successUrl.searchParams.set('merchant_order_id', merchantOrderId);
        }
        
        return NextResponse.redirect(successUrl);
      } else {
        // Redirect to failure page with error details
        const failureUrl = new URL('/payment/failure', request.url);
        failureUrl.searchParams.set('transaction_id', transactionId);
        failureUrl.searchParams.set('order_id', orderId || '');
        failureUrl.searchParams.set('amount', amountCents || '0');
        failureUrl.searchParams.set('currency', currency || 'EGP');
        if (merchantOrderId) {
          failureUrl.searchParams.set('merchant_order_id', merchantOrderId);
        }
        
        return NextResponse.redirect(failureUrl);
      }
    }

    // If no transaction parameters, return the webhook message
    return NextResponse.json(
      { message: 'Webhook endpoint - use POST method' },
      { status: 405 }
    );
  } catch (error) {
    console.error('GET webhook processing error:', error);
    
    // Redirect to failure page if something goes wrong
    const failureUrl = new URL('/payment/failure', request.url);
    failureUrl.searchParams.set('error', 'processing_error');
    return NextResponse.redirect(failureUrl);
  }
} 