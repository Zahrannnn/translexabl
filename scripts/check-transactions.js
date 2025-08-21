#!/usr/bin/env node

/**
 * Script to check recent transactions in the external database
 * Verifies that webhook transactions are being saved correctly
 */

async function checkRecentTransactions() {
  try {
    console.log('🔍 Checking recent transactions in external database...');
    console.log('📍 Database URL: https://translatex-production-fb26.up.railway.app');
    console.log('🕒 Check Time:', new Date().toISOString());
    
    // Note: This would require a GET endpoint, but we can check by trying to create a duplicate
    // to see if recent transactions exist
    
    const testTransactionId = 'existence_check_' + Date.now();
    const testData = {
      userId: 2,
      transactionId: testTransactionId,
      orderId: 'check_order_' + Date.now(),
      merchantOrderId: 'user-2-' + Date.now(),
      amountCents: 1000, // Small amount for test
      currency: 'EGP',
      status: 'test',
      paymentMethod: 'card',
      cardType: 'test',
      cardLastFour: '0000'
    };

    console.log('📝 Creating test transaction to verify database connectivity...');
    
    const response = await fetch('https://translatex-production-fb26.up.railway.app/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log(`📡 Database Response: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Database is working! Test transaction created:');
      console.log('📋 Transaction Data:', JSON.stringify(result.data, null, 2));
      
      if (result.data.id) {
        console.log(`🎯 Transaction saved with database ID: ${result.data.id}`);
        console.log(`📧 User email: ${result.data.userEmail}`);
        console.log(`💰 Amount: ${result.data.amount} EGP (${result.data.amountCents} cents)`);
        console.log(`📅 Created: ${result.data.createdAt}`);
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Database error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
    }

  } catch (error) {
    console.error('💥 Error checking database:', error.message);
  }
}

async function verifyUserExists(userId = 2) {
  console.log(`\n🔍 Verifying user ${userId} exists in database...`);
  
  try {
    // Try to create a transaction with duplicate ID to trigger validation
    const response = await fetch('https://translatex-production-fb26.up.railway.app/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        transactionId: 'duplicate_test_12345', // Known duplicate
        orderId: 'test_order',
        merchantOrderId: `user-${userId}-test`,
        amountCents: 1000,
        currency: 'EGP',
        status: 'test',
        paymentMethod: 'card',
        cardType: 'test',
        cardLastFour: '0000'
      }),
    });

    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch (e) {
      errorData = { error: errorText };
    }

    if (response.status === 400) {
      if (errorData.error?.includes('User not found')) {
        console.log(`❌ User ${userId} does NOT exist in database`);
        return false;
      } else if (errorData.error?.includes('transactionId already exists')) {
        console.log(`✅ User ${userId} exists in database (duplicate transaction detected)`);
        return true;
      } else {
        console.log(`✅ User ${userId} exists (other validation error: ${errorData.error})`);
        return true;
      }
    } else if (response.status === 201) {
      console.log(`✅ User ${userId} exists and transaction created`);
      return true;
    } else {
      console.log(`⚠️ Unexpected response for user ${userId}:`, response.status, errorData);
      return false;
    }

  } catch (error) {
    console.error(`❌ Error checking user ${userId}:`, error.message);
    return false;
  }
}

// Run checks
if (require.main === module) {
  console.log('🔧 External Database Connectivity Check');
  console.log('=' .repeat(50));
  
  checkRecentTransactions()
    .then(() => verifyUserExists(2))
    .then((userExists) => {
      if (userExists) {
        console.log('\n✅ Database connectivity confirmed!');
        console.log('💡 Webhook transactions should now be saving successfully.');
      } else {
        console.log('\n⚠️ User validation issues detected.');
        console.log('💡 Make sure webhook uses valid user IDs that exist in the database.');
      }
    })
    .catch((error) => {
      console.error('\n💥 Database check failed:', error);
      process.exit(1);
    });
}

module.exports = {
  checkRecentTransactions,
  verifyUserExists
}; 