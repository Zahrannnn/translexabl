'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Check, CreditCard, Zap, Crown } from 'lucide-react'

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

interface UserInfo {
  userId: number
  username: string
  email: string
  role: string
}

interface PaymentResult {
  success: boolean
  data: {
    order_id: string
    payment_token: string
    iframe_url: string
  }
  error?: string
}

interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number // in EGP
  priceInCents: number // for Paymob
  description: string
  popular?: boolean
  icon: React.ReactNode
  features: string[]
}

const creditPackages: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 500,
    price: 1750, // 500 * 3.5 EGP
    priceInCents: 175000, // 1750 * 100
    description: 'Perfect for getting started',
    icon: <Zap className="w-6 h-6" />,
    features: [
      '500 translation credits',
      '350,000 characters total',
      'All language pairs',
      'API access'
    ]
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    credits: 2000,
    price: 7000, // 2000 * 3.5 EGP
    priceInCents: 700000, // 7000 * 100
    description: 'Most popular choice',
    popular: true,
    icon: <CreditCard className="w-6 h-6" />,
    features: [
      '2,000 translation credits',
      '1,400,000 characters total',
      'All language pairs',
      'API access',
      'Priority support'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    credits: 5000,
    price: 17500, // 5000 * 3.5 EGP
    priceInCents: 1750000, // 17500 * 100
    description: 'Best value for heavy users',
    icon: <Crown className="w-6 h-6" />,
    features: [
      '5,000 translation credits',
      '3,500,000 characters total',
      'All language pairs',
      'API access',
      'Priority support',
      'Bulk translation tools'
    ]
  }
]

export default function PricingPage() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [showIframe, setShowIframe] = useState(false)
  const [iframeUrl, setIframeUrl] = useState('')

  // Default billing data - will be populated with user data
  const [billingData, setBillingData] = useState<BillingData>({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '+20',
    country: 'Egypt',
    city: 'Cairo',
    state: 'Cairo',
    street: '',
    building: '',
    floor: '',
    apartment: '',
    postal_code: ''
  })

  // Get user info from cookie
  useEffect(() => {
    const getUserFromCookie = () => {
      const cookies = document.cookie.split(';')
      const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='))
      
      if (userCookie) {
        try {
          const userValue = userCookie.split('=')[1]
          const userData = JSON.parse(decodeURIComponent(userValue))
          setUser(userData)
          
          // Update billing data with user's actual email and basic info
          setBillingData(prev => ({
            ...prev,
            email: userData.email,
            first_name: userData.username?.split(' ')[0] || userData.username || '',
            last_name: userData.username?.split(' ')[1] || ''
          }))
        } catch (error) {
          console.error('Error parsing user cookie:', error)
          setUser(null)
        }
      }
    }

    getUserFromCookie()
  }, [])

  const initiatePayment = async (creditPackage: CreditPackage) => {
    if (!user) {
      setError('Please login to purchase credits')
      return
    }

    setSelectedPackage(creditPackage)
    setIsLoading(true)
    setError('')
    setShowIframe(false)

    try {
      // Create merchant_order_id with userId for webhook extraction
      const merchantOrderId = `user-${user.userId}-${Date.now()}`
      
      const response = await fetch('/api/paymob/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount_cents: creditPackage.priceInCents,
          currency: 'EGP',
          merchant_order_id: merchantOrderId,
          billing_data: billingData,
          items: [
            {
              name: creditPackage.name,
              amount_cents: creditPackage.priceInCents,
              description: `${creditPackage.credits} translation credits - ${creditPackage.description}`,
              quantity: 1
            }
          ]
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setIframeUrl(data.data.iframe_url)
        setShowIframe(true)
      } else {
        setError(data.error || 'Payment initiation failed')
      }
    } catch (_) {
      setError('Network error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">💳 Translation Credits</h1>
        <p className="text-xl text-gray-600 mb-2">
          Choose your credit package and start translating
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
          <p className="text-blue-800">
            <strong>💡 Note:</strong> Each credit gives you <strong>700 characters</strong> of translation
          </p>
        </div>
      </div>

      {/* User Status */}
      {!user && (
        <Alert className="mb-8">
          <AlertDescription className="text-orange-600">
            ⚠️ Please login to purchase credits and see your current balance
          </AlertDescription>
        </Alert>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {creditPackages.map((pkg) => (
          <Card 
            key={pkg.id} 
            className={`relative hover:shadow-lg transition-shadow ${
              pkg.popular ? 'border-2 border-blue-500 scale-105' : ''
            }`}
          >
            {pkg.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-2 text-blue-600">
                {pkg.icon}
              </div>
              <CardTitle className="text-2xl">{pkg.name}</CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
            </CardHeader>

            <CardContent className="text-center">
              {/* Price */}
              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {pkg.price.toLocaleString()} EGP
                </div>
                <div className="text-sm text-gray-500">
                  {(pkg.price / pkg.credits).toFixed(2)} EGP per credit
                </div>
              </div>

              {/* Credits */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {pkg.credits.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  Translation Credits
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  = {(pkg.credits * 700).toLocaleString()} characters
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-6 text-left">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Buy Button */}
              <Button
                onClick={() => initiatePayment(pkg)}
                disabled={isLoading || !user}
                className="w-full"
                size="lg"
              >
                {isLoading && selectedPackage?.id === pkg.id ? (
                  'Processing...'
                ) : (
                  `Buy ${pkg.name}`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <Alert className="mb-6">
          <AlertDescription className="text-red-600">
            ❌ {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Payment Iframe */}
      {showIframe && iframeUrl && selectedPackage && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Complete Your Purchase - {selectedPackage.name}
            </CardTitle>
            <CardDescription>
              Secure payment powered by Paymob
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Package:</strong> {selectedPackage.name}</div>
                <div><strong>Credits:</strong> {selectedPackage.credits.toLocaleString()}</div>
                <div><strong>Characters:</strong> {(selectedPackage.credits * 700).toLocaleString()}</div>
                <div><strong>Total:</strong> {selectedPackage.price.toLocaleString()} EGP</div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <iframe
                src={iframeUrl}
                width="100%"
                height="600"
                frameBorder="0"
                title="Payment Iframe"
              />
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => setShowIframe(false)}
                variant="outline"
              >
                Close Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>📋 How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">💳 Payment Process</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Secure payment via Paymob</li>
                <li>• Supports Visa, MasterCard, and local payment methods</li>
                <li>• Credits added automatically after payment</li>
                <li>• Instant activation</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">⚡ Credit Usage</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• 1 credit = 700 characters of translation</li>
                <li>• Works with all supported language pairs</li>
                <li>• Credits never expire</li>
                <li>• Use via web interface or API</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>💡 Tip:</strong> The Popular Pack offers the best value for regular users, 
              while the Premium Pack is perfect for businesses with high translation volumes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 