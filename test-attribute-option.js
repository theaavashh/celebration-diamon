const fetch = require('node-fetch');
const fs = require('fs');

// Read the .env.local file to get the API base URL
const envPath = '/home/theaavashh/workplace/new/celebration-diamond/admin/.env.local';
let API_BASE_URL = 'http://localhost:5000';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/NEXT_PUBLIC_API_BASE_URL=(.*)/);
  if (match) {
    API_BASE_URL = match[1];
  }
}

console.log('Using API Base URL:', API_BASE_URL);

async function testAttributeOptionCreation() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/attribute-options/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attribute: 'diamondType',
        value: 'Test Diamond Type'
      })
    });

    const result = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAttributeOptionCreation();