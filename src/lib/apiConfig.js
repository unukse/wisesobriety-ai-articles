// API Configuration for Articles Service
// This file manages API settings and endpoints

export const API_CONFIG = {
  // Base URL for your Supabase API
  BASE_URL: 'https://nzmtiwjdtcgzifxygxsa.supabase.co/rest/v1',
  
  // API Key for authentication
  API_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56bXRpd2pkdGNnemlmeHlneHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTUyMzEsImV4cCI6MjA2NzEzMTIzMX0.vJxUHnLPvjBjM7hh3xk4cQlGj-hKrDze12eNk10BzSg',
  
  // API Endpoints
  ENDPOINTS: {
    ARTICLES: '/articles',
    ARTICLES_BY_CATEGORY: '/articles?category=eq.',
    ARTICLES_SEARCH: '/articles?or=(title.ilike.*,excerpt.ilike.*,content.ilike.*)',
    ARTICLES_BY_ID: '/articles?id=eq.',
  },
  
  // Request Headers
  HEADERS: {
    'Content-Type': 'application/json',
    'User-Agent': 'WiseSobriety/1.0',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56bXRpd2pkdGNnemlmeHlneHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTUyMzEsImV4cCI6MjA2NzEzMTIzMX0.vJxUHnLPvjBjM7hh3xk4cQlGj-hKrDze12eNk10BzSg',
  },
  
  // Cache Settings
  CACHE: {
    ARTICLES_KEY: 'cached_articles',
    LAST_UPDATE_KEY: 'articles_last_update',
    UPDATE_INTERVAL_DAYS: 7, // Update weekly
  },
  
  // Error Messages
  ERRORS: {
    NETWORK_ERROR: 'Unable to connect to server. Please check your internet connection.',
    API_ERROR: 'Unable to fetch articles. Please try again later.',
    AUTH_ERROR: 'Authentication failed. Please contact support.',
    CACHE_ERROR: 'Unable to load cached articles.',
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get headers with auth
export const getAuthHeaders = () => {
  return {
    ...API_CONFIG.HEADERS,
    'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
    'apikey': API_CONFIG.API_KEY, // Supabase requires both Authorization and apikey
  };
};

// Helper function to handle API errors
export const handleApiError = (error, status) => {
  console.error('API Error:', error);
  
  switch (status) {
    case 401:
      return API_CONFIG.ERRORS.AUTH_ERROR;
    case 404:
      return 'Articles not found.';
    case 500:
      return API_CONFIG.ERRORS.API_ERROR;
    default:
      return API_CONFIG.ERRORS.NETWORK_ERROR;
  }
};

// Helper function to validate API response
export const validateApiResponse = (data) => {
  if (!data || !Array.isArray(data.articles)) {
    console.error('Invalid API response format:', data);
    return false;
  }
  
  // Validate each article has required fields
  const requiredFields = ['id', 'title', 'excerpt', 'content', 'author', 'category'];
  
  for (const article of data.articles) {
    for (const field of requiredFields) {
      if (!article[field]) {
        console.error(`Article missing required field: ${field}`, article);
        return false;
      }
    }
  }
  
  return true;
}; 