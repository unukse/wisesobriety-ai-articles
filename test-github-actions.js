// Test script for GitHub Actions AI Articles Setup
// Run this to verify your setup is working

const API_CONFIG = {
  BASE_URL: 'https://nzmtiwjdtcgzifxygxsa.supabase.co/rest/v1',
  API_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56bXRpd2pkdGNnemlmeHlneHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTUyMzEsImV4cCI6MjA2NzEzMTIzMX0.vJxUHnLPvjBjM7hh3xk4cQlGj-hKrDze12eNk10BzSg',
};

async function testGitHubActionsSetup() {
  console.log('🧪 Testing GitHub Actions AI Articles Setup...\n');

  try {
    // Test 1: Check if articles table exists and has data
    console.log('1. Testing database connection...');
    const response = await fetch(`${API_CONFIG.BASE_URL}/articles?select=count`, {
      headers: {
        'apikey': API_CONFIG.API_KEY,
        'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Database connection successful');
      console.log(`📊 Found ${data.length} articles in database\n`);
    } else {
      console.log('❌ Database connection failed');
      console.log(`Status: ${response.status}`);
      return;
    }

    // Test 2: Check article categories
    console.log('2. Testing article categories...');
    const categoriesResponse = await fetch(`${API_CONFIG.BASE_URL}/articles?select=category`, {
      headers: {
        'apikey': API_CONFIG.API_KEY,
        'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
      },
    });

    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      const categoryCounts = {};
      categoriesData.forEach(article => {
        categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1;
      });
      
      console.log('✅ Categories found:');
      Object.entries(categoryCounts).forEach(([category, count]) => {
        console.log(`   ${category}: ${count} articles`);
      });
      console.log('');
    }

    // Test 3: Check AI-generated articles
    console.log('3. Testing AI-generated articles...');
    const aiResponse = await fetch(`${API_CONFIG.BASE_URL}/articles?ai_generated=eq.true&select=count`, {
      headers: {
        'apikey': API_CONFIG.API_KEY,
        'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
      },
    });

    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      console.log(`✅ Found ${aiData.length} AI-generated articles\n`);
    }

    console.log('🎉 Database tests completed!');
    console.log('\n📋 Next steps for GitHub Actions:');
    console.log('1. Add GitHub secrets (OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)');
    console.log('2. Push the code to GitHub');
    console.log('3. Go to Actions tab and run "Generate AI Articles" workflow');
    console.log('4. Check the database for new articles');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your Supabase URL and API key');
    console.log('2. Verify the database schema is created');
    console.log('3. Ensure RLS policies are set correctly');
  }
}

// Run the test
testGitHubActionsSetup(); 