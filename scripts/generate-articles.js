// AI Article Generation Script for GitHub Actions
// This script generates recovery articles using OpenAI and saves them to Supabase

const { createClient } = require('@supabase/supabase-js');

// Configuration - Get from GitHub Actions environment variables
const OPENAI_API_KEY_ARTICLES = process.env.OPENAI_API_KEY_ARTICLES;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Checking environment variables...');
console.log(`✅ OPENAI_API_KEY_ARTICLES: ${OPENAI_API_KEY_ARTICLES ? 'Set' : 'Missing'}`);
console.log(`✅ SUPABASE_URL: ${SUPABASE_URL ? 'Set' : 'Missing'}`);
console.log(`✅ SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing'}`);

if (!OPENAI_API_KEY_ARTICLES || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables');
  console.error('Required: OPENAI_API_KEY_ARTICLES, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  console.error('Please check your GitHub repository secrets');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Topics for AI to research and generate articles about
const topics = [
  {
    topic: "alcohol recovery brain healing neuroplasticity",
    category: "scientific",
    icon: "flask",
    color: "#667eea",
    tags: ["neuroscience", "brain recovery", "research"]
  },
  {
    topic: "personal story first year sobriety challenges victories",
    category: "personal",
    icon: "heart",
    color: "#fa709a",
    tags: ["personal story", "first year", "recovery journey"]
  },
  {
    topic: "nutrition alcohol recovery vitamins minerals brain health",
    category: "scientific",
    icon: "nutrition",
    color: "#43e97b",
    tags: ["nutrition", "health", "recovery"]
  },
  {
    topic: "support network recovery community connection",
    category: "scientific",
    icon: "people",
    color: "#764ba2",
    tags: ["support", "community", "recovery"]
  },
  {
    topic: "mindfulness meditation recovery emotional regulation",
    category: "scientific",
    icon: "leaf",
    color: "#4facfe",
    tags: ["mindfulness", "meditation", "recovery"]
  },
  {
    topic: "relapse prevention strategies coping mechanisms",
    category: "scientific",
    icon: "shield",
    color: "#f093fb",
    tags: ["relapse prevention", "coping", "strategies"]
  },
  {
    topic: "sleep quality alcohol recovery insomnia",
    category: "scientific",
    icon: "moon",
    color: "#667eea",
    tags: ["sleep", "recovery", "health"]
  },
  {
    topic: "exercise fitness alcohol recovery physical health",
    category: "scientific",
    icon: "fitness",
    color: "#fa709a",
    tags: ["exercise", "fitness", "recovery"]
  }
];

async function generateSingleArticle(topicConfig, retryCount = 0) {
  const maxRetries = 2;
  
  const prompt = `You are a research assistant specializing in alcohol recovery and addiction science. 

Please research and create a comprehensive, informative article about: ${topicConfig.topic}

Requirements:
- Write in a warm, supportive tone
- Include scientific research when relevant
- Make it practical and actionable
- Keep it around 800-1200 words
- Include practical tips and advice
- Focus on hope and recovery
- Use clear, accessible language

Please format the response as JSON with these exact fields:
{
  "title": "string",
  "excerpt": "string", 
  "content": "string",
  "author": "AI Research Assistant",
  "readTime": "string (e.g., '8 min')",
  "publishDate": "YYYY-MM-DD",
  "tags": ["string", "string", "string"]
}`;

  try {
    console.log(`🤖 Generating article for topic: ${topicConfig.topic}${retryCount > 0 ? ` (retry ${retryCount})` : ''}`);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY_ARTICLES}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful research assistant that creates accurate, informative articles about alcohol recovery. Always respond with valid JSON only.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      if (response.status === 500 && retryCount < maxRetries) {
        console.log(`⚠️ OpenAI API 500 error, retrying in 2 seconds... (attempt ${retryCount + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return generateSingleArticle(topicConfig, retryCount + 1);
      }
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }

    const content = data.choices[0].message.content;
    
    // Try to parse JSON from the response
    let articleData;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        articleData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse JSON response:', content);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate required fields
    if (!articleData.title || !articleData.content || !articleData.excerpt) {
      throw new Error('Missing required fields in AI response');
    }

    // Create article object for database
    const article = {
      title: articleData.title,
      excerpt: articleData.excerpt,
      content: articleData.content,
      author: articleData.author || 'AI Research Assistant',
      category: topicConfig.category,
      read_time: articleData.readTime,
      publish_date: articleData.publishDate,
      icon: topicConfig.icon,
      color: topicConfig.color,
      tags: articleData.tags || topicConfig.tags,
      ai_generated: true,
      source_urls: []
    };

    console.log(`✅ Generated: ${article.title}`);
    return article;

  } catch (error) {
    console.error(`❌ Error generating article for topic ${topicConfig.topic}:`, error.message);
    return null;
  }
}

async function generateArticles() {
  console.log('🚀 Starting AI article generation...');
  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log(`🎯 Topics to generate: ${topics.length}\n`);

  const articles = [];
  let successCount = 0;
  let errorCount = 0;

  // Generate articles for each topic
  for (const topicConfig of topics) {
    try {
      const article = await generateSingleArticle(topicConfig);
      
      if (article) {
        articles.push(article);
        successCount++;
      } else {
        errorCount++;
      }

      // Add a small delay between requests to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Failed to generate article for ${topicConfig.topic}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Generation Summary:`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📝 Total articles: ${articles.length}`);

  if (articles.length === 0) {
    console.error('❌ No articles were generated successfully');
    process.exit(1);
  }

  // Save articles to Supabase
  try {
    console.log('\n💾 Saving articles to database...');
    
    // Try to insert articles one by one to handle conflicts gracefully
    const savedArticles = [];
    const failedArticles = [];
    
    for (const article of articles) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .insert(article)
          .select()
          .single();
          
        if (error) {
          if (error.code === '23505') {
            // Duplicate article - skip it
            console.log(`⏭️ Skipping duplicate article: ${article.title}`);
            continue;
          } else {
            throw error;
          }
        }
        
        savedArticles.push(data);
        console.log(`✅ Saved: ${article.title}`);
        
      } catch (error) {
        console.error(`❌ Failed to save article "${article.title}":`, error.message);
        failedArticles.push(article);
      }
    }
    
    console.log(`\n📊 Database Summary:`);
    console.log(`✅ Successfully saved: ${savedArticles.length}`);
    console.log(`❌ Failed to save: ${failedArticles.length}`);
    console.log(`⏭️ Skipped duplicates: ${articles.length - savedArticles.length - failedArticles.length}`);
    
    if (savedArticles.length === 0) {
      throw new Error('No articles were saved to database');
    }

    console.log(`✅ Successfully saved ${savedArticles.length} articles to database`);
    console.log('🎉 AI article generation completed successfully!');
    
    // Log the titles of generated articles
    console.log('\n📋 Generated Articles:');
    savedArticles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
    });

  } catch (error) {
    console.error('❌ Database error:', error);
    throw error;
  }
}

// Run the script if called directly
if (require.main === module) {
  generateArticles()
    .then(() => {
      console.log('\n✨ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { generateArticles }; 