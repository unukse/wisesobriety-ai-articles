# Supabase Articles API Setup Instructions

Follow these steps to set up your Supabase articles API integration.

## 🚀 **Step 1: Set Up Supabase Database**

### 1.1 Go to Your Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to the **SQL Editor** tab
3. Click **New Query**

### 1.2 Run the SQL Setup
1. Copy the entire content from `SUPABASE_ARTICLES_SETUP.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute the script

This will create:
- ✅ Articles table with all required fields
- ✅ Row Level Security policies
- ✅ Database indexes for performance
- ✅ Sample articles (5 high-quality articles)
- ✅ Automatic timestamp updates

## 🚀 **Step 2: Get Your Supabase Credentials**

### 2.1 Find Your Project URL
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** (looks like: `https://your-project.supabase.co`)

### 2.2 Get Your API Keys
1. In the same **Settings** → **API** section
2. Copy your **anon public** key (starts with `eyJ...`)
3. Keep your **service_role** key private (for admin operations)

## 🚀 **Step 3: Update Your App Configuration**

### 3.1 Update API Configuration
Open `src/lib/apiConfig.js` and replace the placeholder values:

```javascript
export const API_CONFIG = {
  // Replace with your actual Supabase URL
  BASE_URL: 'https://your-project.supabase.co/rest/v1',
  
  // Replace with your actual Supabase anon key
  API_KEY: 'your-actual-anon-key-here',
  
  // ... rest stays the same
};
```

### 3.2 Update Headers
Also update the headers section:

```javascript
HEADERS: {
  'Content-Type': 'application/json',
  'User-Agent': 'WiseSobriety/1.0',
  'apikey': 'your-actual-anon-key-here', // Same as API_KEY
},
```

## 🚀 **Step 4: Test the Integration**

### 4.1 Test API Endpoints
You can test your API endpoints using curl or a tool like Postman:

```bash
# Get all articles
curl -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     "https://your-project.supabase.co/rest/v1/articles"

# Get articles by category
curl -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     "https://your-project.supabase.co/rest/v1/articles?category=eq.scientific"

# Search articles
curl -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     "https://your-project.supabase.co/rest/v1/articles?or=(title.ilike.*recovery*,excerpt.ilike.*recovery*)"
```

### 4.2 Test in Your App
1. Open your app
2. Navigate to the ResourcesScreen
3. Check if articles load from the API
4. Test category filtering
5. Test article reading

## 🚀 **Step 5: Add New Articles (Optional)**

### 5.1 Via Supabase Dashboard
1. Go to **Table Editor** → **articles**
2. Click **Insert Row**
3. Fill in the article details:
   - `title`: Article title
   - `excerpt`: Brief description
   - `content`: Full article content
   - `author`: Author name
   - `category`: 'scientific' or 'personal'
   - `read_time`: '5 min', '8 min', etc.
   - `publish_date`: Date in YYYY-MM-DD format
   - `icon`: Icon name (flask, heart, nutrition, etc.)
   - `color`: Hex color code (#667eea, #fa709a, etc.)
   - `tags`: Array of tags ['tag1', 'tag2']

### 5.2 Via SQL
```sql
INSERT INTO articles (title, excerpt, content, author, category, read_time, publish_date, icon, color, tags) VALUES
(
  'Your Article Title',
  'Your article excerpt...',
  'Your full article content...',
  'Author Name',
  'scientific',
  '6 min',
  '2024-01-20',
  'flask',
  '#667eea',
  ARRAY['tag1', 'tag2']
);
```

## 🚀 **Step 6: Weekly Content Management**

### 6.1 Add New Articles Weekly
1. **Plan Content**: Decide on 1-2 new articles per week
2. **Write Content**: Create high-quality, relevant articles
3. **Add to Database**: Use the Supabase dashboard or SQL
4. **Test**: Verify articles appear in your app

### 6.2 Content Guidelines
- **Scientific Articles**: 800-1500 words, evidence-based
- **Personal Stories**: 600-1200 words, honest and relatable
- **Categories**: scientific, personal
- **Tags**: Use relevant tags for searchability

## 🔧 **Troubleshooting**

### Articles Not Loading
1. **Check API URL**: Verify your Supabase URL is correct
2. **Check API Key**: Ensure your anon key is correct
3. **Check Network**: Test API endpoints with curl
4. **Check Console**: Look for error messages in your app

### API Errors
1. **401 Unauthorized**: Check your API key
2. **404 Not Found**: Check your table name and URL
3. **500 Server Error**: Check your SQL syntax

### App Not Updating
1. **Clear Cache**: The app caches articles for 7 days
2. **Force Refresh**: Restart your app
3. **Check Network**: Ensure internet connection

## 📊 **Monitoring Your API**

### Supabase Dashboard
1. **Database**: Monitor table size and performance
2. **API**: Check request logs and errors
3. **Auth**: Monitor authentication attempts

### App Analytics
Track user engagement with articles:
- Most read articles
- Category preferences
- Reading time
- Bookmark frequency

## 🎯 **Next Steps**

1. **Test the Integration**: Verify everything works
2. **Add More Articles**: Start building your content library
3. **Monitor Performance**: Check API response times
4. **Plan Weekly Updates**: Set up a content calendar
5. **Gather Feedback**: Monitor user engagement

## ✅ **Success Checklist**

- [ ] Articles table created in Supabase
- [ ] Sample articles inserted
- [ ] API configuration updated
- [ ] App successfully loads articles
- [ ] Category filtering works
- [ ] Article reading works
- [ ] Search functionality works
- [ ] Weekly update process planned

Your Supabase articles API is now ready! The app will automatically fetch fresh articles weekly while providing a smooth user experience with offline support. 