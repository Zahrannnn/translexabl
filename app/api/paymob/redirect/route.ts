import { NextRequest, NextResponse } from 'next/server';

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
    console.log('💾 Attempting to save transaction to database from redirect...');
    
    const response = await fetch('https://translatex-production-fb26.up.railway.app/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Transaction saved to database successfully from redirect:', result);
      return result;
    } else {
      const errorText = await response.text();
      console.error('❌ Transaction save failed from redirect:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

  } catch (error) {
    console.error('❌ Failed to save transaction to database from redirect:', error);
    
    // Log the transaction data so it's not lost
    console.log('📝 Transaction data that failed to save from redirect:', JSON.stringify(transactionData, null, 2));
    
    throw error;
  }
}

// Helper function to add credits to user after successful payment
async function addCreditsToUser(userId: number, amountCents: number) {
  try {
    // Convert cents to credits based on pricing structure
    // Pricing: 3.5 EGP per credit = 350 cents per credit
    const creditAmount = Math.floor(amountCents / 350);
    
    console.log(`💰 Attempting to add ${creditAmount} credits to user ${userId} from redirect (paid ${amountCents} cents = ${amountCents/100} EGP)...`);
    
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
      console.log(`✅ Successfully added ${creditAmount} credits to user ${userId} from redirect:`, result);
      return result;
    } else {
      const errorText = await response.text();
      console.error('❌ Failed to add credits from redirect:', {
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
    console.error('❌ Failed to add credits to user from redirect:', error);
    
    // Log the credit data so it's not lost
    console.log('📝 Credit addition that failed from redirect:', {
      userId,
      amountCents,
      creditAmount: Math.floor(amountCents / 350)
    });
    
    throw error;
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
      console.log('Processing Paymob redirect (separate endpoint):', {
        transactionId,
        success,
        errorOccurred,
        amountCents,
        currency,
        merchantOrderId,
        orderId,
      });

      // Extract userId from merchant_order_id
      let userId: number | null = null;
      if (merchantOrderId) {
        userId = extractUserIdFromMerchantOrderId(merchantOrderId);
        console.log('🔍 Extracting userId from redirect merchant_order_id:', {
          merchantOrderId,
          extractedUserId: userId
        });
      }

      // Save transaction data from redirect (since webhook POST is not being called)
      if (userId && transactionId && amountCents) {
        const transactionData: TransactionData = {
          userId: userId,
          transactionId: transactionId,
          orderId: orderId || '',
          merchantOrderId: merchantOrderId || '',
          amountCents: parseInt(amountCents) || 0,
          currency: currency || 'EGP',
          status: (success === 'true' && errorOccurred === 'false') ? 'SUCCESS' : 'FAILED',
          paymentMethod: 'card', // Default since redirect doesn't include this
          cardType: 'unknown', // Default non-empty value required by API
          cardLastFour: '0000', // Default non-empty value required by API
        };

        console.log('💾 Saving transaction from redirect data (backup since webhook not called):', transactionData);
        
        try {
          await saveTransactionToDatabase(transactionData);
          console.log('✅ Transaction saved from redirect data');
          
          // Add credits if successful payment
          if (success === 'true' && errorOccurred === 'false') {
            try {
              await addCreditsToUser(userId, parseInt(amountCents) || 0);
              console.log('✅ Credits added from redirect processing');
            } catch (creditError) {
              console.error('❌ Failed to add credits from redirect:', creditError);
            }
          }
        } catch (error) {
          console.error('❌ Failed to save transaction from redirect:', error);
        }
      } else {
        console.warn('⚠️ Cannot save transaction from redirect - missing required data:', {
          userId,
          transactionId,
          amountCents
        });
      }

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

    // If no transaction parameters, return error
    return NextResponse.json(
      { message: 'Redirect endpoint - missing transaction parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('GET redirect processing error:', error);
    
    // Redirect to failure page if something goes wrong
    const failureUrl = new URL('/payment/failure', request.url);
    failureUrl.searchParams.set('error', 'processing_error');
    return NextResponse.redirect(failureUrl);
  }
} 