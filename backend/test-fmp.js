const axios = require('axios');
require('dotenv').config();

console.log('=================================');
console.log('FMP API Connection Test');
console.log('=================================\n');

const apiKey = process.env.FMP_API_KEY;

console.log('1. API Key Check:');
console.log('   Status:', apiKey ? '✅ Found' : '❌ NOT FOUND');
console.log('   Length:', apiKey ? apiKey.length : 0);
console.log('   Preview:', apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length-5)}` : 'N/A');

if (!apiKey) {
  console.error('\n❌ ERROR: FMP_API_KEY not found in .env file');
  console.error('   Please check that backend/.env exists and contains:');
  console.error('   FMP_API_KEY=your_key_here');
  process.exit(1);
}

console.log('\n2. Testing FMP News API...');

const url = `https://financialmodelingprep.com/stable/news/general-latest?page=0&limit=5&apikey=${apiKey}`;
console.log('   URL:', url.replace(apiKey, 'API_KEY_HIDDEN'));

axios.get(url, {
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json'
  }
})
  .then(response => {
    console.log('\n✅ SUCCESS!');
    console.log('=================================');
    console.log('Status Code:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Articles Received:', Array.isArray(response.data) ? response.data.length : 0);
    
    if (Array.isArray(response.data) && response.data.length > 0) {
      console.log('\n3. Sample Article:');
      console.log('   Title:', response.data[0].title);
      console.log('   Publisher:', response.data[0].publisher);
      console.log('   Date:', response.data[0].publishedDate);
      console.log('   URL:', response.data[0].url);
    } else {
      console.log('\n⚠️  No articles returned (empty array)');
    }
    
    console.log('\n=================================');
    console.log('✅ FMP API is working correctly!');
    console.log('=================================');
  })
  .catch(error => {
    console.error('\n❌ ERROR!');
    console.error('=================================');
    
    if (error.response) {
      console.error('HTTP Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 402) {
        console.error('\n❌ 402 Payment Required Error');
        console.error('   This usually means:');
        console.error('   1. API key is invalid');
        console.error('   2. API key has wrong format (check for quotes/spaces)');
        console.error('   3. Need to upgrade FMP plan');
        console.error('   4. Daily quota exceeded');
        console.error('\n   Your API key: ' + apiKey);
        console.error('   Expected format: WwNxldd0G8oDcMy1V0FPNIirF74a1p4E (no quotes, no spaces)');
      } else if (error.response.status === 401) {
        console.error('\n❌ 401 Unauthorized Error');
        console.error('   API key is invalid or expired');
      } else if (error.response.status === 429) {
        console.error('\n❌ 429 Rate Limit Error');
        console.error('   Too many requests. Wait and try again.');
      }
    } else if (error.request) {
      console.error('No response received from FMP');
      console.error('Error:', error.message);
      console.error('\nPossible causes:');
      console.error('1. Network connection issue');
      console.error('2. FMP API is down');
      console.error('3. Firewall blocking request');
    } else {
      console.error('Request setup error:', error.message);
    }
    
    console.error('\n=================================');
    console.error('❌ FMP API test failed');
    console.error('=================================');
    process.exit(1);
  });

