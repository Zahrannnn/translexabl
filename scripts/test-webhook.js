#!/usr/bin/env node

/**
 * Test script for Paymob webhook
 * Simulates webhook calls to test transaction saving
 */

const crypto = require('crypto');

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const WEBHOOK_URL = `${BASE_URL}/api/paymob/webhook`;

// Sample webhook data structures
const sampleSuccessfulTransaction = {
  "obj": {
    "id": "test_transaction_" + Date.now(),
    "order": {
      "id": "test_order_" + Date.now(),
      "merchant_order_id": "user-2-" + Date.now() // Using valid user ID 2
    },
    "amount_cents": 175000,
    "currency": "EGP",
    "success": "true",
    "pending": false,
    "error_occured": false,
    "source_data": {
      "type": "card",
      "sub_type": "visa",
      "pan": "4***********1234"
    },
    "created_at": new Date().toISOString()
  }
};

const sampleFailedTransaction = {
  "obj": {
    "id": "test_transaction_" + (Date.now() + 1),
    "order": {
      "id": "test_order_" + (Date.now() + 1),
      "merchant_order_id": "user-2-" + (Date.now() + 1) // Using valid user ID 2
    },
    "amount_cents": 525000,
    "currency": "EGP",
    "success": "false",
    "pending": false,
    "error_occured": true,
    "source_data": {
      "type": "card",
      "sub_type": "mastercard",
      "pan": "5***********5678"
    },
    "created_at": new Date().toISOString()
  }
};

const samplePendingTransaction = {
  "obj": {
    "id": "test_transaction_" + (Date.now() + 2),
    "order": {
      "id": "test_order_" + (Date.now() + 2),
      "merchant_order_id": "user-2-" + (Date.now() + 2) // Using valid user ID 2
    },
    "amount_cents": 700000,
    "currency": "EGP",
    "success": "pending",
    "pending": true,
    "error_occured": false,
    "source_data": {
      "type": "card",
      "sub_type": "visa",
      "pan": "4***********9012"
    },
    "created_at": new Date().toISOString()
  }
};

async function testWebhook(transactionData, description) {
  console.log(`\n🧪 Testing: ${description}`);
  console.log('=' .repeat(50));
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData)
    });

    const result = await response.json();
    
    console.log(`✅ Status: ${response.status} ${response.statusText}`);
    console.log(`📋 Response:`, JSON.stringify(result, null, 2));
    
    if (result.processing_id) {
      console.log(`🔍 Processing ID: ${result.processing_id}`);
    }
    
    if (result.processing_time_ms) {
      console.log(`⏱️  Processing Time: ${result.processing_time_ms}ms`);
    }

  } catch (error) {
    console.error(`❌ Error testing webhook:`, error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Paymob Webhook Tests');
  console.log(`📍 Webhook URL: ${WEBHOOK_URL}`);
  console.log(`🕒 Test Time: ${new Date().toISOString()}`);
  
  // Test successful transaction
  await testWebhook(sampleSuccessfulTransaction, 'Successful Transaction');
  
  // Wait a bit between tests
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test failed transaction
  await testWebhook(sampleFailedTransaction, 'Failed Transaction');
  
  // Wait a bit between tests
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test pending transaction
  await testWebhook(samplePendingTransaction, 'Pending Transaction');
  
  console.log('\n✨ All webhook tests completed!');
  console.log('\n💡 Check your server logs for detailed processing information');
}

// Test with invalid merchant_order_id (should fail gracefully)
async function testInvalidMerchantOrderId() {
  const invalidTransaction = {
    ...sampleSuccessfulTransaction,
    obj: {
      ...sampleSuccessfulTransaction.obj,
      order: {
        id: "test_order_999",
        merchant_order_id: "invalid-format-12345"
      }
    }
  };
  
  await testWebhook(invalidTransaction, 'Invalid Merchant Order ID Format');
}

// Run tests
if (require.main === module) {
  console.log('🔧 Environment Check:');
  console.log(`   NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL || 'Not set (using localhost:3000)'}`);
  
  runAllTests()
    .then(() => {
      console.log('\n🧪 Running additional test with invalid merchant order ID...');
      return testInvalidMerchantOrderId();
    })
    .then(() => {
      console.log('\n🎉 All tests completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = {
  testWebhook,
  runAllTests,
  sampleSuccessfulTransaction,
  sampleFailedTransaction,
  samplePendingTransaction
}; 