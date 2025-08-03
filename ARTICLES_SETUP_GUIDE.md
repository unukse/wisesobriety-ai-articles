# Recovery Articles Feature Setup Guide

This guide explains how to set up the weekly articles feature for your sobriety app, including API integration and content management.

## Overview

The articles feature provides users with:
- **Scientific research** about alcohol recovery and addiction
- **Personal stories** from people in recovery
- **Weekly updates** with fresh content
- **Bookmarking** functionality for favorite articles
- **Category filtering** (Scientific Research, Personal Stories)
- **Full-screen article reader** with rich formatting

## Current Implementation

### ✅ What's Already Working

1. **Articles Display**: Articles are shown in the ResourcesScreen with beautiful cards
2. **Article Reader**: Full-screen modal for reading articles
3. **Category Filtering**: Filter by "All Articles", "Scientific Research", or "Personal Stories"
4. **Bookmarking**: Users can bookmark articles (stored locally)
5. **Fallback Content**: 5 high-quality articles are included as fallback content

### 📱 Features Included

- **Article Cards**: Beautiful cards with title, excerpt, author, read time, and tags
- **Category Buttons**: Easy filtering between different types of content
- **Article Modal**: Full-screen reader with proper formatting
- **Bookmark Toggle**: Save favorite articles for later reading
- **Responsive Design**: Works on all screen sizes

## Setting Up Weekly Updates

### Option 1: Simple Content Management (Recommended for Start)

For a simple setup without a backend, you can manually update articles:

1. **Edit the Articles Service**:
   - Open `src/lib/articlesService.js`
   - Update the `getFallbackArticles()` method with new content
   - Add new articles to the array

2. **Update Weekly**:
   - Add 1-2 new articles per week
   - Update existing articles with fresh content
   - Rotate content to keep it fresh

### Option 2: API Integration (Advanced)

For automatic weekly updates, set up an API:

#### Backend API Requirements

Your API should return articles in this format:

```json
{
  "articles": [
    {
      "id": 1,
      "title": "Article Title",
      "excerpt": "Brief description",
      "content": "Full article content with markdown formatting",
      "author": "Author Name",
      "category": "scientific|personal",
      "readTime": "5 min",
      "publishDate": "2024-01-15",
      "icon": "flask",
      "color": "#667eea",
      "tags": ["recovery", "research"]
    }
  ]
}
```

#### API Endpoints Needed

1. **GET /articles** - Returns all articles
2. **GET /articles?category=scientific** - Filter by category
3. **GET /articles?search=keyword** - Search articles

#### Update the Service

1. **Replace the API URL**:
   ```javascript
   // In src/lib/articlesService.js
   this.baseUrl = 'https://your-actual-api.com';
   ```

2. **Add Authentication** (if needed):
   ```javascript
   const response = await fetch(`${this.baseUrl}/articles`, {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': 'Bearer YOUR_API_KEY'
     },
   });
   ```

### Option 3: Content Management System (CMS)

For professional content management:

1. **Use a Headless CMS** like:
   - Strapi (free, self-hosted)
   - Contentful
   - Sanity
   - WordPress with REST API

2. **Set up webhooks** to trigger app updates when content changes

3. **Configure automatic publishing** for weekly content

## Content Guidelines

### Article Types

#### Scientific Research Articles
- **Length**: 800-1500 words
- **Topics**: Neuroscience, psychology, medical research
- **Tone**: Educational, evidence-based
- **Structure**: Introduction, research findings, practical implications

#### Personal Stories
- **Length**: 600-1200 words
- **Topics**: Recovery journeys, challenges, victories
- **Tone**: Honest, inspiring, relatable
- **Structure**: Personal narrative with lessons learned

### Content Categories

1. **Neuroscience & Brain Recovery**
   - How the brain heals from alcohol damage
   - Neuroplasticity in recovery
   - Cognitive improvements over time

2. **Mental Health & Recovery**
   - Depression and anxiety in recovery
   - Trauma and addiction
   - Building healthy coping mechanisms

3. **Physical Health**
   - Nutrition in recovery
   - Exercise and wellness
   - Sleep improvement

4. **Relationships & Social Support**
   - Rebuilding relationships
   - Setting boundaries
   - Building support networks

5. **Practical Recovery Skills**
   - Mindfulness and meditation
   - Stress management
   - Relapse prevention

6. **Personal Stories**
   - First year of sobriety
   - Overcoming specific challenges
   - Long-term recovery success

### Content Quality Standards

