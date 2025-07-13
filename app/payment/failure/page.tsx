"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, CreditCard, RefreshCw, Home, AlertTriangle } from "lucide-react"

function PaymentFailureContent() {
  const [errorDetails, setErrorDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()

  const orderId = searchParams.get('order_id')
  const transactionId = searchParams.get('transaction_id')
  const amount = searchParams.get('amount')
  const currency = searchParams.get('currency')
  const errorMessage = searchParams.get('error')

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
        setErrorDetails(data)
      }
    } catch (error) {
      console.error('Failed to fetch transaction details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    // Navigate back to payment or try again
    router.push('/test-payment')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const handleContactSupport = () => {
    window.open('mailto:support@translexabl.com?subject=Payment Failed&body=Order ID: ' + orderId, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p>Loading payment details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-pink-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">Payment Failed</CardTitle>
          <CardDescription className="text-red-600">
            We couldn't process your payment
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Error Summary */}
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h3 className="font-semibold text-red-800 mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Error Details
            </h3>
            <div className="space-y-2 text-sm">
              {orderId && (
                <div className="flex justify-between">
                  <span className="text-red-700">Order ID:</span>
                  <span className="font-mono text-red-800">{orderId}</span>
                </div>
              )}
              {transactionId && (
                <div className="flex justify-between">
                  <span className="text-red-700">Transaction ID:</span>
                  <span className="font-mono text-red-800">{transactionId}</span>
                </div>
              )}
              {amount && (
                <div className="flex justify-between">
                  <span className="text-red-700">Amount:</span>
                  <span className="font-semibold text-red-800">
                    {(parseInt(amount) / 100).toFixed(2)} {currency || 'EGP'}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-red-700">Status:</span>
                <span className="font-semibold text-red-800">Failed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700">Date:</span>
                <span className="text-red-800">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">Error Message:</h3>
              <p className="text-sm text-yellow-700">{errorMessage}</p>
            </div>
          )}

          {/* Transaction Details */}
          {errorDetails && (
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Transaction Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Payment Method:</span>
                  <span className="text-gray-800">{errorDetails.source_data?.type || 'Card'}</span>
                </div>
                {errorDetails.source_data?.pan && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Card:</span>
                    <span className="text-gray-800">**** {errorDetails.source_data.pan}</span>
                  </div>
                )}
                {errorDetails.error_occured && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Error:</span>
                    <span className="text-red-600">{errorDetails.error_occured}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Common Issues */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3">Common Issues:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Insufficient funds in your account</li>
              <li>• Incorrect card details</li>
              <li>• Card expired or blocked</li>
              <li>• Network connection issues</li>
              <li>• Bank declined the transaction</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleGoHome}
                variant="outline" 
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
              
              <Button 
                onClick={handleContactSupport}
                variant="outline" 
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Contact Support
              </Button>
            </div>
          </div>

          {/* Support Info */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500">
              Need immediate help? Contact our support team at{" "}
              <a href="mailto:support@translexabl.com" className="text-red-600 hover:underline">
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
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">Payment Failed</CardTitle>
          <CardDescription className="text-red-600">
            Loading payment details...
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentFailureContent />
    </Suspense>
  )
} 