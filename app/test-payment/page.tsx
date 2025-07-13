'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BillingData {
  email: string
  first_name: string
  last_name: string
  phone_number: string
  country: string
  city: string
  state: string
  street: string
  building?: string
  floor?: string
  apartment?: string
  postal_code?: string
}

export default function TestPaymentPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [config, setConfig] = useState<any>(null)
  const [showIframe, setShowIframe] = useState(false)
  const [iframeUrl, setIframeUrl] = useState('')

  // Test billing data
  const [billingData, setBillingData] = useState<BillingData>({
    email: 'test@example.com',
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '+201234567890',
    country: 'Egypt',
    city: 'Cairo',
    state: 'Cairo',
    street: '123 Test Street',
    building: '1',
    floor: '2',
    apartment: '3',
    postal_code: '12345'
  })

  const [amount, setAmount] = useState('10000') // 100 EGP in cents

  // Check Paymob configuration
  const checkConfig = async () => {
    try {
      const response = await fetch('/api/paymob/config')
      const data = await response.json()
      setConfig(data)
    } catch (err) {
      setError('Failed to check configuration')
    }
  }

  // Test payment initiation
  const testPayment = async () => {
    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/paymob/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount_cents: parseInt(amount),
          currency: 'EGP',
          merchant_order_id: `test-${Date.now()}`,
          billing_data: billingData,
          items: [
            {
              name: 'Translation Credits',
              amount_cents: parseInt(amount),
              description: 'Translation service credits',
              quantity: 1
            }
          ]
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setResult(data)
        setIframeUrl(data.data.iframe_url)
      } else {
        setError(data.error || 'Payment initiation failed')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Test transaction retrieval
  const testTransaction = async (transactionId: string) => {
    try {
      const response = await fetch(`/api/paymob/transaction/${transactionId}`)
      const data = await response.json()
      console.log('Transaction details:', data)
      alert('Check console for transaction details')
    } catch (err) {
      alert('Failed to fetch transaction')
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🧪 Paymob Payment Test</h1>
      
      {/* Configuration Check */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Configuration Check</CardTitle>
          <CardDescription>Verify your Paymob environment variables</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={checkConfig} className="mb-4">
            Check Configuration
          </Button>
          
          {config && (
            <div className="space-y-2">
              <div className={`p-3 rounded ${config.configured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Status: {config.configured ? '✅ Configured' : '❌ Not Configured'}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>API Key: {config.config.api_key}</div>
                <div>Integration ID: {config.config.integration_id}</div>
                <div>Iframe ID: {config.config.iframe_id}</div>
                <div>HMAC Key: {config.config.hmac_key}</div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Local Webhook: {config.webhook_url}</div>
                <div>ngrok Webhook: <span className="text-blue-600 font-mono">{config.ngrok_webhook_url}</span></div>
                <div className="text-xs text-green-600">✅ Configured in Paymob Dashboard</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing Data Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. Test Payment Data</CardTitle>
          <CardDescription>Configure test payment details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount (cents)</Label>
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10000"
              />
              <p className="text-sm text-gray-500">
                {parseInt(amount) / 100} EGP
              </p>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={billingData.email}
                onChange={(e) => setBillingData({...billingData, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={billingData.first_name}
                onChange={(e) => setBillingData({...billingData, first_name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={billingData.last_name}
                onChange={(e) => setBillingData({...billingData, last_name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={billingData.phone_number}
                onChange={(e) => setBillingData({...billingData, phone_number: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={billingData.country}
                onChange={(e) => setBillingData({...billingData, country: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Test */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>3. Test Payment Initiation</CardTitle>
          <CardDescription>Create a payment order and get iframe URL</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testPayment} 
            disabled={isLoading}
            className="mb-4"
          >
            {isLoading ? 'Processing...' : 'Initiate Payment'}
          </Button>

          {error && (
            <Alert className="mb-4">
              <AlertDescription className="text-red-600">
                ❌ {error}
              </AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription className="text-green-600">
                  ✅ Payment initiated successfully!
                </AlertDescription>
              </Alert>
              
              <div className="bg-gray-100 p-4 rounded space-y-2">
                <div><strong>Order ID:</strong> {result.data.order_id}</div>
                <div><strong>Payment Token:</strong> {result.data.payment_token?.slice(0, 20)}...</div>
                <div><strong>Iframe URL:</strong> 
                  <a href={result.data.iframe_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                    Open Payment Page
                  </a>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowIframe(!showIframe)}
                  variant="outline"
                >
                  {showIframe ? 'Hide' : 'Show'} Payment Iframe
                </Button>
                <Button 
                  onClick={() => testTransaction(result.data.order_id)}
                  variant="outline"
                >
                  Check Transaction
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Iframe */}
      {showIframe && iframeUrl && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. Payment Iframe</CardTitle>
            <CardDescription>Test the actual payment flow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <iframe
                src={iframeUrl}
                width="100%"
                height="600"
                frameBorder="0"
                title="Payment Iframe"
              />
            </div>
            <div className="mt-4 p-4 bg-yellow-50 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This is a test payment iframe. You can use test card numbers provided by Paymob for testing.
                Since webhooks won't work locally, you'll need to manually check the transaction status.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">✅ What you can test locally:</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Environment configuration check</li>
              <li>Payment order creation</li>
              <li>Payment token generation</li>
              <li>Iframe URL generation</li>
              <li>Payment UI/UX flow</li>
              <li>Transaction status retrieval</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">❌ What requires ngrok:</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Webhook callbacks from Paymob</li>
              <li>Automatic payment status updates</li>
              <li>Real-time credit balance updates</li>
              <li>Complete end-to-end payment flow</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">🌐 Testing with ngrok:</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Start ngrok: <code className="bg-gray-100 px-1 rounded">.\ngrok.exe http 3000</code></li>
              <li>Your webhook URL is already configured in Paymob</li>
              <li>Complete payments will trigger webhook callbacks</li>
              <li>Check browser console and terminal for webhook logs</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">🧪 Test Cards (Paymob Sandbox):</h4>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <div><strong>Success:</strong> 4987654321098769</div>
              <div><strong>Failure:</strong> 4000000000000002</div>
              <div><strong>CVV:</strong> 123</div>
              <div><strong>Expiry:</strong> Any future date</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 