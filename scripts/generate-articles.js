// AI Article Generation Script for GitHub Actions
// This script generates recovery articles using OpenAI and saves them to Supabase

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables');
  console.error('Required: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
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
    topic: "personal alcohol recovery journey first year sobriety",
    category: "personal",
    icon: "heart",
    color: "#fa709a",
    tags: ["personal story", "first year", "recovery journey"]
  },
  {
    topic: "nutrition alcohol recovery vitamins minerals",
    category: "scientific",
    icon: "nutrition",
    color: "#43e97b",
    tags: ["nutrition", "health", "recovery"]
  },
  {
    topic: "mindfulness meditation alcohol recovery stress",
    category: "scientific",
    icon: "leaf",
    color: "#4facfe",
    tags: ["mindfulness", "meditation", "stress relief"]
  },
  {
    topic: "support groups alcohol recovery community",
    category: "research",
    icon: "people",
    color: "#764ba2",
    tags: ["support", "community", "recovery"]
  },
  {
    topic: "exercise fitness alcohol recovery physical health",
    category: "scientific",
    icon: "fitness",
    color: "#f093fb",
    tags: ["exercise", "fitness", "physical health"]
  },
  {
    topic: "sleep alcohol recovery insomnia withdrawal",
    category: "scientific",
    icon: "moon",
    color: "#a8edea",
    tags: ["sleep", "insomnia", "recovery"]
  },
  {
    topic: "therapy counseling alcohol recovery mental health",
    category: "research",
    icon: "medical",
    color: "#667eea",
    tags: ["therapy", "mental health", "counseling"]
  }
];

async function generateSingleArticle(topicConfig) {
  const prompt = `You are a research assistant specializing in alcohol recovery and addiction science. 

Please research the internet for the latest scientific studies, research papers, and personal experiences related to: "${topicConfig.topic}"

Based on your research, create a comprehensive article with the following requirements:

1. TITLE: Create an engaging, informative title (max 80 characters)
2. EXCERPT: Write a compelling 2-3 sentence summary (max 200 characters)
3. CONTENT: Write a detailed article of approximately 200 words that includes:
   - Scientific research findings (if applicable)
   - Practical advice and tips
   - Personal insights and experiences
   - Evidence-based recommendations
   - Hope and encouragement for recovery

4. AUTHOR: Use "AI Research Assistant" as the author
5. READ TIME: Calculate based on content (e.g., "5 min", "8 min")
6. PUBLISH DATE: Use today's date in YYYY-MM-DD format
7. TAGS: Provide 3-4 relevant tags

The article should be:
- Scientifically accurate and up-to-date
- Empowering and hopeful
- Practical and actionable
- Written in a warm, supportive tone
- Focused on recovery and healing

Please format the response as JSON with these exact fields:
{
  "title": "string",
  "excerpt": "string", 
  "content": "string",
  "author": "AI Research Assistant",
  "readTime": "string",
  "publishDate": "YYYY-MM-DD",
  "tags": ["string", "string", "string"]
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
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
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse JSON response
    let articleData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        articleData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse JSON:', content);
      throw new Error('Invalid JSON response from AI');
    }

    // Create article object
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

    return article;

  } catch (error) {
    console.error(`Error generating article for topic ${topicConfig.topic}:`, error);
    return null;
  }
}

async function generateArticles() {
  console.log('🚀 Starting AI article generation...\n');

  const articles = [];

  for (const topicConfig of topics) {
    try {
      console.log(`📝 Generating article for: ${topicConfig.topic}`);
      const article = await generateSingleArticle(topicConfig);
      
      if (article) {
        articles.push(article);
        console.log(`✅ Generated: ${article.title}`);
      }
      
      // Add delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Failed to generate article for ${topicConfig.topic}:`, error.message);
    }
  }

  if (articles.length === 0) {
    console.log('❌ No articles were generated');
    process.exit(1);
  }

  try {
    console.log(`\n💾 Saving ${articles.length} articles to database...`);
    
    const { data, error } = await supabase
      .from('articles')
      .upsert(articles, { 
        onConflict: 'title',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      throw error;
    }

    console.log(`✅ Successfully saved ${data.length} articles to database!`);
    console.log('\n📊 Generated articles:');
    data.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (${article.category})`);
    });

    return data;
  } catch (error) {
    console.error('❌ Database error:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  generateArticles()
    .then(() => {
      console.log('\n🎉 Article generation completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Article generation failed:', error);
      process.exit(1);
    });
}

module.exports = { generateArticles }; 