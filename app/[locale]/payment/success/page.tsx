'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, CreditCard, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [paymentDetails, setPaymentDetails] = useState({
    transaction_id: '',
    order_id: '',
    amount: '',
    currency: '',
    merchant_order_id: ''
  })

  useEffect(() => {
    // Get payment details from URL parameters
    setPaymentDetails({
      transaction_id: searchParams.get('transaction_id') || '',
      order_id: searchParams.get('order_id') || '',
      amount: searchParams.get('amount') || '0',
      currency: searchParams.get('currency') || 'EGP',
      merchant_order_id: searchParams.get('merchant_order_id') || ''
    })
  }, [searchParams])

  const amountInEGP = parseFloat(paymentDetails.amount) / 100
  const creditsReceived = Math.floor(parseFloat(paymentDetails.amount) / 350) // 3.5 EGP per credit

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        <p className="text-gray-600">Your credits have been added to your account</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Details
          </CardTitle>
          <CardDescription>
            Your payment has been processed successfully
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Amount Paid</div>
                <div className="font-semibold text-lg">{amountInEGP.toLocaleString()} {paymentDetails.currency}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Credits Received</div>
                <div className="font-semibold text-lg text-blue-600">{creditsReceived.toLocaleString()} credits</div>
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
          </div>
        </CardContent>
      </Card>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-green-800 mb-2">What&apos;s Next?</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Your credits are now available in your account</li>
          <li>• Each credit gives you 700 characters of translation</li>
          <li>• You can start translating immediately</li>
          <li>• Credits never expire</li>
        </ul>
      </div>

      <div className="flex gap-4 justify-center">
        <Button asChild>
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

function PaymentSuccessLoading() {
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Loader2 className="w-16 h-16 text-gray-400 animate-spin" />
        </div>
        <h1 className="text-3xl font-bold text-gray-600 mb-2">Processing Payment...</h1>
        <p className="text-gray-500">Please wait while we confirm your payment</p>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  )
} 