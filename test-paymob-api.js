// Test script for Paymob API integration
// Run with: node test-paymob-api.js

const { PaymobService } = require('./lib/paymob.ts');

// Test configuration
const testConfig = {
  amount_cents: 10000, // 100 EGP
  currency: 'EGP',
  merchant_order_id: `test-${Date.now()}`,
  billing_data: {
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
  },
  items: [
    {
      name: 'Translation Credits',
      amount_cents: 10000,
      description: 'Translation service credits',
      quantity: 1
    }
  ]
};

async function testPaymobAPI() {
  console.log('🧪 Testing Paymob API Integration...\n');

  try {
    const paymobService = new PaymobService();

    // Test 1: Authentication
    console.log('1. Testing Authentication...');
    const authToken = await paymobService.authenticate();
    console.log('✅ Authentication successful');
    console.log(`   Token: ${authToken.substring(0, 20)}...\n`);

    // Test 2: Create Order
    console.log('2. Testing Order Creation...');
    const order = await paymobService.createOrder(
      authToken,
      testConfig.amount_cents,
      testConfig.currency,
      testConfig.merchant_order_id,
      testConfig.items
    );
    console.log('✅ Order created successfully');
    console.log(`   Order ID: ${order.id}`);
    console.log(`   Amount: ${order.amount_cents / 100} ${order.currency}\n`);

    // Test 3: Generate Payment Key
    console.log('3. Testing Payment Key Generation...');
    const paymentKey = await paymobService.generatePaymentKey(
      authToken,
      order.id,
      testConfig.amount_cents,
      testConfig.billing_data,
      testConfig.currency
    );
    console.log('✅ Payment key generated successfully');
    console.log(`   Payment Key: ${paymentKey.substring(0, 20)}...\n`);

    // Test 4: Generate Iframe URL
    console.log('4. Testing Iframe URL Generation...');
    const iframeUrl = paymobService.getIframeUrl(paymentKey);
    console.log('✅ Iframe URL generated successfully');
    console.log(`   Iframe URL: ${iframeUrl}\n`);

    // Test 5: Complete Payment Flow
    console.log('5. Testing Complete Payment Flow...');
    const paymentResult = await paymobService.initiatePayment(
      testConfig.amount_cents,
      testConfig.billing_data,
      testConfig.currency,
      `complete-test-${Date.now()}`,
      testConfig.items
    );

    if (paymentResult.success) {
      console.log('✅ Complete payment flow successful');
      console.log(`   Order ID: ${paymentResult.orderId}`);
      console.log(`   Payment Token: ${paymentResult.paymentToken?.substring(0, 20)}...`);
      console.log(`   Iframe URL: ${paymentResult.iframeUrl}\n`);
    } else {
      console.log('❌ Complete payment flow failed');
      console.log(`   Error: ${paymentResult.error}\n`);
    }

    // Test 6: Configuration Check
    console.log('6. Configuration Check...');
    const envVars = [
      'PAYMOB_API_KEY',
      'PAYMOB_INTEGRATION_ID',
      'PAYMOB_IFRAME_ID',
      'PAYMOB_HMAC_KEY'
    ];

    envVars.forEach(envVar => {
      const value = process.env[envVar];
      console.log(`   ${envVar}: ${value ? '✅ Set' : '❌ Not set'}`);
    });

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Visit http://localhost:3000/test-payment to test the UI');
    console.log('   2. Use the iframe URL to test actual payments');
    console.log('   3. Use ngrok for webhook testing');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Check your environment variables in .env.local');
    console.error('   2. Verify your Paymob account credentials');
    console.error('   3. Ensure you have internet connection');
    console.error('   4. Check if you\'re using the correct API endpoint (sandbox vs production)');
  }
}

// Run the test
testPaymobAPI(); 