import { NextRequest, NextResponse } from 'next/server';

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