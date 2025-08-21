import { NextRequest, NextResponse } from 'next/server';
import PaymobService from '@/lib/paymob';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

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
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`💾 Attempting to save transaction to database (attempt ${attempt}/${maxRetries})...`);
      console.log('📋 Transaction data being sent:', JSON.stringify(transactionData, null, 2));
      
      const response = await fetch('https://translatex-production-fb26.up.railway.app/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      console.log(`📡 Database API response status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Transaction saved to database successfully:', result);
        return result;
      } else {
        const errorText = await response.text();
        let errorDetails;
        try {
          errorDetails = JSON.parse(errorText);
        } catch (e) {
          errorDetails = { error: errorText };
        }

        console.error(`❌ Transaction save failed (attempt ${attempt}/${maxRetries}):`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          errorDetails: errorDetails,
          headers: Object.fromEntries(response.headers.entries()),
          transactionData: transactionData
        });

        // Handle specific validation errors that shouldn't be retried
        if (response.status === 400) {
          const errorMessage = errorDetails.error || errorText;
          
          if (errorMessage.includes('User not found')) {
            console.error(`🚫 CRITICAL: User ID ${transactionData.userId} does not exist in database`);
            console.error(`📋 Transaction cannot be saved - invalid user: ${JSON.stringify(transactionData, null, 2)}`);
            throw new Error(`User validation failed: User ID ${transactionData.userId} not found in database`);
          }
          
          if (errorMessage.includes('transactionId already exists')) {
            console.error(`🔄 Duplicate transaction detected: ${transactionData.transactionId}`);
            console.error(`📋 This transaction may have already been processed: ${JSON.stringify(transactionData, null, 2)}`);
            throw new Error(`Duplicate transaction: ${transactionData.transactionId} already exists`);
          }
          
          // Other 400 errors - don't retry
          console.error(`📋 Validation error (will not retry): ${errorMessage}`);
          throw new Error(`Validation error: ${errorMessage}`);
        }
        
        lastError = new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        
        // Only retry for server errors (5xx) or network issues
        if (response.status >= 500) {
          console.log(`🔄 Server error (${response.status}) - will retry if attempts remain`);
        } else {
          console.log(`🚫 Client error (${response.status}) - will not retry`);
          break; // Don't retry client errors
        }
        
        // If this is not the last attempt, wait before retrying
        if (attempt < maxRetries && response.status >= 500) {
          const waitTime = attempt * 1000; // 1s, 2s, 3s
          console.log(`⏳ Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }

    } catch (error) {
      console.error(`❌ Network error saving transaction (attempt ${attempt}/${maxRetries}):`, error);
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // If this is not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const waitTime = attempt * 1000; // 1s, 2s, 3s
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // All attempts failed
  console.error('❌ All attempts to save transaction failed');
  
  // Log the transaction data so it's not lost
  console.log('📝 CRITICAL: Transaction data that failed to save after all retries:', JSON.stringify(transactionData, null, 2));
  
  // Only save backup for server errors, not validation errors
  const isValidationError = lastError?.message.includes('User validation failed') || 
                           lastError?.message.includes('Duplicate transaction') ||
                           lastError?.message.includes('Validation error');

  if (!isValidationError) {
    // Save transaction data locally as backup for server/network errors
    try {
      await saveTransactionBackup(transactionData);
      console.log('💾 Transaction data saved to local backup file (server error)');
    } catch (backupError) {
      console.error('❌ Failed to save transaction backup:', backupError);
    }
  } else {
    console.log('⚠️ Validation error - backup not saved (fix user/transaction data)');
  }
  
  throw lastError || new Error('Failed to save transaction after all retries');
}

// Helper function to save transaction data locally when external database fails
async function saveTransactionBackup(transactionData: TransactionData) {
  try {
    const backupDir = join(process.cwd(), 'backups', 'transactions');
    await mkdir(backupDir, { recursive: true });
    
    const filename = `transaction_${transactionData.transactionId}_${Date.now()}.json`;
    const filepath = join(backupDir, filename);
    
    const backupData = {
      ...transactionData,
      backup_timestamp: new Date().toISOString(),
      backup_reason: 'external_database_failure'
    };
    
    await writeFile(filepath, JSON.stringify(backupData, null, 2));
    console.log(`💾 Transaction backup saved to: ${filepath}`);
  } catch (error) {
    console.error('❌ Failed to save transaction backup:', error);
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
    return 'success';
  } else if (callbackData.success === 'false' || callbackData.success === false) {
    return 'failed';
  } else {
    return 'pending';
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let webhookProcessingId = `webhook_${startTime}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log(`🔄 [${webhookProcessingId}] Starting webhook processing at ${new Date().toISOString()}`);
    
    const body = await request.json();
    const url = new URL(request.url);
    const receivedHmac = url.searchParams.get('hmac');

    console.log(`📨 [${webhookProcessingId}] Paymob webhook received:`, {
      body: JSON.stringify(body, null, 2),
      hmac: receivedHmac,
      timestamp: new Date().toISOString()
    });

    // Verify HMAC signature if provided (optional for testing)
    if (receivedHmac) {
      const paymobService = new PaymobService();
      const isValid = paymobService.verifyCallback(body.obj, receivedHmac);
      
      if (!isValid) {
        console.error(`❌ [${webhookProcessingId}] Invalid HMAC signature - continuing anyway for testing`);
        // In production, you might want to return an error here
        // return NextResponse.json(
        //   { success: false, error: 'Invalid signature' },
        //   { status: 400 }
        // );
      } else {
        console.log(`✅ [${webhookProcessingId}] HMAC signature verified successfully`);
      }
    } else {
      console.log(`⚠️ [${webhookProcessingId}] No HMAC signature provided`);
    }

    const callbackData: PaymobCallbackData = body.obj;
    
    // Log transaction details with webhook ID
    console.log(`📋 [${webhookProcessingId}] Transaction callback details:`, {
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
      console.log(`🔍 [${webhookProcessingId}] Extracting userId from merchant_order_id:`, {
        merchantOrderId,
        extractedUserId: userId
      });
    }

    if (!userId) {
      console.error(`❌ [${webhookProcessingId}] Could not extract userId from merchant_order_id:`, merchantOrderId);
      console.log(`📝 [${webhookProcessingId}] Transaction data that cannot be saved (missing userId):`, {
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
      
      console.log(`💡 [${webhookProcessingId}] Make sure merchant_order_id follows format: user-{userId}-{timestamp}`);
      
      // Continue processing but don't save to database
      return NextResponse.json({ success: true, processing_id: webhookProcessingId });
    }

    console.log(`✅ [${webhookProcessingId}] Successfully extracted userId from merchant_order_id:`, userId);

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

    console.log(`🎯 [${webhookProcessingId}] Transaction data to save:`, transactionData);

    // Process payment result and save transaction
    if (callbackData.success === 'true' || callbackData.success === true) {
      console.log(`✅ [${webhookProcessingId}] Payment successful for order ${callbackData.order?.id}`);
      
      // Save successful transaction to database
      let databaseSaveSuccess = false;
      try {
        await saveTransactionToDatabase(transactionData);
        console.log(`✅ [${webhookProcessingId}] Successfully saved successful transaction to database`);
        databaseSaveSuccess = true;
      } catch (error) {
        console.error(`❌ [${webhookProcessingId}] Failed to save successful transaction to database:`, error);
        // Continue processing even if database save fails
      }
      
      // Add credits to user after successful payment
      let creditsAddSuccess = false;
      try {
        await addCreditsToUser(userId, callbackData.amount_cents);
        console.log(`✅ [${webhookProcessingId}] Successfully added credits to user after payment`);
        creditsAddSuccess = true;
      } catch (error) {
        console.error(`❌ [${webhookProcessingId}] Failed to add credits to user after payment:`, error);
        // Log error but don't fail the webhook - transaction was still successful
      }

      console.log(`📊 [${webhookProcessingId}] Success transaction summary:`, {
        databaseSaved: databaseSaveSuccess,
        creditsAdded: creditsAddSuccess,
        transactionId: callbackData.id,
        userId: userId,
        amountCents: callbackData.amount_cents
      });
      
    } else if (callbackData.success === 'false' || callbackData.success === false) {
      console.log(`❌ [${webhookProcessingId}] Payment failed for order ${callbackData.order?.id}`);
      
      // Save failed transaction to database
      let databaseSaveSuccess = false;
      try {
        await saveTransactionToDatabase(transactionData);
        console.log(`✅ [${webhookProcessingId}] Successfully saved failed transaction to database`);
        databaseSaveSuccess = true;
      } catch (error) {
        console.error(`❌ [${webhookProcessingId}] Failed to save failed transaction to database:`, error);
        // Continue processing even if database save fails
      }

      console.log(`📊 [${webhookProcessingId}] Failed transaction summary:`, {
        databaseSaved: databaseSaveSuccess,
        transactionId: callbackData.id,
        userId: userId,
        amountCents: callbackData.amount_cents,
        error: callbackData.error_occured
      });
      
    } else {
      console.log(`⏳ [${webhookProcessingId}] Payment pending for order ${callbackData.order?.id}`);
      
      // Save pending transaction to database
      let databaseSaveSuccess = false;
      try {
        await saveTransactionToDatabase(transactionData);
        console.log(`✅ [${webhookProcessingId}] Successfully saved pending transaction to database`);
        databaseSaveSuccess = true;
      } catch (error) {
        console.error(`❌ [${webhookProcessingId}] Failed to save pending transaction to database:`, error);
        // Continue processing even if database save fails
      }

      console.log(`📊 [${webhookProcessingId}] Pending transaction summary:`, {
        databaseSaved: databaseSaveSuccess,
        transactionId: callbackData.id,
        userId: userId,
        amountCents: callbackData.amount_cents
      });
    }

    const processingTime = Date.now() - startTime;
    console.log(`✨ [${webhookProcessingId}] Webhook processing completed in ${processingTime}ms`);

    // Always return success to acknowledge receipt
    return NextResponse.json({ success: true, processing_id: webhookProcessingId, processing_time_ms: processingTime });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`💥 [${webhookProcessingId}] Webhook processing error after ${processingTime}ms:`, error);
    
    // Still return success to prevent retries for malformed requests
    return NextResponse.json({ success: true, processing_id: webhookProcessingId, error: 'processing_error' });
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