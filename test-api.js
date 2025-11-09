const testInference = async () => {
  try {
    const response = await fetch('http://localhost:5052/infer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: 'Hello, this is a test inference request',
        poolId: '0x8679e33657185a5c97daac9f5b8e93cf4c00182ee91d1318a1e5851f61033c2b'
      })
    });

    const data = await response.json();
    console.log('Inference response:', data);
  } catch (error) {
    console.error('Error testing inference:', error);
  }
};

testInference();