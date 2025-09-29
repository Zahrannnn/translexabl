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

// Helper function to save transaction to external database (no authentication required)
async function saveTransactionToDatabase(transactionData: TransactionData) {
  try {
    console.log('💾 Attempting to save transaction to database...');
    
    const response = await fetch('https://translatex-production-fb26.up.railway.app/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Transaction saved to database successfully:', result);
      return result;
    } else {
      const errorText = await response.text();
      console.error('❌ Transaction save failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

  } catch (error) {
    console.error('❌ Failed to save transaction to database:', error);
    
    // Log the transaction data so it's not lost
    console.log('📝 Transaction data that failed to save:', JSON.stringify(transactionData, null, 2));
    
    throw error;
  }
}

// Helper function to add credits to user after successful payment
async function addCreditsToUser(userId: number, amountCents: number) {
  try {
    // Convert cents to credits based on pricing structure
    // Pricing: 3.5 EGP per credit = 350 cents per credit
    // Examples: 
    // - 175000 cents (1750 EGP) = 500 credits (Starter Pack)
    // - 700000 cents (7000 EGP) = 2000 credits (Popular Pack)
    // - 1750000 cents (17500 EGP) = 5000 credits (Premium Pack)
    const creditAmount = Math.floor(amountCents / 350);
    
    console.log(`💰 Attempting to add ${creditAmount} credits to user ${userId} (paid ${amountCents} cents = ${amountCents/100} EGP)...`);
    
    const response = await fetch('https://translatex-production-fb26.up.railway.app/api/credits/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        amount: creditAmount
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Successfully added ${creditAmount} credits to user ${userId}:`, result);
      return result;
    } else {
      const errorText = await response.text();
      console.error('❌ Failed to add credits:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        userId,
        creditAmount,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

  } catch (error) {
    console.error('❌ Failed to add credits to user:', error);
    
    // Log the credit data so it's not lost
    console.log('📝 Credit addition that failed:', {
      userId,
      amountCents,
      creditAmount: Math.floor(amountCents / 350)
    });
    
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
    return 'SUCCESS';
  } else if (callbackData.success === 'false' || callbackData.success === false) {
    return 'FAILED';
  } else {
    // For pending transactions, we'll treat them as failed for now since the external API
    // doesn't support a PENDING status. We can save them when they become success/failed later.
    console.log('⚠️ Transaction is pending - treating as FAILED for database compatibility');
    return 'FAILED';
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for HMAC verification
    const rawBody = await request.text();
    let body;
    
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('❌ Invalid JSON in webhook body:', parseError);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const receivedHmac = url.searchParams.get('hmac');
    
    // Log webhook receipt (without sensitive data in production)
    console.log('📨 Paymob webhook received:', {
      timestamp: new Date().toISOString(),
      hasHmac: !!receivedHmac,
      transactionId: body.obj?.id,
      orderId: body.obj?.order?.id,
      merchantOrderId: body.obj?.order?.merchant_order_id,
      status: body.obj?.success,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    });

    // Enhanced HMAC verification (recommended for production)
    if (receivedHmac) {
      const paymobService = new PaymobService();
      const isValid = paymobService.verifyCallback(body.obj, receivedHmac);
      
      if (!isValid) {
        console.error('❌ Invalid HMAC signature - webhook rejected');
        console.error('🔒 Security Alert: Potential fraudulent webhook attempt from IP:', 
          request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'));
        
        // In production, reject invalid signatures
        return NextResponse.json(
          { success: false, error: 'Invalid HMAC signature' },
          { status: 401 }
        );
      } else {
        console.log('✅ HMAC signature verified successfully');
      }
    } else {
      console.warn('⚠️ No HMAC signature provided - consider enabling HMAC for security');
      // In production, you might want to require HMAC
      // return NextResponse.json(
      //   { success: false, error: 'HMAC signature required' },
      //   { status: 401 }
      // );
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

    // Prepare transaction processing
    const transactionId = callbackData.id?.toString() || `paymob_${Date.now()}`;
    
    console.log('🔍 Processing transaction:', {
      transactionId,
      orderId: callbackData.order?.id,
      merchantOrderId: callbackData.order?.merchant_order_id,
      status: getTransactionStatus(callbackData),
      amount: callbackData.amount_cents
    });

    // Prepare transaction data for the external API
    const transactionData: TransactionData = {
      userId: userId,
      transactionId: transactionId,
      orderId: callbackData.order?.id?.toString() || '',
      merchantOrderId: callbackData.order?.merchant_order_id || '',
      amountCents: callbackData.amount_cents,
      currency: callbackData.currency || 'EGP',
      status: getTransactionStatus(callbackData),
      paymentMethod: callbackData.source_data?.type || 'card',
      cardType: callbackData.source_data?.sub_type || 'unknown',
      cardLastFour: getCardLastFour(callbackData.source_data?.pan) || '0000',
    };

    console.log('🎯 Transaction data to save:', transactionData);

    // Process payment result and save transaction
    if (callbackData.success === 'true' || callbackData.success === true) {
      console.log(`✅ Payment successful for order ${callbackData.order?.id}`);
      
      // Save successful transaction to database
      try {
        await saveTransactionToDatabase(transactionData);
        console.log('✅ Successfully saved successful transaction to database');
      } catch (error) {
        console.error('❌ Failed to save successful transaction to database:', error);
        // Continue processing even if database save fails
      }
      
      // Add credits to user after successful payment
      try {
        await addCreditsToUser(userId, callbackData.amount_cents);
        console.log('✅ Successfully added credits to user after payment');
      } catch (error) {
        console.error('❌ Failed to add credits to user after payment:', error);
        // Log error but don't fail the webhook - transaction was still successful
      }
      
    } else if (callbackData.success === 'false' || callbackData.success === false) {
      console.log(`❌ Payment failed for order ${callbackData.order?.id}`);
      
      // Save failed transaction to database
      try {
        await saveTransactionToDatabase(transactionData);
        console.log('✅ Successfully saved failed transaction to database');
      } catch (error) {
        console.error('❌ Failed to save failed transaction to database:', error);
        // Continue processing even if database save fails
      }
      
    } else {
      console.log(`⏳ Payment pending for order ${callbackData.order?.id}`);
      
      // Save pending transaction to database
      try {
        await saveTransactionToDatabase(transactionData);
        console.log('✅ Successfully saved pending transaction to database');
      } catch (error) {
        console.error('❌ Failed to save pending transaction to database:', error);
        // Continue processing even if database save fails
      }
    }

    // Always return 200 OK to acknowledge receipt (Paymob best practice)
    console.log('✅ Webhook processed successfully - returning 200 OK');
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      timestamp: new Date().toISOString()
    }, { status: 200 });
    
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    
    // Log error details for debugging
    console.error('🔍 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    // Return 200 OK to prevent Paymob retries for processing errors
    // Only return non-200 for authentication/validation failures
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook acknowledged - processing error logged',
      timestamp: new Date().toISOString()
    }, { status: 200 });
  }
}

export async function GET() {
  // This endpoint is for POST webhooks only
  // For redirects, use /api/paymob/redirect
  return NextResponse.json(
    { 
      message: 'This endpoint is for POST webhooks only. For redirects, use /api/paymob/redirect',
      webhookUrl: 'https://www.translexable.io/api/paymob/webhook',
      redirectUrl: 'https://www.translexable.io/api/paymob/redirect'
    },
    { status: 405 }
  );
} 