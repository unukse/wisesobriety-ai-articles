# GitHub Actions AI Articles Setup Guide

This guide will help you set up AI-powered article generation using GitHub Actions instead of Supabase Edge Functions.

## 🎯 **Why GitHub Actions?**

- **Free**: No additional hosting costs
- **Automated**: Runs weekly automatically
- **Simple**: Just a YAML file
- **Reliable**: GitHub's infrastructure
- **Manual trigger**: Can run on-demand too

## 📋 **Prerequisites**

1. **OpenAI API Key**: Get from [openai.com](https://openai.com)
2. **Supabase Project**: Your existing setup
3. **GitHub Repository**: Your project repository

## 🚀 **Step-by-Step Setup**

### **Step 1: Set Up Database Schema**

Run this SQL in your Supabase SQL Editor:

```sql
-- Articles Table Schema for AI-Generated Recovery Articles
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL DEFAULT 'AI Research Assistant',
  category VARCHAR(50) NOT NULL CHECK (category IN ('scientific', 'personal', 'research')),
  read_time VARCHAR(20) NOT NULL,
  publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
  icon VARCHAR(50) NOT NULL DEFAULT 'document',
  color VARCHAR(7) NOT NULL DEFAULT '#667eea',
  tags TEXT[] NOT NULL DEFAULT '{}',
  ai_generated BOOLEAN NOT NULL DEFAULT true,
  source_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_publish_date ON articles(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_ai_generated ON articles(ai_generated);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read articles" ON articles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service role to manage articles" ON articles
  FOR ALL USING (auth.role() = 'service_role');
```

### **Step 2: Add GitHub Secrets**

Go to your GitHub repository → Settings → Secrets and variables → Actions, then add:

1. **`OPENAI_API_KEY`**: Your OpenAI API key (starts with `sk-`)
2. **`SUPABASE_URL`**: Your Supabase project URL
3. **`SUPABASE_SERVICE_ROLE_KEY`**: Your Supabase service role key

### **Step 3: Test Locally (Optional)**

1. **Install dependencies**:
   ```bash
   npm install @supabase/supabase-js dotenv
   ```

2. **Create `.env` file**:
   ```bash
   OPENAI_API_KEY=your_openai_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Test the script**:
   ```bash
   node scripts/generate-articles.js
   ```

### **Step 4: Push to GitHub**

Commit and push your changes:

```bash
git add .
git commit -m "Add AI article generation with GitHub Actions"
git push origin main
```

### **Step 5: Test GitHub Actions**

1. Go to your GitHub repository
2. Click the "Actions" tab
3. You should see the "Generate AI Articles" workflow
4. Click "Run workflow" to test manually

## 🔧 **How It Works**

### **Automatic Schedule**
- Runs every Monday at 9 AM UTC
- Generates 8 new articles covering different recovery topics
- Saves them to your Supabase database

### **Manual Trigger**
- Go to Actions tab in GitHub
- Click "Generate AI Articles"
- Click "Run workflow"
- Articles will be generated immediately

### **Topics Covered**
1. **Brain Recovery & Neuroplasticity** (Scientific)
2. **Personal Recovery Journeys** (Personal Stories)
3. **Nutrition in Recovery** (Scientific)
4. **Mindfulness & Meditation** (Scientific)
5. **Support Networks** (Research)
6. **Exercise & Physical Health** (Scientific)
7. **Sleep & Recovery** (Scientific)
8. **Therapy & Mental Health** (Research)

## 📊 **Monitoring**

### **Check GitHub Actions**
- Go to Actions tab in your repository
- View recent runs and logs
- See success/failure status

### **Check Database**
```sql
-- View recent articles
SELECT * FROM articles ORDER BY created_at DESC LIMIT 10;

-- Check AI-generated articles
SELECT COUNT(*) FROM articles WHERE ai_generated = true;

-- View by category
SELECT category, COUNT(*) FROM articles GROUP BY category;
```

## 🛠️ **Troubleshooting**

### **Common Issues**

1. **GitHub Actions not running**:
   - Check if secrets are set correctly
   - Verify the workflow file is in `.github/workflows/`
   - Check the Actions tab for errors

2. **OpenAI API errors**:
   - Verify your API key is correct
   - Check your OpenAI account has sufficient credits
   - Ensure the API key has the necessary permissions

3. **Database connection issues**:
   - Verify your Supabase URL and service role key
   - Check that RLS policies are correctly set
   - Ensure the articles table exists

4. **Script not found**:
   - Make sure `scripts/generate-articles.js` exists
   - Check the file path in the workflow

### **Debug Commands**

```bash
# Test locally
node scripts/generate-articles.js

# Check GitHub Actions logs
# Go to Actions tab → Click on workflow run → View logs

# Check database
# Run SQL queries in Supabase SQL Editor
```

## 💰 **Cost Considerations**

- **GitHub Actions**: Free for public repos, 2000 minutes/month for private
- **OpenAI API**: ~$0.03-0.06 per article generation
- **Supabase**: Free tier should be sufficient
- **Estimated monthly cost**: $5-15 depending on generation frequency

## 🔒 **Security Notes**

- OpenAI API keys are stored as GitHub secrets (encrypted)
- Supabase credentials are stored as GitHub secrets
- Articles are generated server-side, not in the client
- RLS policies ensure only authenticated users can read articles

## 📈 **Customization**

### **Change Schedule**
Edit the cron expression in `.github/workflows/generate-articles.yml`:
```yaml
schedule:
  - cron: '0 9 * * 1'  # Every Monday at 9 AM UTC
  # Change to: '0 12 * * 1' for 12 PM UTC
```

### **Add More Topics**
Edit the `topics` array in `scripts/generate-articles.js`:
```javascript
const topics = [
  // Add your new topics here
  {
    topic: "your new topic",
    category: "scientific",
    icon: "your-icon",
    color: "#your-color",
    tags: ["tag1", "tag2"]
  }
];
```

### **Change Article Length**
Edit the prompt in `generateSingleArticle()` function to change word count.

## 🎉 **Next Steps**

1. **Test the setup**: Run the workflow manually
2. **Monitor results**: Check your database for new articles
3. **Customize topics**: Add or modify topics as needed
4. **Adjust schedule**: Change the cron schedule if needed
5. **Add notifications**: Consider adding Slack/Discord notifications

## 📞 **Support**

If you encounter issues:
1. Check GitHub Actions logs for detailed error messages
2. Verify all secrets are set correctly
3. Test the script locally first
4. Check the troubleshooting section above

Your AI articles will now be generated automatically every week! 🚀 