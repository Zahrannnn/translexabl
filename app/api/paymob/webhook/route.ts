import { NextRequest, NextResponse } from 'next/server';
import PaymobService from '@/lib/paymob';

interface TransactionData {
  userId: number;
  transactionId: string;
  orderId: string;
  merchantOrderId: string;
  amountCents: number;
  currency: string;
  status: string;
  paymentMethod: string;
  cardType: string;
  cardLastFour: string;
}

interface PaymobCallbackData {
  id: string | number;
  order?: {
    id: string | number;
    merchant_order_id: string;
  };
  amount_cents: number;
  currency: string;
  success: string | boolean;
  pending: boolean;
  error_occured: boolean;
  source_data?: {
    type: string;
    sub_type: string;
    pan: string;
  };
  created_at: string;
}

// Helper function to extract userId from merchant_order_id
function extractUserIdFromMerchantOrderId(merchantOrderId: string): number | null {
  // Expected format: "user-{userId}-{timestamp}" or similar
  // For now, try to extract from patterns like "user-123-1234567890"
  const userIdMatch = merchantOrderId.match(/user-(\d+)-/);
  if (userIdMatch) {
    return parseInt(userIdMatch[1], 10);
  }
  
  // Could also check for other patterns
  // Add more patterns as needed based on your merchant_order_id format
  return null;
}

// Helper function to save transaction to external database without authentication
async function saveTransactionToDatabase(transactionData: TransactionData, useWebhookAuth: boolean = false) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // If we have a webhook-specific auth method, use it
    // Otherwise, try with a webhook secret or API key
    if (useWebhookAuth) {
      // You might want to add a webhook secret to your environment variables
      const webhookSecret = process.env.WEBHOOK_SECRET || 'your-webhook-secret';
      headers['X-Webhook-Secret'] = webhookSecret;
    }

    const response = await fetch('https://translatex-production.up.railway.app/api/transactions', {
      method: 'POST',
      headers,
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Transaction saved to database:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to save transaction to database:', error);
    throw error;
  }
}

// Helper function to extract card last four digits from PAN
function getCardLastFour(pan: string | undefined): string {
  if (!pan) return '';
  return pan.slice(-4);
}

// Helper function to determine transaction status
function getTransactionStatus(callbackData: PaymobCallbackData): string {
  if (callbackData.success === 'true' || callbackData.success === true) {
    return 'success';
  } else if (callbackData.success === 'false' || callbackData.success === false) {
    return 'failed';
  } else {
    return 'pending';
  }
}

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

    const callbackData: PaymobCallbackData = body.obj;
    
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

    // Extract userId from merchant_order_id (primary method for webhooks)
    const merchantOrderId = callbackData.order?.merchant_order_id;
    let userId: number | null = null;
    
    if (merchantOrderId) {
      userId = extractUserIdFromMerchantOrderId(merchantOrderId);
      console.log('🔍 Extracting userId from merchant_order_id:', {
        merchantOrderId,
        extractedUserId: userId
      });
    }

    if (!userId) {
      console.error('❌ Could not extract userId from merchant_order_id:', merchantOrderId);
      console.log('📝 Transaction data that cannot be saved (missing userId):', {
        transactionId: callbackData.id,
        orderId: callbackData.order?.id,
        merchantOrderId: callbackData.order?.merchant_order_id,
        amountCents: callbackData.amount_cents,
        currency: callbackData.currency,
        status: getTransactionStatus(callbackData),
        paymentMethod: callbackData.source_data?.type || 'card',
        cardType: callbackData.source_data?.sub_type || '',
        cardLastFour: getCardLastFour(callbackData.source_data?.pan),
      });
      
      console.log('💡 Make sure merchant_order_id follows format: user-{userId}-{timestamp}');
      
      // Continue processing but don't save to database
      return NextResponse.json({ success: true });
    }

    console.log('✅ Successfully extracted userId from merchant_order_id:', userId);

    // Prepare transaction data for the external API
    const transactionData: TransactionData = {
      userId: userId,
      transactionId: callbackData.id?.toString(),
      orderId: callbackData.order?.id?.toString() || '',
      merchantOrderId: callbackData.order?.merchant_order_id || '',
      amountCents: callbackData.amount_cents,
      currency: callbackData.currency || 'EGP',
      status: getTransactionStatus(callbackData),
      paymentMethod: callbackData.source_data?.type || 'card',
      cardType: callbackData.source_data?.sub_type || '',
      cardLastFour: getCardLastFour(callbackData.source_data?.pan),
    };

    console.log('🎯 Transaction data to save:', transactionData);

    // Process payment result and save transaction
    if (callbackData.success === 'true' || callbackData.success === true) {
      console.log(`✅ Payment successful for order ${callbackData.order?.id}`);
      
      // Save successful transaction to database
      try {
        await saveTransactionToDatabase(transactionData, true);
        console.log('✅ Successfully saved successful transaction to database');
      } catch (error) {
        console.error('❌ Failed to save successful transaction to database:', error);
        // Continue processing even if database save fails
      }
      
    } else if (callbackData.success === 'false' || callbackData.success === false) {
      console.log(`❌ Payment failed for order ${callbackData.order?.id}`);
      
      // Save failed transaction to database
      try {
        await saveTransactionToDatabase(transactionData, true);
        console.log('✅ Successfully saved failed transaction to database');
      } catch (error) {
        console.error('❌ Failed to save failed transaction to database:', error);
        // Continue processing even if database save fails
      }
      
    } else {
      console.log(`⏳ Payment pending for order ${callbackData.order?.id}`);
      
      // Save pending transaction to database
      try {
        await saveTransactionToDatabase(transactionData, true);
        console.log('✅ Successfully saved pending transaction to database');
      } catch (error) {
        console.error('❌ Failed to save pending transaction to database:', error);
        // Continue processing even if database save fails
      }
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