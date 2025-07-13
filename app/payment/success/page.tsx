/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, CreditCard, Receipt, Home } from "lucide-react"

function PaymentSuccessContent() {
  const [transactionDetails, setTransactionDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()

  const orderId = searchParams.get('order_id')
  const transactionId = searchParams.get('transaction_id')
  const amount = searchParams.get('amount')
  const currency = searchParams.get('currency')

  useEffect(() => {
    // Fetch transaction details if transaction ID is provided
    if (transactionId) {
      fetchTransactionDetails(transactionId)
    } else {
      setLoading(false)
    }
  }, [transactionId])

  const fetchTransactionDetails = async (txId: string) => {
    try {
      const response = await fetch(`/api/paymob/transaction/${txId}`)
      if (response.ok) {
        const data = await response.json()
        setTransactionDetails(data)
      }
    } catch (error) {
      console.error('Failed to fetch transaction details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    router.push('/')
  }

  const handleViewReceipt = () => {
    // Navigate to receipt page or download receipt
    if (transactionId) {
      router.push(`/receipt/${transactionId}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p>Loading payment details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">Payment Successful!</CardTitle>
          <CardDescription className="text-green-600">
            Your payment has been processed successfully
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment Summary
            </h3>
            <div className="space-y-2 text-sm">
              {orderId && (
                <div className="flex justify-between">
                  <span className="text-green-700">Order ID:</span>
                  <span className="font-mono text-green-800">{orderId}</span>
                </div>
              )}
              {transactionId && (
                <div className="flex justify-between">
                  <span className="text-green-700">Transaction ID:</span>
                  <span className="font-mono text-green-800">{transactionId}</span>
                </div>
              )}
              {amount && (
                <div className="flex justify-between">
                  <span className="text-green-700">Amount:</span>
                  <span className="font-semibold text-green-800">
                    {(parseInt(amount) / 100).toFixed(2)} {currency || 'EGP'}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-green-700">Status:</span>
                <span className="font-semibold text-green-800">Completed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Date:</span>
                <span className="text-green-800">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          {transactionDetails && (
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Receipt className="w-4 h-4 mr-2" />
                Transaction Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Payment Method:</span>
                  <span className="text-gray-800">{transactionDetails.source_data?.type || 'Card'}</span>
                </div>
                {transactionDetails.source_data?.pan && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Card:</span>
                    <span className="text-gray-800">**** {transactionDetails.source_data.pan}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Message */}
          <div className="text-center py-4">
            <p className="text-gray-600 mb-2">
              Thank you for your payment! Your transaction has been processed successfully.
            </p>
            <p className="text-sm text-gray-500">
              You will receive a confirmation email shortly.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleContinue}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Continue to Dashboard
            </Button>
            
            {transactionId && (
              <Button 
                onClick={handleViewReceipt}
                variant="outline" 
                className="w-full border-green-600 text-green-600 hover:bg-green-50"
              >
                <Receipt className="w-4 h-4 mr-2" />
                View Receipt
              </Button>
            )}
          </div>

          {/* Support Info */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team at{" "}
              <a href="mailto:support@translexabl.com" className="text-green-600 hover:underline">
                support@translexabl.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">Payment Successful!</CardTitle>
          <CardDescription className="text-green-600">
            Loading payment details...
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  )
} 