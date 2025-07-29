/**
 * Test script for project status API integration
 * Run with: node scripts/test-project-status.js
 */

const API_ENDPOINT = 'https://valid-app-production.up.railway.app/api/programs/3';

async function testProjectStatusAPI() {
  console.log('🔍 Testing Project Status API Integration\n');
  console.log(`Endpoint: ${API_ENDPOINT}\n`);

  try {
    console.log('⏳ Making request to external API...');
    
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`📡 Response Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 Response Data:', JSON.stringify(data, null, 2));

    // Validate response structure
    if (data.status === 'success' && data.data) {
      const project = data.data;
      console.log('\n✅ API Response Validation:');
      console.log(`   ✓ Status: ${data.status}`);
      console.log(`   ✓ Project ID: ${project.id}`);
      console.log(`   ✓ Project Name: ${project.program_name}`);
      console.log(`   ✓ Is Active: ${project.is_active}`);

      if (project.is_active) {
        console.log('\n🟢 PROJECT IS ACTIVE - Application access allowed');
      } else {
        console.log('\n🔴 PROJECT IS INACTIVE - Application access would be blocked');
      }
    } else {
      console.log('\n❌ Invalid response structure');
      console.log('Expected: { status: "success", data: { id, program_name, is_active } }');
    }

  } catch (error) {
    console.log('\n❌ Test Failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.log('   This might be a network connectivity issue.');
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Test completed. Check the results above.');
}

// Test the local API endpoints too
async function testLocalEndpoints() {
  console.log('\n🏠 Testing Local API Endpoints\n');
  
  const localEndpoints = [
    'http://localhost:3000/api/project-status?projectId=3',
    'http://localhost:3000/api/project-status'
  ];

  for (const endpoint of localEndpoints) {
    try {
      console.log(`⏳ Testing: ${endpoint}`);
      
      const method = endpoint.includes('?') ? 'GET' : 'POST';
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (method === 'POST') {
        options.body = JSON.stringify({ projectId: 3 });
      }

      const response = await fetch(endpoint, options);
      const data = await response.json();
      
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
      
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
      if (error.message.includes('ECONNREFUSED')) {
        console.log('   (Local server not running - this is expected if testing externally)');
      }
    }
    console.log('');
  }
}

// Run the tests
async function runAllTests() {
  await testProjectStatusAPI();
  
  // Only test local endpoints if we're likely running locally
  if (process.env.NODE_ENV !== 'production') {
    await testLocalEndpoints();
  }
}

runAllTests().catch(console.error); 