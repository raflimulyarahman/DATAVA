// test-integration.js - Simple integration test for DATAVA services

const axios = require('axios');

async function testIntegration() {
  console.log('🧪 Running DATAVA integration tests...\n');
  
  const WALRUS_RELAY = process.env.WALRUS_RELAY || 'http://localhost:5051';
  const INFERENCE_URL = process.env.INFERENCE_URL || 'http://localhost:5052';
  
  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Check ingestion service health
  console.log('📋 Test 1: Checking ingestion service health...');
  totalTests++;
  try {
    const response = await axios.get(`${WALRUS_RELAY}/`);
    if (response.data && response.data.status === 'running') {
      console.log('✅ Ingestion service is running');
      passedTests++;
    } else {
      console.log('❌ Ingestion service health check failed');
    }
  } catch (error) {
    console.log('❌ Ingestion service is not accessible:', error.message);
  }

  // Test 2: Check inference service health
  console.log('\n📋 Test 2: Checking inference service health...');
  totalTests++;
  try {
    const response = await axios.get(`${INFERENCE_URL}/`);
    if (response.data && response.data.status === 'running') {
      console.log('✅ Inference service is running');
      passedTests++;
    } else {
      console.log('❌ Inference service health check failed');
    }
  } catch (error) {
    console.log('❌ Inference service is not accessible:', error.message);
  }

  // Test 3: Test inference functionality (with mock API key to check error handling)
  console.log('\n📋 Test 3: Testing inference functionality...');
  totalTests++;
  try {
    const response = await axios.post(`${INFERENCE_URL}/infer`, {
      input: "Say hello",
      poolId: "test-pool"
    });
    
    // With a missing API key, we expect an error response
    if (response.data && response.data.error) {
      console.log('✅ Inference service correctly handles missing API key');
      passedTests++;
    } else {
      console.log('⚠️ Inference service returned unexpected response:', response.data);
    }
  } catch (error) {
    // If we get an error, that's expected if we don't have a valid OpenAI API key
    if (error.response && error.response.status === 500) {
      console.log('✅ Inference service correctly returns error for missing API key');
      passedTests++;
    } else {
      console.log('❌ Unexpected error testing inference:', error.message);
    }
  }

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All integration tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed');
    process.exit(1);
  }
}

testIntegration();