- **Evidence-based**: Cite research when possible
- **Inclusive**: Represent diverse experiences
- **Hopeful**: Focus on recovery and growth
- **Practical**: Provide actionable advice
- **Respectful**: Avoid judgmental language

## Weekly Update Process

### Manual Updates (Simple)

1. **Weekly Content Review**:
   - Review current articles for relevance
   - Identify gaps in content
   - Plan new articles

2. **Content Creation**:
   - Write 1-2 new articles per week
   - Edit existing articles for freshness
   - Ensure content quality

3. **App Update**:
   - Update `articlesService.js` with new content
   - Test the app to ensure articles display correctly
   - Deploy the updated app

### Automated Updates (Advanced)

1. **Content Calendar**:
   - Plan content 4-6 weeks ahead
   - Schedule publishing dates
   - Coordinate with recovery experts

2. **API Management**:
   - Set up content publishing workflow
   - Configure automatic updates
   - Monitor API performance

3. **Quality Assurance**:
   - Review content before publishing
   - Test article display in app
   - Monitor user engagement

## Technical Implementation

### Current File Structure

```
src/
├── lib/
│   └── articlesService.js    # Article management service
└── screens/
    └── ResourcesScreen.js    # Articles display and reader
```

### Key Components

1. **ArticlesService**: Handles fetching, caching, and managing articles
2. **Article Cards**: Display article previews with metadata
3. **Article Modal**: Full-screen reader with rich formatting
4. **Category Filtering**: Filter articles by type
5. **Bookmarking**: Save favorite articles locally

### Caching Strategy

- **Local Storage**: Articles cached using AsyncStorage
- **Weekly Updates**: Check for new content every 7 days
- **Offline Support**: Fallback articles available when offline
- **Performance**: Fast loading with cached content

## Content Sources

### Scientific Research Sources

1. **Academic Journals**:
   - Journal of Substance Abuse Treatment
   - Addiction Science & Clinical Practice
   - Alcohol Research: Current Reviews

2. **Research Organizations**:
   - National Institute on Alcohol Abuse and Alcoholism (NIAAA)
   - Substance Abuse and Mental Health Services Administration (SAMHSA)
   - World Health Organization (WHO)

3. **Medical Sources**:
   - Mayo Clinic
   - Cleveland Clinic
   - Harvard Health

### Personal Story Sources

1. **Recovery Communities**:
   - Reddit r/stopdrinking
   - Sober Grid
   - Recovery blogs

2. **Professional Writers**:
   - Recovery memoirs
   - Addiction recovery blogs
   - Mental health writers

## Analytics & Engagement

### Track User Engagement

1. **Article Metrics**:
   - Most read articles
   - Average reading time
   - Bookmark frequency
   - Category preferences

2. **User Feedback**:
   - Article ratings
   - User comments
   - Content requests

### Content Optimization

1. **A/B Testing**:
   - Test different article formats
   - Optimize headlines
   - Improve readability

2. **User Surveys**:
   - Content preferences
   - Topic requests
   - Reading habits

## Legal & Ethical Considerations

### Content Guidelines

1. **Medical Disclaimer**: Include appropriate disclaimers
2. **Professional Review**: Have medical professionals review scientific content
3. **Privacy**: Protect personal story anonymity
4. **Accuracy**: Fact-check all scientific claims

### Copyright & Permissions

1. **Original Content**: Write original articles when possible
2. **Proper Attribution**: Credit sources and authors
3. **Permissions**: Get permission for republished content
4. **Fair Use**: Follow fair use guidelines for quotes

## Maintenance & Updates

### Regular Tasks

1. **Weekly**:
   - Add new articles
   - Review user engagement
   - Update content calendar

2. **Monthly**:
   - Analyze performance metrics
   - Plan content strategy
   - Update outdated articles

3. **Quarterly**:
   - Review content quality
   - Update technical infrastructure
   - Plan feature improvements

### Troubleshooting

1. **Articles Not Loading**:
   - Check API connectivity
   - Verify fallback content
   - Test AsyncStorage

2. **Content Not Updating**:
   - Check update frequency settings
   - Verify API responses
   - Clear app cache

3. **Performance Issues**:
   - Optimize article loading
   - Implement pagination
   - Reduce bundle size

## Next Steps

1. **Start Simple**: Begin with manual content updates
2. **Gather Feedback**: Monitor user engagement
3. **Scale Gradually**: Add automation as needed
4. **Build Community**: Encourage user-generated content
5. **Expand Features**: Add search, comments, sharing

This articles feature will provide valuable, up-to-date content to support your users' recovery journeys while keeping them engaged with fresh, relevant information. 