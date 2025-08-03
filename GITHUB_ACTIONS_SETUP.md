# GitHub Actions AI Article Generation Setup

This guide will help you set up automated AI article generation for your WiseSobriety app using GitHub Actions.

## 🚀 Overview

The system will:
- Generate 8 new recovery articles weekly using OpenAI
- Save articles to your Supabase database
- Update automatically every Monday at 9 AM UTC
- Allow manual triggering from GitHub UI

## 📋 Prerequisites

1. **OpenAI API Key**: Get from [platform.openai.com](https://platform.openai.com)
2. **Supabase Project**: Your existing WiseSobriety project
3. **GitHub Repository**: Your new repository for this feature

## 🔧 Setup Steps

### Step 1: Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Add missing columns to existing articles table
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS source_urls TEXT[] DEFAULT '{}';

-- Create indexes for better performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_publish_date ON articles(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_ai_generated ON articles(ai_generated);

-- Enable Row Level Security (if not already enabled)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policies (if they don't exist)
DROP POLICY IF EXISTS "Allow authenticated users to read articles" ON articles;
CREATE POLICY "Allow authenticated users to read articles" ON articles
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow service role to manage articles" ON articles;
CREATE POLICY "Allow service role to manage articles" ON articles
  FOR ALL USING (auth.role() = 'service_role');
```

### Step 2: GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions

Add these 3 secrets:

1. **`OPENAI_API_KEY`**
   - Value: Your OpenAI API key (starts with `sk-`)

2. **`SUPABASE_URL`**
   - Value: `https://nzmtiwjdtcgzifxygxsa.supabase.co`

3. **`SUPABASE_SERVICE_ROLE_KEY`**
   - Value: Your Supabase service role key (not the anon key)

### Step 3: Push Code

```bash
git add .
git commit -m "Add GitHub Actions AI article generation"
git push origin main
```

### Step 4: Test the Workflow

1. Go to your repository → Actions tab
2. Click "Generate AI Articles" workflow
3. Click "Run workflow" → "Run workflow"
4. Wait 2-3 minutes for completion

## 📊 What Gets Generated

The system generates 8 articles covering:

1. **Brain Healing & Neuroplasticity** (Scientific)
2. **Personal Recovery Stories** (Personal)
3. **Nutrition & Recovery** (Scientific)
4. **Support Networks** (Scientific)
5. **Mindfulness & Meditation** (Scientific)
6. **Relapse Prevention** (Scientific)
7. **Sleep & Recovery** (Scientific)
8. **Exercise & Fitness** (Scientific)

## 🔍 Monitoring

### Check GitHub Actions
- Go to Actions tab to see workflow status
- Click on any run to see detailed logs

### Check Database
```sql
-- View all AI-generated articles
SELECT * FROM articles WHERE ai_generated = true ORDER BY created_at DESC;

-- Count AI articles
SELECT COUNT(*) FROM articles WHERE ai_generated = true;
```

### Test Your App
Your app will automatically fetch new articles from the database!

## 🛠️ Troubleshooting

### Common Issues

**1. "Missing environment variables"**
- Check that all 3 GitHub secrets are set correctly
- Verify the secret names match exactly

**2. "Database connection failed"**
- Check your Supabase URL and service role key
- Verify the database schema is set up correctly

**3. "OpenAI API error"**
- Check your OpenAI API key is valid
- Ensure you have sufficient credits

**4. "No articles generated"**
- Check the workflow logs for specific errors
- Verify the AI prompts are working correctly

### Manual Testing

Run this locally to test:

```bash
# Install dependencies
npm install @supabase/supabase-js dotenv

# Create .env file with your secrets
echo "OPENAI_API_KEY=your_key_here" > .env
echo "SUPABASE_URL=https://nzmtiwjdtcgzifxygxsa.supabase.co" >> .env
echo "SUPABASE_SERVICE_ROLE_KEY=your_service_key_here" >> .env

# Test the script
node scripts/generate-articles.js
```

## 📅 Schedule

- **Automatic**: Every Monday at 9 AM UTC
- **Manual**: Any time via GitHub Actions UI
- **Frequency**: 8 new articles per run

## 🎯 Next Steps

1. ✅ Set up database schema
2. ✅ Add GitHub secrets
3. ✅ Push code to repository
4. ✅ Test workflow manually
5. ✅ Verify articles appear in database
6. ✅ Test your app integration

## 📞 Support

If you encounter issues:
1. Check the workflow logs in GitHub Actions
2. Verify all secrets are set correctly
3. Test the database connection
4. Check OpenAI API status

---

**Happy coding! 🚀** 