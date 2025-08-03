import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function ResourcesScreen({ navigation }) {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);

  // Articles data - this could be fetched from an API in production
  const articles = [
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

  const categories = [
    { id: 'all', name: 'All Articles', icon: 'library' },
    { id: 'scientific', name: 'Scientific Research', icon: 'flask' },
    { id: 'personal', name: 'Personal Stories', icon: 'heart' },
  ];

  const resources = [
    {
      id: 1,
      title: 'Crisis Hotline',
      description: '24/7 support when you need it most',
      phone: '1-800-273-8255',
      icon: 'call',
      color: '#fa709a',
      type: 'emergency',
    },
    {
      id: 2,
      title: 'AA Meetings',
      description: 'Find local Alcoholics Anonymous meetings',
      url: 'https://www.aa.org',
      icon: 'people',
      color: '#43e97b',
      type: 'support',
    },
    {
      id: 3,
      title: 'Recovery Literature',
      description: 'Books and articles about recovery',
      url: 'https://www.samhsa.gov',
      icon: 'library',
      color: '#4facfe',
      type: 'education',
    },
    {
      id: 4,
      title: 'Therapist Directory',
      description: 'Find professional help in your area',
      url: 'https://www.psychologytoday.com',
      icon: 'medical',
      color: '#a8edea',
      type: 'professional',
    },
    {
      id: 5,
      title: 'Online Community',
      description: 'Connect with others in recovery',
      url: 'https://www.reddit.com/r/stopdrinking',
      icon: 'chatbubbles',
      color: '#764ba2',
      type: 'community',
    },
    {
      id: 6,
      title: 'Meditation Apps',
      description: 'Recommended mindfulness apps',
      url: 'https://www.headspace.com',
      icon: 'leaf',
      color: '#f093fb',
      type: 'wellness',
    },
  ];

  const educationalContent = [
    {
      id: 1,
      title: 'Understanding Addiction',
      description: 'Learn about the science behind addiction and recovery',
      duration: '5 min read',
      icon: 'school',
      color: '#667eea',
    },
    {
      id: 2,
      title: 'Coping Strategies',
      description: 'Healthy ways to deal with stress and triggers',
      duration: '3 min read',
      icon: 'shield-checkmark',
      color: '#43e97b',
    },
    {
      id: 3,
      title: 'Building Healthy Habits',
      description: 'Replace old habits with positive new ones',
      duration: '4 min read',
      icon: 'fitness',
      color: '#fa709a',
    },
  ];

  // Filter articles based on selected category
  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const handleResourcePress = (resource) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (resource.phone) {
      Linking.openURL(`tel:${resource.phone}`);
    } else if (resource.url) {
      Linking.openURL(resource.url);
    }
  };

  const handleArticlePress = (article) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedArticle(article);
    setShowArticleModal(true);
  };

  const handleBookmarkToggle = (articleId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (bookmarkedArticles.includes(articleId)) {
      setBookmarkedArticles(prev => prev.filter(id => id !== articleId));
    } else {
      setBookmarkedArticles(prev => [...prev, articleId]);
    }
  };

  const handleCategoryChange = (categoryId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(categoryId);
  };

  const ResourceCard = ({ resource }) => (
    <TouchableOpacity
      style={styles.resourceCard}
      onPress={() => handleResourcePress(resource)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[resource.color, resource.color + '80']}
        style={styles.resourceGradient}
      >
        <View style={styles.resourceHeader}>
          <View style={styles.resourceIconContainer}>
            <Ionicons name={resource.icon} size={24} color="#ffffff" />
          </View>
          <View style={styles.resourceInfo}>
            <Text style={styles.resourceTitle}>{resource.title}</Text>
            <Text style={styles.resourceDescription}>{resource.description}</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const EducationCard = ({ content }) => (
    <TouchableOpacity
      style={styles.educationCard}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.educationGradient}
      >
        <View style={styles.educationHeader}>
          <View style={styles.educationIconContainer}>
            <Ionicons name={content.icon} size={24} color={content.color} />
          </View>
          <View style={styles.educationInfo}>
            <Text style={styles.educationTitle}>{content.title}</Text>
            <Text style={styles.educationDuration}>{content.duration}</Text>
          </View>
        </View>
        <Text style={styles.educationDescription}>{content.description}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const ArticleCard = ({ article }) => {
    const isBookmarked = bookmarkedArticles.includes(article.id);
    
    return (
      <TouchableOpacity
        style={styles.articleCard}
        onPress={() => handleArticlePress(article)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#ffffff', '#f8f9fa']}
          style={styles.articleGradient}
        >
          <View style={styles.articleHeader}>
            <View style={styles.articleIconContainer}>
              <Ionicons name={article.icon} size={24} color={article.color} />
            </View>
            <View style={styles.articleInfo}>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleMeta}>
                {article.readTime} • {article.author} • {new Date(article.publishDate).toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={() => handleBookmarkToggle(article.id)}
            >
              <Ionicons 
                name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={isBookmarked ? article.color : "#ccc"} 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.articleExcerpt}>{article.excerpt}</Text>
          <View style={styles.articleTags}>
            {article.tags.map((tag, index) => (
              <View key={index} style={styles.tagContainer}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const CategoryButton = ({ category }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.categoryButtonActive
      ]}
      onPress={() => handleCategoryChange(category.id)}
      activeOpacity={0.8}
    >
      <Ionicons 
        name={category.icon} 
        size={16} 
        color={selectedCategory === category.id ? '#667eea' : '#ffffff'} 
      />
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category.id && styles.categoryButtonTextActive
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 60, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.emergencySection}>
            <View style={styles.emergencyCard}>
              <LinearGradient
                colors={['#ff6b6b', '#ee5a52']}
                style={styles.emergencyGradient}
              >
                <Ionicons name="warning" size={32} color="#ffffff" />
                <Text style={styles.emergencyTitle}>Need Immediate Help?</Text>
                <Text style={styles.emergencyText}>
                  If you're in crisis or need immediate support, call the National Suicide Prevention Lifeline
                </Text>
                <TouchableOpacity
                  style={styles.emergencyButton}
                  onPress={() => Linking.openURL('tel:1-800-273-8255')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.emergencyButtonText}>Call 1-800-273-8255</Text>
                  <Ionicons name="call" size={20} color="#ffffff" />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.articlesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recovery Articles</Text>
              <Text style={styles.sectionSubtitle}>Updated weekly with new research and stories</Text>
            </View>
            
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <CategoryButton key={category.id} category={category} />
              ))}
            </View>

            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </View>



          <View style={styles.educationSection}>
            <Text style={styles.sectionTitle}>Educational Content</Text>
            {educationalContent.map((content) => (
              <EducationCard key={content.id} content={content} />
            ))}
          </View>

          <View style={styles.tipsSection}>
            <View style={styles.tipsCard}>
              <Ionicons name="bulb" size={24} color="#667eea" style={styles.tipsIcon} />
              <Text style={styles.tipsTitle}>Remember</Text>
              <Text style={styles.tipsText}>
                Recovery is a journey, not a destination. It's okay to ask for help, 
                and there are many people and resources available to support you. 
                You don't have to go through this alone.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Article Reader Modal */}
        <Modal
          visible={showArticleModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowArticleModal(false)}
        >
          {selectedArticle && (
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowArticleModal(false)}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalBookmarkButton}
                  onPress={() => handleBookmarkToggle(selectedArticle.id)}
                >
                  <Ionicons 
                    name={bookmarkedArticles.includes(selectedArticle.id) ? "bookmark" : "bookmark-outline"} 
                    size={24} 
                    color={bookmarkedArticles.includes(selectedArticle.id) ? selectedArticle.color : "#333"} 
                  />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                <View style={styles.articleHeader}>
                  <View style={styles.articleIconContainer}>
                    <Ionicons name={selectedArticle.icon} size={32} color={selectedArticle.color} />
                  </View>
                  <View style={styles.articleInfo}>
                    <Text style={styles.modalArticleTitle}>{selectedArticle.title}</Text>
                    <Text style={styles.modalArticleMeta}>
                      {selectedArticle.readTime} • {selectedArticle.author} • {new Date(selectedArticle.publishDate).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.modalArticleContent}>{selectedArticle.content}</Text>
              </ScrollView>
            </View>
          )}
        </Modal>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  emergencySection: {
    marginBottom: 20,
  },
  emergencyCard: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  emergencyGradient: {
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  emergencyText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emergencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
  resourcesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  resourceCard: {
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  resourceGradient: {
    padding: 20,
    borderRadius: 15,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  educationSection: {
    marginBottom: 20,
  },
  educationCard: {
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  educationGradient: {
    padding: 20,
    borderRadius: 15,
  },
  educationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  educationIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  educationInfo: {
    flex: 1,
  },
  educationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  educationDuration: {
    fontSize: 12,
    color: '#8e8e93',
  },
  educationDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  tipsSection: {
    marginBottom: 30,
  },
  tipsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  tipsIcon: {
    marginBottom: 10,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  articlesSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 8,
  },
  categoryButtonTextActive: {
    fontWeight: 'bold',
    color: '#667eea',
  },
  articleCard: {
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  articleGradient: {
    padding: 20,
    borderRadius: 15,
  },
  articleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  articleIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  articleInfo: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  articleMeta: {
    fontSize: 12,
    color: '#8e8e93',
  },
  bookmarkButton: {
    padding: 5,
  },
  articleExcerpt: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  articleTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tagContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalCloseButton: {
    padding: 10,
  },
  modalBookmarkButton: {
    padding: 10,
  },
  modalContent: {
    flex: 1,
  },
  modalArticleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  modalArticleMeta: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 10,
  },
  modalArticleContent: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
}); 