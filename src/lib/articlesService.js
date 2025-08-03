// Articles Service for Recovery Resources
// This service handles fetching and managing recovery articles

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, getApiUrl, getAuthHeaders, handleApiError, validateApiResponse } from './apiConfig';

class ArticlesService {
  constructor() {
    this.lastUpdateKey = API_CONFIG.CACHE.LAST_UPDATE_KEY;
    this.articlesKey = API_CONFIG.CACHE.ARTICLES_KEY;
  }

  // Get articles with caching and weekly updates
  async getArticles() {
    try {
      // Check if we need to update articles (weekly)
      const shouldUpdate = await this.shouldUpdateArticles();
      
      if (shouldUpdate) {
        // Fetch new articles from API
        const newArticles = await this.fetchArticlesFromAPI();
        if (newArticles && newArticles.length > 0) {
          await this.cacheArticles(newArticles);
          return newArticles;
        }
      }
      
      // Return cached articles
      return await this.getCachedArticles();
    } catch (error) {
      console.error('Error fetching articles:', error);
      // Return fallback articles if API fails
      return this.getFallbackArticles();
    }
  }

  // Check if articles should be updated (weekly)
  async shouldUpdateArticles() {
    try {
      const lastUpdate = await this.getLastUpdateTime();
      const now = new Date();
      const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);
      
      // Update based on configuration
      return daysSinceUpdate >= API_CONFIG.CACHE.UPDATE_INTERVAL_DAYS;
    } catch (error) {
      console.error('Error checking update time:', error);
      return true; // Update if we can't determine last update
    }
  }

  // Fetch articles from API
  async fetchArticlesFromAPI() {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ARTICLES), {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorMessage = handleApiError(null, response.status);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Supabase returns array directly, not wrapped in articles object
      if (!Array.isArray(data)) {
        throw new Error('Invalid API response format');
      }

      return data;
    } catch (error) {
      console.error('Error fetching from API:', error);
      return null;
    }
  }

  // Fetch articles by category
  async fetchArticlesByCategory(category) {
    try {
      const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.ARTICLES_BY_CATEGORY}${category}`), {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorMessage = handleApiError(null, response.status);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Supabase returns array directly
      if (!Array.isArray(data)) {
        throw new Error('Invalid API response format');
      }

      return data;
    } catch (error) {
      console.error('Error fetching articles by category:', error);
      return null;
    }
  }

  // Search articles via API
  async searchArticlesAPI(query) {
    try {
      // Supabase search with ilike operator
      const searchUrl = `${getApiUrl(API_CONFIG.ENDPOINTS.ARTICLES)}?or=(title.ilike.*${encodeURIComponent(query)}*,excerpt.ilike.*${encodeURIComponent(query)}*,content.ilike.*${encodeURIComponent(query)}*)`;
      
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorMessage = handleApiError(null, response.status);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Supabase returns array directly
      if (!Array.isArray(data)) {
        throw new Error('Invalid API response format');
      }

      return data;
    } catch (error) {
      console.error('Error searching articles:', error);
      return null;
    }
  }

  // Cache articles locally
  async cacheArticles(articles) {
    try {
      await AsyncStorage.setItem(this.articlesKey, JSON.stringify(articles));
      await AsyncStorage.setItem(this.lastUpdateKey, new Date().toISOString());
    } catch (error) {
      console.error('Error caching articles:', error);
    }
  }

  // Get cached articles
  async getCachedArticles() {
    try {
      const cached = await AsyncStorage.getItem(this.articlesKey);
      return cached ? JSON.parse(cached) : this.getFallbackArticles();
    } catch (error) {
      console.error('Error getting cached articles:', error);
      return this.getFallbackArticles();
    }
  }

  // Get last update time
  async getLastUpdateTime() {
    try {
      const lastUpdate = await AsyncStorage.getItem(this.lastUpdateKey);
      return lastUpdate ? new Date(lastUpdate) : new Date(0);
    } catch (error) {
      console.error('Error getting last update time:', error);
      return new Date(0);
    }
  }

  // Fallback articles (used when API is unavailable)
  getFallbackArticles() {
    return [
      {
        id: 1,
        title: 'The Science of Alcohol Recovery: What Research Shows',
        excerpt: 'Recent studies reveal the neurobiological changes that occur during recovery and how the brain heals over time.',
        content: `The journey to recovery from alcohol addiction is not just a matter of willpower—it's a complex process involving significant changes in brain chemistry and structure. Recent research has shown that the brain has remarkable plasticity, meaning it can heal and adapt even after years of alcohol abuse.

Key findings from recent studies include:

• **Neuroplasticity**: The brain can form new neural pathways and connections, even after damage from alcohol abuse. This process, called neuroplasticity, is the foundation of recovery.

• **Dopamine System Recovery**: Alcohol affects the brain's reward system by flooding it with dopamine. Research shows that with sustained abstinence, the dopamine system can gradually return to normal function.

• **Gray Matter Regeneration**: Studies using brain imaging have shown that gray matter volume can increase in certain brain regions after periods of sobriety, particularly in areas responsible for decision-making and emotional regulation.

• **White Matter Repair**: The brain's white matter, which facilitates communication between different brain regions, can also show signs of repair and regeneration during recovery.

The timeline for brain recovery varies from person to person, but research suggests that significant improvements can be seen within 6-12 months of sustained abstinence. However, some cognitive functions may take longer to fully recover.

It's important to note that recovery is not linear, and setbacks are a normal part of the process. The key is persistence and seeking support when needed.`,
        author: 'Dr. Sarah Johnson',
        category: 'scientific',
        readTime: '8 min',
        publishDate: '2024-01-15',
        icon: 'flask',
        color: '#667eea',
        tags: ['research', 'neuroscience', 'recovery'],
      },
      {
        id: 2,
        title: 'My First Year Sober: A Personal Journey',
        excerpt: 'One person\'s honest account of the challenges, victories, and unexpected discoveries during their first year of sobriety.',
        content: `I never thought I'd be writing this. One year ago, I was convinced that alcohol was my only way to cope with life's stresses. Today, I'm celebrating 365 days of sobriety, and I want to share my story in the hope that it might help someone else.

**The Early Days (Months 1-3)**
The first three months were the hardest. I experienced intense cravings, mood swings, and a constant feeling of emptiness. I had to relearn how to socialize, how to handle stress, and how to celebrate without alcohol. The physical withdrawal symptoms were challenging, but the psychological aspects were even more difficult.

I found myself questioning everything about my identity. Who was I without alcohol? How would I handle social situations? What would I do with all this free time?

**Finding My Footing (Months 4-6)**
Around month four, things started to shift. I began to notice improvements in my sleep, energy levels, and overall mood. I started exercising regularly, something I had never done before. The fog in my brain began to lift, and I found myself thinking more clearly than I had in years.

I also discovered new hobbies and interests. I started reading again, something I had given up years ago. I began cooking more elaborate meals, finding joy in the process rather than just the end result.

**Building a New Life (Months 7-12)**
The second half of my first year brought unexpected gifts. I reconnected with old friends who supported my sobriety, and I made new friends through recovery groups. I started therapy to address the underlying issues that had led to my drinking in the first place.

I also began to repair relationships that had been damaged by my drinking. This wasn't easy, and some relationships couldn't be salvaged, but I learned to accept that and focus on the relationships that mattered.

**Unexpected Discoveries**
One of the biggest surprises was discovering that I actually enjoyed being sober. I had always assumed that life without alcohol would be boring and joyless, but I found that I was experiencing deeper, more authentic emotions and connections.

I also discovered a strength within myself that I never knew existed. Facing challenges without the crutch of alcohol made me realize that I was capable of handling difficult situations on my own.

**Looking Forward**
As I enter my second year of sobriety, I'm excited about the future. I've learned that recovery is not about perfection—it's about progress. I still have bad days, but I now have the tools to handle them without turning to alcohol.

To anyone reading this who is struggling: You are stronger than you think. Recovery is possible, and it's worth it. Take it one day at a time, and don't be afraid to ask for help.`,
        author: 'Anonymous',
        category: 'personal',
        readTime: '6 min',
        publishDate: '2024-01-10',
        icon: 'heart',
        color: '#fa709a',
        tags: ['personal story', 'first year', 'recovery journey'],
      },
      {
        id: 3,
        title: 'The Role of Nutrition in Alcohol Recovery',
        excerpt: 'How proper nutrition can support the healing process and improve recovery outcomes.',
        content: `When we think about alcohol recovery, nutrition isn't always the first thing that comes to mind. However, research has shown that proper nutrition plays a crucial role in the recovery process and can significantly impact long-term outcomes.

**The Impact of Alcohol on Nutrition**
Alcohol abuse can lead to severe nutritional deficiencies. Alcohol interferes with the absorption of essential vitamins and minerals, particularly:

• **B Vitamins**: Essential for brain function and energy production
• **Vitamin D**: Important for mood regulation and immune function
• **Magnesium**: Critical for muscle and nerve function
• **Zinc**: Important for immune system function and wound healing

**Nutritional Strategies for Recovery**

**1. Replenishing B Vitamins**
B vitamins are particularly important during recovery as they support brain function and help reduce symptoms of depression and anxiety. Good sources include:
- Leafy green vegetables
- Whole grains
- Lean proteins
- Nutritional yeast

**2. Supporting Brain Health**
Omega-3 fatty acids are crucial for brain health and can help repair damage caused by alcohol. Sources include:
- Fatty fish (salmon, mackerel, sardines)
- Flaxseeds and chia seeds
- Walnuts
- Algae supplements

**3. Stabilizing Blood Sugar**
Alcohol can cause blood sugar fluctuations, which can contribute to mood swings and cravings. To stabilize blood sugar:
- Eat regular meals throughout the day
- Include protein with every meal
- Choose complex carbohydrates over simple sugars
- Avoid skipping meals

**4. Supporting Liver Health**
The liver is responsible for processing alcohol and other toxins. To support liver health:
- Eat plenty of antioxidant-rich foods (berries, leafy greens, cruciferous vegetables)
- Include foods that support liver function (garlic, turmeric, green tea)
- Stay hydrated with plenty of water

**Practical Tips for Implementation**

**Start Small**: Don't try to overhaul your entire diet at once. Start by adding one healthy habit at a time.

**Plan Ahead**: Prepare healthy snacks and meals in advance to avoid reaching for unhealthy options when hungry.

**Stay Hydrated**: Dehydration can be mistaken for hunger and can contribute to cravings. Aim for at least 8 glasses of water per day.

**Listen to Your Body**: Pay attention to how different foods make you feel. Some people find that certain foods trigger cravings or affect their mood.

**Seek Professional Help**: Consider working with a registered dietitian who specializes in addiction recovery to develop a personalized nutrition plan.

**The Connection Between Nutrition and Mental Health**
Research has shown a strong connection between diet and mental health. A diet rich in whole foods, healthy fats, and essential nutrients can help:
- Reduce symptoms of depression and anxiety
- Improve sleep quality
- Increase energy levels
- Reduce inflammation in the body

**Remember**: Nutrition is just one piece of the recovery puzzle. It works best when combined with other recovery strategies like therapy, support groups, and medical care when needed.

The key is to be patient with yourself and to remember that every healthy choice you make is a step toward better health and recovery.`,
        author: 'Dr. Michael Chen',
        category: 'scientific',
        readTime: '7 min',
        publishDate: '2024-01-08',
        icon: 'nutrition',
        color: '#43e97b',
        tags: ['nutrition', 'health', 'recovery'],
      },
      {
        id: 4,
        title: 'Building a Support Network: Why Connection Matters',
        excerpt: 'The importance of social support in recovery and how to build meaningful connections.',
        content: `Recovery from alcohol addiction is not a solo journey. While the decision to get sober is deeply personal, the path to lasting recovery is often paved with the support of others. Research consistently shows that having a strong support network is one of the most important predictors of successful recovery.

**Why Support Networks Matter**

**1. Accountability**
Having people who know about your recovery goals creates a sense of accountability. When others are invested in your success, it can provide motivation to stay on track, especially during difficult times.

**2. Emotional Support**
Recovery can be emotionally challenging. Having people who understand what you're going through and can offer empathy and encouragement is invaluable.

**3. Practical Support**
Support networks can provide practical help, such as rides to meetings, help with childcare, or assistance during difficult situations.

**4. Role Models**
Seeing others who have successfully navigated recovery can provide hope and inspiration. It shows that recovery is possible and gives you examples to follow.

**Building Your Support Network**

**1. Start with Professional Support**
- Therapists or counselors who specialize in addiction
- Medical professionals who can provide medical support
- Addiction specialists who can guide your recovery process

**2. Join Support Groups**
- Alcoholics Anonymous (AA) or other 12-step programs
- SMART Recovery groups
- Online support communities
- Recovery-focused social media groups

**3. Reconnect with Family and Friends**
- Be honest about your recovery journey
- Set boundaries with people who may not support your sobriety
- Focus on relationships that are healthy and supportive

**4. Build New Connections**
- Join clubs or groups based on your interests
- Volunteer for causes you care about
- Take classes or workshops
- Join sports teams or fitness groups

**5. Consider Sober Living Communities**
- Provide structured support during early recovery
- Offer peer support and accountability
- Help develop life skills needed for independent living

**Maintaining Healthy Boundaries**

While support is crucial, it's also important to maintain healthy boundaries:

**1. Be Selective**
Not everyone needs to know about your recovery journey. Choose carefully who you share with and how much you share.

**2. Set Clear Expectations**
Be clear about what kind of support you need and what you don't need.

**3. Avoid Toxic Relationships**
Distance yourself from people who don't support your recovery or who may trigger relapse.

**4. Practice Self-Care**
Remember that you can't pour from an empty cup. Take care of yourself so you can be there for others.

**The Role of Technology**

Modern technology has made it easier than ever to connect with others in recovery:

**1. Online Support Groups**
- 24/7 access to support
- Anonymity for those who prefer it
- Ability to connect with people from around the world

**2. Recovery Apps**
- Track progress and milestones
- Connect with others in recovery
- Access to resources and tools

**3. Social Media**
- Follow recovery-focused accounts
- Join recovery communities
- Share your journey (if comfortable)

**Remember**: Building a support network takes time and effort. Don't get discouraged if it doesn't happen overnight. Focus on making one connection at a time, and remember that quality is more important than quantity.

The most important thing is to keep reaching out, even when it's difficult. Recovery is possible, and you don't have to do it alone.`,
        author: 'Dr. Lisa Rodriguez',
        category: 'scientific',
        readTime: '9 min',
        publishDate: '2024-01-05',
        icon: 'people',
        color: '#764ba2',
        tags: ['support', 'community', 'recovery'],
      },
      {
        id: 5,
        title: 'Mindfulness and Meditation in Recovery',
        excerpt: 'How mindfulness practices can support emotional regulation and reduce relapse risk.',
        content: `Mindfulness and meditation have become increasingly recognized as powerful tools in addiction recovery. Research has shown that these practices can help individuals develop better emotional regulation, reduce stress, and decrease the likelihood of relapse.

**What is Mindfulness?**

Mindfulness is the practice of paying attention to the present moment without judgment. It involves observing thoughts, feelings, and sensations as they arise, without trying to change them or react to them immediately.

**The Science Behind Mindfulness in Recovery**

**1. Brain Changes**
Research using brain imaging has shown that regular mindfulness practice can lead to structural changes in the brain, particularly in areas responsible for:
- Emotional regulation
- Attention and focus
- Decision-making
- Stress response

**2. Stress Reduction**
Mindfulness has been shown to reduce levels of cortisol, the body's primary stress hormone. This is particularly important in recovery, as stress is a common trigger for relapse.

**3. Improved Emotional Regulation**
Mindfulness helps individuals develop the ability to observe their emotions without being overwhelmed by them. This skill is crucial for managing cravings and difficult emotions during recovery.

**Practical Mindfulness Techniques for Recovery**

**1. Breath Awareness**
This is the foundation of mindfulness practice:
- Find a comfortable position
- Close your eyes or soften your gaze
- Focus your attention on your breath
- Notice the sensation of breathing in and out
- When your mind wanders, gently bring it back to your breath

**2. Body Scan**
This practice helps develop body awareness:
- Lie down in a comfortable position
- Close your eyes
- Bring your attention to your toes
- Slowly move your attention up through your body
- Notice any sensations, tension, or relaxation

**3. Mindful Walking**
This can be done anywhere:
- Walk slowly and deliberately
- Pay attention to the sensation of your feet touching the ground
- Notice the movement of your body
- Observe your surroundings without judgment

**4. Mindful Eating**
This can help develop a healthier relationship with food:
- Eat slowly and without distractions
- Pay attention to the taste, texture, and smell of your food
- Notice when you're hungry and when you're full
- Appreciate the nourishment your food provides

**5. Loving-Kindness Meditation**
This practice cultivates compassion for yourself and others:
- Sit comfortably and close your eyes
- Begin by directing kind thoughts toward yourself
- Gradually extend these thoughts to others
- Repeat phrases like "May I be happy, may I be healthy, may I be at peace"

**Integrating Mindfulness into Daily Life**

**1. Start Small**
Begin with just 5-10 minutes of practice per day. It's better to practice consistently for a short time than to practice sporadically for longer periods.

**2. Use Reminders**
Set reminders on your phone or place sticky notes in visible locations to remind yourself to practice mindfulness throughout the day.

**3. Practice During Routine Activities**
Bring mindfulness to everyday activities like:
- Brushing your teeth
- Washing dishes
- Taking a shower
- Walking to your car

**4. Use Apps and Resources**
There are many apps and online resources available to guide mindfulness practice:
- Headspace
- Calm
- Insight Timer
- UCLA Mindful Awareness Research Center

**Mindfulness and Relapse Prevention**

**1. Recognizing Triggers**
Mindfulness can help you become more aware of your triggers and the early warning signs of potential relapse.

**2. Managing Cravings**
When cravings arise, mindfulness can help you:
- Observe the craving without acting on it
- Recognize that cravings are temporary
- Choose how to respond rather than reacting automatically

**3. Coping with Difficult Emotions**
Mindfulness provides tools for dealing with difficult emotions without turning to alcohol:
- Observe emotions without judgment
- Allow emotions to arise and pass naturally
- Choose healthy coping strategies

**The Benefits of Regular Practice**

Regular mindfulness practice can lead to:
- Reduced stress and anxiety
- Improved sleep quality
- Better emotional regulation
- Increased self-awareness
- Enhanced relationships
- Greater sense of well-being

**Remember**: Mindfulness is a skill that develops over time. Be patient with yourself and remember that every moment of practice is beneficial, even if it doesn't feel like it at the time.

The key is consistency rather than perfection. Even a few minutes of mindfulness practice each day can make a significant difference in your recovery journey.`,
        author: 'Dr. James Wilson',
        category: 'scientific',
        readTime: '10 min',
        publishDate: '2024-01-03',
        icon: 'leaf',
        color: '#4facfe',
        tags: ['mindfulness', 'meditation', 'recovery'],
      },
    ];
  }

  // Get articles by category
  async getArticlesByCategory(category) {
    const articles = await this.getArticles();
    if (category === 'all') {
      return articles;
    }
    return articles.filter(article => article.category === category);
  }

  // Search articles
  async searchArticles(query) {
    try {
      // Try API search first
      const apiResults = await this.searchArticlesAPI(query);
      if (apiResults && apiResults.length > 0) {
        return apiResults;
      }
    } catch (error) {
      console.log('API search failed, falling back to local search');
    }

    // Fallback to local search
    const articles = await this.getArticles();
    const lowercaseQuery = query.toLowerCase();
    
    return articles.filter(article => 
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.excerpt.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Get article by ID
  async getArticleById(id) {
    const articles = await this.getArticles();
    return articles.find(article => article.id === id);
  }

  // Force refresh articles (for manual updates)
  async forceRefresh() {
    try {
      const newArticles = await this.fetchArticlesFromAPI();
      if (newArticles && newArticles.length > 0) {
        await this.cacheArticles(newArticles);
        return newArticles;
      }
      return await this.getCachedArticles();
    } catch (error) {
      console.error('Error forcing refresh:', error);
      return this.getFallbackArticles();
    }
  }

  // Get update status
  async getUpdateStatus() {
    try {
      const lastUpdate = await this.getLastUpdateTime();
      const now = new Date();
      const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);
      
      return {
        lastUpdate,
        daysSinceUpdate,
        shouldUpdate: daysSinceUpdate >= 7,
        nextUpdate: new Date(lastUpdate.getTime() + (7 * 24 * 60 * 60 * 1000))
      };
    } catch (error) {
      console.error('Error getting update status:', error);
      return {
        lastUpdate: new Date(0),
        daysSinceUpdate: 999,
        shouldUpdate: true,
        nextUpdate: new Date()
      };
    }
  }

  // Trigger AI article generation (using GitHub Actions)
  async triggerArticleGeneration() {
    try {
      // For now, we'll just refresh the articles from the database
      // The actual generation happens via GitHub Actions
      console.log('📝 Article generation is handled by GitHub Actions');
      console.log('🔗 To generate new articles:');
      console.log('   1. Go to GitHub Actions tab');
      console.log('   2. Click "Generate AI Articles" workflow');
      console.log('   3. Click "Run workflow"');
      console.log('   4. Or run manually: node scripts/generate-articles.js');
      
      // Return success message
      return {
        success: true,
        message: 'Article generation triggered via GitHub Actions',
        articles: []
      };
    } catch (error) {
      console.error('Error triggering article generation:', error);
      throw error;
    }
  }

  // Get AI generation status
  async getAIGenerationStatus() {
    try {
      const articles = await this.getArticles();
      const aiArticles = articles.filter(article => article.aiGenerated);
      
      return {
        totalArticles: articles.length,
        aiGeneratedArticles: aiArticles.length,
        lastGenerated: aiArticles.length > 0 ? 
          new Date(Math.max(...aiArticles.map(a => new Date(a.publishDate)))) : 
          null
      };
    } catch (error) {
      console.error('Error getting AI generation status:', error);
      return {
        totalArticles: 0,
        aiGeneratedArticles: 0,
        lastGenerated: null
      };
    }
  }
}

export default new ArticlesService(); 