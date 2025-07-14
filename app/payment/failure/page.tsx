'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, CreditCard, ArrowLeft, RefreshCw, Loader2 } from 'lucide-react'
import Link from 'next/link'

function PaymentFailureContent() {
  const searchParams = useSearchParams()
  const [paymentDetails, setPaymentDetails] = useState({
    transaction_id: '',
    order_id: '',
    amount: '',
    currency: '',
    merchant_order_id: '',
    error: ''
  })

  useEffect(() => {
    // Get payment details from URL parameters
    setPaymentDetails({
      transaction_id: searchParams.get('transaction_id') || '',
      order_id: searchParams.get('order_id') || '',
      amount: searchParams.get('amount') || '0',
      currency: searchParams.get('currency') || 'EGP',
      merchant_order_id: searchParams.get('merchant_order_id') || '',
      error: searchParams.get('error') || 'Payment failed'
    })
  }, [searchParams])

  const amountInEGP = parseFloat(paymentDetails.amount) / 100

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-red-600 mb-2">Payment Failed</h1>
        <p className="text-gray-600">Your payment could not be processed</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <CreditCard className="w-5 h-5" />
            Payment Details
          </CardTitle>
          <CardDescription>
            Transaction was unsuccessful
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Attempted Amount</div>
                <div className="font-semibold text-lg">{amountInEGP.toLocaleString()} {paymentDetails.currency}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div className="font-semibold text-lg text-red-600">Failed</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              {paymentDetails.transaction_id && (
                <div>
                  <div className="text-gray-500">Transaction ID</div>
                  <div className="font-mono">{paymentDetails.transaction_id}</div>
                </div>
              )}
              {paymentDetails.order_id && (
                <div>
                  <div className="text-gray-500">Order ID</div>
                  <div className="font-mono">{paymentDetails.order_id}</div>
                </div>
              )}
            </div>

            {paymentDetails.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-sm text-red-600">
                  <strong>Error:</strong> {paymentDetails.error}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-2">Common Reasons for Payment Failure</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Insufficient funds in your account</li>
          <li>• Incorrect card details entered</li>
          <li>• Card expired or blocked</li>
          <li>• Network connection issues</li>
          <li>• Transaction declined by bank</li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">What to do next?</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Check your card details and try again</li>
          <li>• Contact your bank if the card should work</li>
          <li>• Try a different payment method</li>
          <li>• Contact our support if the problem persists</li>
        </ul>
      </div>

      <div className="flex gap-4 justify-center">
        <Button asChild>
          <Link href="/pricing">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            Go to Dashboard
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/pricing">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Link>
        </Button>
      </div>
    </div>
  )
}

function PaymentFailureLoading() {
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Loader2 className="w-16 h-16 text-gray-400 animate-spin" />
        </div>
        <h1 className="text-3xl font-bold text-gray-600 mb-2">Processing Payment...</h1>
        <p className="text-gray-500">Please wait while we check your payment status</p>
      </div>
    </div>
  )
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<PaymentFailureLoading />}>
      <PaymentFailureContent />
    </Suspense>
  )
} 