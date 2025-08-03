# API Backend Example for Articles Feature

This document provides an example implementation of the API backend needed for the articles feature.

## Backend Technology Stack

**Recommended Stack:**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB or PostgreSQL
- **Authentication**: JWT tokens
- **Hosting**: Vercel, Heroku, or AWS

## API Endpoints Required

### 1. GET /articles
Returns all articles with optional pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Articles per page (default: 10)
- `category` (optional): Filter by category
- `search` (optional): Search in title, excerpt, content

**Response Format:**
```json
{
  "articles": [
    {
      "id": 1,
      "title": "The Science of Alcohol Recovery",
      "excerpt": "Recent studies reveal the neurobiological changes...",
      "content": "The journey to recovery from alcohol addiction...",
      "author": "Dr. Sarah Johnson",
      "category": "scientific",
      "readTime": "8 min",
      "publishDate": "2024-01-15",
      "icon": "flask",
      "color": "#667eea",
      "tags": ["research", "neuroscience", "recovery"],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### 2. GET /articles/:id
Returns a specific article by ID.

**Response Format:**
```json
{
  "article": {
    "id": 1,
    "title": "The Science of Alcohol Recovery",
    "excerpt": "Recent studies reveal the neurobiological changes...",
    "content": "The journey to recovery from alcohol addiction...",
    "author": "Dr. Sarah Johnson",
    "category": "scientific",
    "readTime": "8 min",
    "publishDate": "2024-01-15",
    "icon": "flask",
    "color": "#667eea",
    "tags": ["research", "neuroscience", "recovery"],
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

## Node.js/Express Implementation

### Project Structure
```
backend/
├── package.json
├── server.js
├── config/
│   └── database.js
├── models/
│   └── Article.js
├── routes/
│   └── articles.js
├── middleware/
│   ├── auth.js
│   └── validation.js
└── controllers/
    └── articleController.js
```

### 1. Package.json
```json
{
  "name": "wisesobriety-api",
  "version": "1.0.0",
  "description": "API for WiseSobriety articles feature",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.10.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### 2. Server.js
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/articles', require('./routes/articles'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3. Database Configuration (config/database.js)
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 4. Article Model (models/Article.js)
```javascript
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['scientific', 'personal'],
    default: 'scientific'
  },
  readTime: {
    type: String,
    required: true,
    default: '5 min'
  },
  publishDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  icon: {
    type: String,
    required: true,
    default: 'document'
  },
  color: {
    type: String,
    required: true,
    default: '#667eea'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublished: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search
articleSchema.index({ 
  title: 'text', 
  excerpt: 'text', 
  content: 'text',
  tags: 'text'
});

// Virtual for formatted publish date
articleSchema.virtual('formattedPublishDate').get(function() {
  return this.publishDate.toISOString().split('T')[0];
});

module.exports = mongoose.model('Article', articleSchema);
```

### 5. Authentication Middleware (middleware/auth.js)
```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
```

### 6. Article Controller (controllers/articleController.js)
```javascript
const Article = require('../models/Article');

// Get all articles with filtering and pagination
const getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    
    // Build query
    let query = { isPublished: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    // Execute query with pagination
    const articles = await Article.find(query)
      .sort({ publishDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    // Get total count
    const total = await Article.countDocuments(query);
    
    // Calculate pagination info
    const pages = Math.ceil(total / limit);
    
    res.json({
      articles: articles.map(article => ({
        id: article._id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        category: article.category,
        readTime: article.readTime,
        publishDate: article.formattedPublishDate,
        icon: article.icon,
        color: article.color,
        tags: article.tags,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages
      }
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

// Get article by ID
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json({
      article: {
        id: article._id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        category: article.category,
        readTime: article.readTime,
        publishDate: article.formattedPublishDate,
        icon: article.icon,
        color: article.color,
        tags: article.tags,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
};

// Create new article (admin only)
const createArticle = async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    
    res.status(201).json({
      message: 'Article created successfully',
      article: {
        id: article._id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        category: article.category,
        readTime: article.readTime,
        publishDate: article.formattedPublishDate,
        icon: article.icon,
        color: article.color,
        tags: article.tags
      }
    });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(400).json({ error: 'Failed to create article' });
  }
};

// Update article (admin only)
const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json({
      message: 'Article updated successfully',
      article: {
        id: article._id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        category: article.category,
        readTime: article.readTime,
        publishDate: article.formattedPublishDate,
        icon: article.icon,
        color: article.color,
        tags: article.tags
      }
    });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(400).json({ error: 'Failed to update article' });
  }
};

// Delete article (admin only)
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
};
```

### 7. Article Routes (routes/articles.js)
```javascript
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
} = require('../controllers/articleController');

// Public routes
router.get('/', getArticles);
router.get('/:id', getArticleById);

// Protected routes (admin only)
router.post('/', authenticateToken, createArticle);
router.put('/:id', authenticateToken, updateArticle);
router.delete('/:id', authenticateToken, deleteArticle);

module.exports = router;
```

## Environment Variables (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/wisesobriety
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

## Database Setup

### MongoDB Setup
```bash
# Install MongoDB
brew install mongodb-community  # macOS
sudo apt-get install mongodb   # Ubuntu

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongodb          # Ubuntu

# Create database
mongo
use wisesobriety
```

### PostgreSQL Setup (Alternative)
```sql
-- Create database
CREATE DATABASE wisesobriety;

-- Create articles table
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('scientific', 'personal')),
  read_time VARCHAR(20) NOT NULL DEFAULT '5 min',
  publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
  icon VARCHAR(50) NOT NULL DEFAULT 'document',
  color VARCHAR(7) NOT NULL DEFAULT '#667eea',
  tags TEXT[],
  is_published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_publish_date ON articles(publish_date);
CREATE INDEX idx_articles_search ON articles USING gin(to_tsvector('english', title || ' ' || excerpt || ' ' || content));
```

## Deployment Options

### 1. Vercel (Recommended for simplicity)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 2. Heroku
```bash
# Install Heroku CLI
# Create app
heroku create wisesobriety-api

# Add MongoDB addon
heroku addons:create mongolab

# Deploy
git push heroku main
```

### 3. AWS (Advanced)
- Use AWS Lambda with API Gateway
- Store data in DynamoDB
- Use AWS RDS for PostgreSQL

## Testing the API

### Test with curl
```bash
# Get all articles
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://your-api.com/api/articles

# Get articles by category
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://your-api.com/api/articles?category=scientific

# Search articles
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://your-api.com/api/articles?search=recovery

# Get specific article
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://your-api.com/api/articles/ARTICLE_ID
```

### Test with Postman
1. Create a new collection
2. Add requests for each endpoint
3. Set Authorization header with your API key
4. Test all endpoints

## Security Considerations

1. **Rate Limiting**: Implemented to prevent abuse
2. **CORS**: Configured for your app domain
3. **Helmet**: Security headers
4. **Input Validation**: Validate all inputs
5. **Authentication**: JWT token validation
6. **HTTPS**: Always use HTTPS in production

## Monitoring and Analytics

### Add logging
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log API requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});
```

This backend implementation provides a solid foundation for your articles API with proper authentication, validation, and error handling. 