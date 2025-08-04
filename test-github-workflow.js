// Test script to verify GitHub Actions environment
// This simulates what happens in GitHub Actions

console.log('🧪 Testing GitHub Actions Environment...\n');

// Simulate the environment variables that GitHub Actions provides
const testEnvVars = {
  OPENAI_API_KEY_ARTICLES: process.env.OPENAI_API_KEY_ARTICLES,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
};

console.log('📋 Environment Variables Check:');
Object.entries(testEnvVars).forEach(([key, value]) => {
  const status = value ? '✅ Set' : '❌ Missing';
  const preview = value ? `${value.substring(0, 10)}...` : 'Not set';
  console.log(`${key}: ${status} (${preview})`);
});

// Check if all required variables are present
const missingVars = Object.entries(testEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('\n❌ Missing environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n💡 To fix this:');
  console.error('1. Go to your GitHub repository');
  console.error('2. Settings → Secrets and variables → Actions');
  console.error('3. Add the missing secrets with the exact names above');
  process.exit(1);
}

console.log('\n✅ All environment variables are present!');
console.log('🎉 Your GitHub Actions should work now.');

// Test OpenAI API connection
if (testEnvVars.OPENAI_API_KEY_ARTICLES) {
  console.log('\n🧪 Testing OpenAI API...');
  fetch('https://api.openai.com/v1/models', {
    headers: {
      'Authorization': `Bearer ${testEnvVars.OPENAI_API_KEY_ARTICLES}`
    }
  })
  .then(response => {
    if (response.ok) {
      console.log('✅ OpenAI API connection successful!');
    } else {
      console.error(`❌ OpenAI API error: ${response.status}`);
    }
  })
  .catch(error => {
    console.error('❌ OpenAI API connection failed:', error.message);
  });
}

console.log('\n✨ Test completed!'); 