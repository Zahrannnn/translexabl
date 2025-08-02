'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Check, CreditCard, Zap, Crown, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

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

// Add user profile interface for credits
interface UserProfile {
  id: number
  email: string
  username: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: string
  currentCredits: number
  reservedCredits: number
  availableCredits: number
  totalCreditsUsed: number
  totalCreditsPurchased: number
  accountAge: number
  emailVerified: boolean
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
     
    ]
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    credits: 1500,
    price: 5250, // 1500 * 3.5 EGP
    priceInCents: 525000, // 5250 * 100
    description: 'Most popular choice',
    popular: true,
    icon: <CreditCard className="w-6 h-6" />,
    features: [
      '1,500 translation credits',
      '1,050,000 characters total',
      'All language pairs',
      'Priority support',
      'Glossary management',
      'Accent - tone translation',
      'Human-reviewed AI output'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    credits: 3000,
    price: 10500, // 3000 * 3.5 EGP
    priceInCents: 1050000, // 10500 * 100
    description: 'Best value for heavy users',
    icon: <Crown className="w-6 h-6" />,
    features: [
      '3,000 translation credits',
      '2,100,000 characters total',
      'All language pairs',
      'Priority support',
      'Glossary management',
      'Accent - tone translation',
      '100% human translation',
      'Human-reviewed AI output',
      'Ancient languages support'
    ]
  }
]

