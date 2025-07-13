import { NextRequest, NextResponse } from 'next/server';
import PaymobService from '@/lib/paymob';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: transactionId } = await params;

    if (!transactionId) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const paymobService = new PaymobService();
    const transaction = await paymobService.getTransaction(transactionId);

    return NextResponse.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('Transaction retrieval error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
} 