'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, User, MapPin, Phone, Mail, Building, AlertCircle, CheckCircle, Sparkles, Zap } from 'lucide-react';

interface BillingData {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  country: string;
  city: string;
  state: string;
  street: string;
  building?: string;
  floor?: string;
  apartment?: string;
  postal_code?: string;
}

interface PaymentResult {
  success: boolean;
  data?: {
    order_id: number;
    payment_token: string;
    iframe_url: string;
  };
  error?: string;
}

export default function PaymobTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [configCheck, setConfigCheck] = useState<{configured: boolean; config: any} | null>(null);
  const [amount, setAmount] = useState(10000); // 100 EGP in cents
  const [billingData, setBillingData] = useState<BillingData>({
    email: 'test@example.com',
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '01234567890',
    country: 'EG',
    city: 'Cairo',
    state: 'Cairo',
    street: '123 Test Street',
    building: '1',
    floor: '2',
    apartment: '3',
    postal_code: '12345',
  });

  const handleInputChange = (field: keyof BillingData, value: string) => {
    setBillingData(prev => ({ ...prev, [field]: value }));
  };

  const initiatePayment = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/paymob/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount_cents: amount,
          currency: 'EGP',
          merchant_order_id: `TEST_${Date.now()}`,
          billing_data: billingData,
          items: [
            {
              name: 'Test Product',
              amount_cents: amount,
              description: 'Test payment for Paymob integration',
              quantity: 1,
            },
          ],
        }),
      });

      const data: PaymentResult = await response.json();
      setResult(data);

      if (data.success && data.data?.iframe_url) {
        // Open payment iframe in new window
        window.open(data.data.iframe_url, '_blank', 'width=800,height=600');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-3/4 left-1/6 w-24 h-24 bg-gradient-to-r from-primary/15 to-accent/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 modern-card rounded-full px-6 py-3 shadow-glow mb-6">
            <CreditCard className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-semibold">Payment Integration</span>
            <Zap className="h-4 w-4 text-accent animate-pulse" />
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Paymob</span> Payment Test
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Test the Paymob payment integration with real-time processing and secure transactions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Details Card */}
          <Card className="modern-card hover-lift border-0 rounded-3xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl" />
            <CardHeader className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Payment Details</CardTitle>
                  <CardDescription>Configure your payment amount</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="amount" className="block text-sm font-medium text-foreground">
                  Amount (in cents)
                </label>
                <div className="relative">
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-lg"
                    placeholder="10000"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-sm text-muted-foreground">cents</span>
                  </div>
                </div>
                <div className="modern-card p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5">
                  <p className="text-2xl font-bold gradient-text text-center">
                    {amount / 100} EGP
                  </p>
                  <p className="text-sm text-muted-foreground text-center mt-1">
                    Final amount to be charged
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Information Card */}
          <Card className="modern-card hover-lift border-0 rounded-3xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-2xl" />
            <CardHeader className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Billing Information</CardTitle>
                  <CardDescription>Enter your billing details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="first_name" className="block text-sm font-medium text-foreground">
                    First Name *
                  </label>
                  <input
                    id="first_name"
                    type="text"
                    value={billingData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last_name" className="block text-sm font-medium text-foreground">
                    Last Name *
                  </label>
                  <input
                    id="last_name"
                    type="text"
                    value={billingData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email Address *</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={billingData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phone_number" className="block text-sm font-medium text-foreground flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Phone Number *</span>
                </label>
                <input
                  id="phone_number"
                  type="tel"
                  value={billingData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                  required
                />
              </div>

              {/* Country and City */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="country" className="block text-sm font-medium text-foreground">
                    Country *
                  </label>
                  <select
                    id="country"
                    value={billingData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                    required
                  >
                    <option value="EG">Egypt</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="AE">UAE</option>
                    <option value="KW">Kuwait</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="city" className="block text-sm font-medium text-foreground">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={billingData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* State */}
              <div className="space-y-2">
                <label htmlFor="state" className="block text-sm font-medium text-foreground">
                  State *
                </label>
                <input
                  id="state"
                  type="text"
                  value={billingData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                  required
                />
              </div>

              {/* Street Address */}
              <div className="space-y-2">
                <label htmlFor="street" className="block text-sm font-medium text-foreground flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Street Address *</span>
                </label>
                <input
                  id="street"
                  type="text"
                  value={billingData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                  required
                />
              </div>

              {/* Building Details */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="building" className="block text-sm font-medium text-foreground flex items-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span>Building</span>
                  </label>
                  <input
                    id="building"
                    type="text"
                    value={billingData.building || ''}
                    onChange={(e) => handleInputChange('building', e.target.value)}
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="floor" className="block text-sm font-medium text-foreground">
                    Floor
                  </label>
                  <input
                    id="floor"
                    type="text"
                    value={billingData.floor || ''}
                    onChange={(e) => handleInputChange('floor', e.target.value)}
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="apartment" className="block text-sm font-medium text-foreground">
                    Apartment
                  </label>
                  <input
                    id="apartment"
                    type="text"
                    value={billingData.apartment || ''}
                    onChange={(e) => handleInputChange('apartment', e.target.value)}
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                  />
                </div>
              </div>

              {/* Postal Code */}
              <div className="space-y-2">
                <label htmlFor="postal_code" className="block text-sm font-medium text-foreground">
                  Postal Code
                </label>
                <input
                  id="postal_code"
                  type="text"
                  value={billingData.postal_code || ''}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Button */}
        <div className="mt-12 text-center">
          <Button
            onClick={initiatePayment}
            disabled={loading}
            size="lg"
            className="btn-primary-enhanced text-lg px-12 py-4 h-auto rounded-2xl shadow-glow hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-3" />
                Initiate Payment
              </>
            )}
          </Button>
        </div>

        {/* Result Display */}
        {result && (
          <Card className="mt-12 modern-card border-0 rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-3">
                {result.success ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-red-500" />
                )}
                <span>Payment Result</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.success ? (
                <div className="space-y-4">
                  <div className="modern-card p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <p className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Payment initiated successfully!
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p><strong className="text-foreground">Order ID:</strong> <span className="font-mono text-green-600">{result.data?.order_id}</span></p>
                        <p><strong className="text-foreground">Payment Token:</strong> <span className="font-mono text-green-600">{result.data?.payment_token?.substring(0, 20)}...</span></p>
                      </div>
                      <div className="space-y-2">
                        <p><strong className="text-foreground">Status:</strong> <span className="text-green-600">Payment window opened</span></p>
                        <p><strong className="text-foreground">Amount:</strong> <span className="text-green-600">{amount / 100} EGP</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="modern-card p-6 rounded-2xl bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20">
                  <p className="text-lg font-semibold text-red-600 mb-3 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Payment initiation failed
                  </p>
                  <p className="text-sm text-red-600 font-mono bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    {result.error}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions Card */}
        <Card className="mt-12 modern-card border-0 rounded-3xl overflow-hidden bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl" />
          <CardHeader className="relative">
            <CardTitle className="text-2xl flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span>Setup Instructions</span>
            </CardTitle>
            <CardDescription className="text-base">
              Follow these steps to test the Paymob integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Configuration Steps:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start space-x-2">
                      <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                      <span>Configure Paymob credentials in .env file</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                      <span>Fill in billing information above</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                      <span>Click &quot;Initiate Payment&quot; button</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                      <span>Payment iframe will open in new window</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold mt-0.5">5</span>
                      <span>Check console for webhook callbacks</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Test Card Numbers:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="modern-card p-3 rounded-lg bg-background/50">
                      <p className="font-mono text-primary">4987654321098769</p>
                      <p className="text-muted-foreground">CVV: 123</p>
                    </div>
                    <div className="modern-card p-3 rounded-lg bg-background/50">
                      <p className="font-mono text-primary">4111111111111111</p>
                      <p className="text-muted-foreground">CVV: 123</p>
                    </div>
                    <div className="modern-card p-3 rounded-lg bg-background/50">
                      <p className="font-mono text-primary">4242424242424242</p>
                      <p className="text-muted-foreground">CVV: 123</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-2xl border border-amber-500/20">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="font-semibold text-amber-600">Important Notes:</p>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• If all cards fail, your integration might need activation by Paymob support</li>
                      <li>• Contact Paymob support if success=false with all test cards</li>
                      <li>• Some integrations work only with specific card numbers</li>
                      <li>• Use any future expiry date (e.g., 12/25) and any name</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 