export default function PricingPage() {
  const t = useTranslations('pricing')
  
  const [user, setUser] = useState<UserInfo | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [customCredits, setCustomCredits] = useState<number>(1000)
  const [customPackageLoading, setCustomPackageLoading] = useState(false)

  // Default billing data - will be populated with user data
  const [billingData, setBillingData] = useState<BillingData>({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '+201234567890',
    country: 'Egypt',
    city: 'Cairo',
    state: 'Cairo',
    street: '123 Main Street',
    building: '1',
    floor: '1',
    apartment: '1',
    postal_code: '12345'
  })

  // Get user info from cookie and fetch full profile
  useEffect(() => {
    const getUserFromCookie = () => {
      const cookies = document.cookie.split(';')
      const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='))
      
      if (userCookie) {
        try {
          const userValue = userCookie.split('=')[1]
          const userData = JSON.parse(decodeURIComponent(userValue))
          setUser(userData)
          
          // Fetch full profile data for complete billing information
          fetchUserProfile()
        } catch (error) {
          console.error('Error parsing user cookie:', error)
          setUser(null)
        }
      }
    }

    getUserFromCookie()
  }, [])

  // Fetch full user profile for complete billing data
  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Failed to fetch user profile:', response.statusText)
        // Fallback to user data from cookie if profile fetch fails
        if (user) {
          setBillingData(prev => ({
            ...prev,
            email: user.email,
            first_name: user.username?.split(' ')[0] || 'User',
            last_name: user.username?.split(' ')[1] || 'Name'
          }))
        }
        return
      }

      const profileData = await response.json()
      setProfile(profileData)
      
      // Log user credit information
      console.log('User profile loaded:', {
        credits: profileData.currentCredits,
        email: profileData.email,
        name: `${profileData.firstName} ${profileData.lastName}`
      })
      
      // Update billing data with complete user information
      setBillingData(prev => ({
        ...prev,
        email: profileData.email || user?.email || '',
        first_name: profileData.firstName || user?.username?.split(' ')[0] || 'User',
        last_name: profileData.lastName || user?.username?.split(' ')[1] || 'Name',
        phone_number: profileData.phoneNumber || '+201234567890'
      }))
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Fallback to user data from cookie if profile fetch fails
      if (user) {
        setBillingData(prev => ({
          ...prev,
          email: user.email,
          first_name: user.username?.split(' ')[0] || 'User',
          last_name: user.username?.split(' ')[1] || 'Name'
        }))
      }
    }
  }

  const initiatePayment = async (creditPackage: CreditPackage) => {
    if (!user) {
      setError(t('errors.loginRequired'))
      return
    }

    // Check if billing data is properly populated
    if (!billingData.email || !billingData.first_name || !billingData.last_name) {
      setError(t('errors.loadingProfile'))
      // Try to fetch profile again
      await fetchUserProfile()
      return
    }

    setSelectedPackage(creditPackage)
    setIsLoading(true)
    setError('')

    try {
      // Create merchant_order_id with userId for webhook extraction
      const merchantOrderId = `user-${user.userId}-${Date.now()}`
      
      console.log('Initiating payment with billing data:', {
        billingData,
        user,
        profile
      });
      
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
        // Open payment iframe in new tab instead of showing inline
        window.open(data.data.iframe_url, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes')
        toast.success(t('payment.success'))
      } else {
        setError(data.error || t('payment.failed'))
      }
    } catch (error) {
      console.error('Payment initiation error:', error)
      setError(t('errors.network'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section - Matching home page style */}
    

      {/* User Status Alert */}
      {!user && (
        <section className="py-8 bg-gradient-to-r from-orange-500/10 to-yellow-500/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Alert className="modern-card border-orange-200">
              <AlertDescription className="text-orange-600 text-center">
                ⚠️ {t('alerts.loginRequired')}
              </AlertDescription>
            </Alert>
          </div>
        </section>
      )}

      {/* Pricing Section - Matching home page style */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {creditPackages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`modern-card hover-lift relative rounded-3xl border-0 ${
                  pkg.popular 
                    ? 'scale-105 shadow-glow-lg ring-2 ring-primary/20' 
                    : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      {t('packages.mostPopular')}
                    </div>
                  </div>
                )}
                
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${pkg.id === 'starter' ? 'from-gray-500 to-gray-600' : pkg.id === 'popular' ? 'from-primary to-accent' : 'from-purple-600 to-pink-600'} opacity-10 rounded-full blur-2xl`} />
                
                <CardHeader className="text-center relative z-10 pb-8">
                  <div className="flex justify-center mb-4 text-primary">
                    {pkg.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{t(`packages.${pkg.id}.name`)}</CardTitle>
                  <CardDescription className="text-base">{t(`packages.${pkg.id}.description`)}</CardDescription>
                  <div className="mt-6">
                    <span className="text-5xl font-bold gradient-text">{pkg.price.toLocaleString()}</span>
                    <span className="text-muted-foreground text-lg"> EGP</span>
                  </div>
                  <div className={`inline-flex items-center bg-gradient-to-r ${pkg.id === 'starter' ? 'from-gray-500 to-gray-600' : pkg.id === 'popular' ? 'from-primary to-accent' : 'from-purple-600 to-pink-600'} text-white rounded-full px-4 py-2 mt-4 text-sm font-medium`}>
                    {pkg.credits.toLocaleString()} {t('credits')}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    = {(pkg.credits * 700).toLocaleString()} {t('characters')}
                  </div>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <ul className="space-y-4">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{t(`packages.${pkg.id}.features.${featureIndex}`)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="relative z-10 pt-8">
                  <Button 
                    onClick={() => initiatePayment(pkg)}
                    disabled={isLoading || !user}
                    className={`w-full rounded-xl py-3 font-semibold transition-all duration-300 ${
                      pkg.popular 
                        ? 'btn-primary-enhanced shadow-glow' 
                        : 'border-2 border-primary/30 hover:border-primary hover:bg-primary/5 hover-lift'
                    }`}
                    variant={pkg.popular ? "default" : "outline"}
                  >
                    {isLoading && selectedPackage?.id === pkg.id ? (
                      t('payment.processing')
                    ) : (
                      t('payment.buy', { name: t(`packages.${pkg.id}.name`) })
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Custom Credit Package */}
          <div className="mt-16 max-w-md mx-auto">
            <Card className="modern-card hover-lift relative rounded-3xl border-0 border-2 border-dashed border-primary/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 opacity-10 rounded-full blur-2xl" />
              
              <CardHeader className="text-center relative z-10 pb-6">
                <div className="flex justify-center mb-4 text-orange-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <CardTitle className="text-2xl font-bold">{t('packages.custom.name')}</CardTitle>
                <CardDescription className="text-base">{t('packages.custom.description')}</CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('packages.custom.inputLabel')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customCredits}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                        const numericValue = parseInt(value) || 0;
                        if (numericValue >= 1) {
                          setCustomCredits(numericValue);
                        } else if (value === '') {
                          setCustomCredits(0); // Allow empty field temporarily
                        }
                      }}
                      onBlur={() => {
                        // Ensure minimum value of 1 when user leaves the field
                        if (customCredits <= 99) {
                          setCustomCredits(100);
                          toast.error("Minimum 100 credits", {
                            position: "top-center",
                            duration: 3000,
                            icon: <AlertCircle className="h-5 w-5 text-red-500" />,
                            className: "font-medium"
                          });
                        }
                      }}
                      className="w-full px-4 py-3 text-lg font-semibold text-center border-2 border-primary/20 rounded-xl focus:border-primary focus:outline-none bg-background"
                      placeholder="1000"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                      {t('credits')}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    = {(customCredits * 700).toLocaleString()} {t('characters')}
                  </div>
                </div>

                <div className="text-center py-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl">
                  <div className="text-sm text-muted-foreground mb-1">{t('packages.custom.totalPrice')}</div>
                  <div className="text-4xl font-bold gradient-text">
                    {(customCredits * 3.5).toLocaleString()}
                  </div>
                  <div className="text-muted-foreground text-lg">EGP</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {t('packages.custom.pricePerCredit')}
                  </div>
                </div>

                <ul className="space-y-3 text-sm">
                  <li className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{t('packages.custom.features.0')}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{t('packages.custom.features.1')}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{t('packages.custom.features.2')}</span>
                  </li>
                </ul>
              </CardContent>
              
              <CardFooter className="relative z-10 pt-6">
                <Button 
                  onClick={() => {
                    const customPackage: CreditPackage = {
                      id: 'custom',
                      name: t('packages.custom.name'),
                      credits: customCredits,
                      price: customCredits * 3.5,
                      priceInCents: customCredits * 3.5 * 100,
                      description: t('packages.custom.description'),
                      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" /></svg>,
                      features: [
                        t('packages.custom.features.0'),
                        t('packages.custom.features.1'),
                        t('packages.custom.features.2')
                      ]
                    }
                    setCustomPackageLoading(true)
                    initiatePayment(customPackage).finally(() => setCustomPackageLoading(false))
                  }}
                  disabled={customPackageLoading || !user || customCredits < 1}
                  className="w-full rounded-xl py-3 font-semibold transition-all duration-300 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl hover-lift"
                >
                  {customPackageLoading ? (
                    t('payment.processing')
                  ) : (
                    t('payment.buyCustom', { 
                      credits: customCredits.toLocaleString(),
                      price: (customCredits * 3.5).toLocaleString()
                    })
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Important Note about Character to Page Conversion */}
          <div className="mt-16 mb-8">
            <Alert className="modern-card border-blue-200 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
              <AlertDescription className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">📄</span>
                  <strong className="text-red-600 text-lg">{t('important')}</strong>
                </div>
                <p className="text-red-700 text-base">
                  {t('characterConversion.note')} <strong>350,000 {t('characters')} ≈ 120 to 140 {t('page')} PDF Or ≈ 1000 {t('page')} txt</strong>
                </p>
                {/* <p className="text-red-600 text-sm mt-1">
                  {t('characterConversion.example')}
                </p> */}
              </AlertDescription>
            </Alert>
          </div>

          {/* Premium Features Contact Note */}
          <div className="mt-8 mb-8">
            <Alert className="modern-card border-orange-200 bg-gradient-to-r from-orange-500/10 to-yellow-500/10">
              <AlertDescription className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">🌟</span>
                  <strong className="text-orange-600 text-lg">{t('premiumFeatures.title')}</strong>
                </div>
                <p className="text-orange-700 text-base">
                  {t('premiumFeatures.note')}
                </p>
                <p className="text-orange-600 text-sm mt-2 font-medium">
                  {t('premiumFeatures.contactRequired')}
                </p>
              </AlertDescription>
            </Alert>
          </div>
          
          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-6 text-lg">
              {t('customPricing.needCustom')} <span className="text-orange-600">{t('customPricing.crypto')}</span>
            </p>
            <div className="text-muted-foreground mb-6 text-lg">
              {t('customPricing.walletAddress')}{" "}
              <button
                onClick={() => {
                  navigator.clipboard.writeText("TBGzodu4f3dnX1YYm7YoYNkWc2cDSsfszY");
                  toast.success(t('customPricing.copied'));
                }}
                className="text-orange-600 hover:text-orange-700 text-2xl  cursor-pointer transition-colors"
              >
                TBGzodu4f3dnX1YY******************
              </button>
              <p className="text-muted-foreground mb-6 text-lg inline mx-2">
                {t('customPricing.clickToCopy')}
              </p>
            <p className="text-red-500 font-bold mb-6 text-lg mx-2">
            ⚠️
            USDT 
            TRC20
            </p>
            </div>
            <a href="https://wa.me/201024765229">
            <Button variant="outline" size="lg" className="modern-card border-primary/30 hover:border-primary hover:bg-primary/5 px-8 py-3 rounded-xl hover-lift">
              {t('customPricing.contactSales')}
              <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097"/>
              </svg>
            </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <section className="py-8 bg-gradient-to-r from-red-500/10 to-pink-500/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Alert className="modern-card border-red-200">
              <AlertDescription className="text-red-600 text-center">
                ❌ {error}
              </AlertDescription>
            </Alert>
          </div>
        </section>
      )}

      {/* Information Section */}
      <section className="py-32 bg-gradient-to-br from-muted/20 to-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="modern-card rounded-3xl border-0 overflow-hidden">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">{t('howItWorks.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="modern-card p-6 rounded-2xl hover-lift">
                  <h4 className="font-semibold mb-3 text-xl flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    {t('howItWorks.payment.title')}
                  </h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      {t('howItWorks.payment.secure')}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      {t('howItWorks.payment.methods')}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      {t('howItWorks.payment.automatic')}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      {t('howItWorks.payment.instant')}
                    </li>
                  </ul>
                </div>
                
                <div className="modern-card p-6 rounded-2xl hover-lift">
                  <h4 className="font-semibold mb-3 text-xl flex items-center gap-2">
                    <Zap className="w-5 h-5 text-accent" />
                    {t('howItWorks.usage.title')}
                  </h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      {t('howItWorks.usage.creditValue')}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      {t('howItWorks.usage.languages')}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      {t('howItWorks.usage.noExpiration')}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      {t('howItWorks.usage.interface')}
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-200 rounded-2xl p-6 modern-card">
                <p className="text-center">
                  <strong className="text-primary">💡 {t('tip.title')}</strong> {t('tip.description')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
} 