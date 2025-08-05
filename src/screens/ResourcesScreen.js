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
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

export default function ResourcesScreen({ navigation }) {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch articles from Supabase
  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .order('publish_date', { ascending: false });
      
      if (fetchError) {
        throw fetchError;
      }
      
      setArticles(data || []);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load articles on component mount
  useEffect(() => {
    fetchArticles();
  }, []);

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


          <View style={styles.articlesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recovery Articles</Text>
              <Text style={styles.sectionSubtitle}>Updated weekly with new research and stories</Text>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryContainer}
            >
              {categories.map((category) => (
                <CategoryButton key={category.id} category={category} />
              ))}
            </ScrollView>

            {/* Loading State */}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.loadingText}>Loading articles...</Text>
              </View>
            )}

            {/* Error State */}
            {error && !loading && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
                <Text style={styles.errorTitle}>Failed to Load Articles</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={fetchArticles}
                >
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Empty State */}
            {!loading && !error && filteredArticles.length === 0 && (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text" size={48} color="#ccc" />
                <Text style={styles.emptyTitle}>No Articles Found</Text>
                <Text style={styles.emptyText}>
                  {selectedCategory === 'all' 
                    ? 'No articles are available yet. Check back soon for new content!'
                    : `No ${selectedCategory} articles found. Try selecting a different category.`
                  }
                </Text>
              </View>
            )}

            {/* Articles List */}
            {!loading && !error && filteredArticles.length > 0 && (
              filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            )}
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 10,
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  emptyText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
}); 