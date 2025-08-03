# AI Summary Edge Function Setup Guide

## 🚀 Overview

This guide will help you set up the AI summary generation feature using Supabase Edge Functions and OpenAI.

## 📋 Prerequisites

1. ✅ **Supabase CLI** (already installed)
2. ✅ **OpenAI API Key** (you'll need to get this)
3. ✅ **Enhanced check-ins table** (from previous setup)

## 🔧 Step 1: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **Create new secret key**
5. Copy the API key (starts with `sk-`)

**⚠️ Important**: Keep this key secure and never share it publicly.

## 🔧 Step 2: Set Up Supabase Secrets

Run these commands from your project root directory:

```bash
# Set your Supabase project URL and service role key
supabase secrets set SUPABASE_URL=https://nzmtiwjdtcgzifxygxsa.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Set your OpenAI API key
supabase secrets set OPENAI_API_KEY=sk-your-openai-api-key-here
```

### How to get your Service Role Key:

1. Go to your **Supabase Dashboard**
2. Navigate to **Settings** → **API**
3. Copy the **service_role** key (not the anon key)

## 🔧 Step 3: Deploy the Edge Function

From your project root directory:

```bash
# Deploy the function
supabase functions deploy generate-checkin-summary

# Verify deployment
supabase functions list
```

## 🔧 Step 4: Test the Setup

### Test 1: Basic Function Deployment

```bash
# Test the function locally (optional)
supabase functions serve generate-checkin-summary --env-file .env.local
```

### Test 2: End-to-End Test

1. **Start your app**: `npx expo start`
2. **Sign in** to your account
3. **Complete a check-in** with all 7 questions
4. **Check the console logs** for AI summary generation
5. **Verify in Supabase dashboard** that the `ai_summary` column is populated

## 🔧 Step 5: Verify Everything Works

### Check Function Logs

```bash
# View function logs
supabase functions logs generate-checkin-summary
```

### Check Database

1. Go to **Supabase Dashboard** → **Table Editor**
2. Select the `check_ins` table
3. Look for entries with `ai_summary` populated

## 🛠️ Troubleshooting

### Common Issues

#### 1. "Missing required environment variables"
- **Solution**: Make sure all secrets are set correctly
- **Check**: `supabase secrets list`

#### 2. "OpenAI API error"
- **Solution**: Verify your OpenAI API key is valid
- **Check**: Test the key in OpenAI playground

#### 3. "Function not found"
- **Solution**: Redeploy the function
- **Command**: `supabase functions deploy generate-checkin-summary`

#### 4. "Authentication failed"
- **Solution**: Check your service role key
- **Verify**: Use the correct service role key, not anon key

### Debug Steps

1. **Check function logs**:
   ```bash
   supabase functions logs generate-checkin-summary --follow
   ```

2. **Test function directly**:
   ```bash
   curl -X POST https://your-project.supabase.co/functions/v1/generate-checkin-summary \
     -H "Authorization: Bearer your-anon-key" \
     -H "Content-Type: application/json" \
     -d '{"checkInId":"test-id","userId":"test-user"}'
   ```

3. **Verify secrets**:
   ```bash
   supabase secrets list
   ```

## 📊 Expected Behavior

### Successful Flow

1. User completes check-in
2. Data saved to `check_ins` table
3. Edge Function called automatically
4. OpenAI generates compassionate summary
5. Summary saved back to database
6. User sees success message

### Sample AI Summary

```
I can see you're navigating some challenging emotions today, and I want to acknowledge the strength it takes to be honest about feeling anxious while also recognizing moments of calm. Your commitment to staying sober is evident in your choice to reach out to your sponsor, even when it wasn't easy - that's real progress.

You're using some excellent coping strategies, particularly exercise and talking to someone. These are powerful tools in your recovery toolkit. The fact that you're aware of your triggers (stress and loneliness) shows great self-awareness, which is crucial for long-term success.

Your motivation level of 8/10 is strong, and your request for more structure in your morning routine shows proactive thinking. Consider setting up a simple morning ritual that gives you a sense of control and purpose. Remember, every day you choose sobriety is a victory worth celebrating.
```

## 🔒 Security Notes

- ✅ API keys are stored securely in Supabase secrets
- ✅ Function uses service role key for database access
- ✅ User authentication verified before processing
- ✅ CORS headers configured for web access
- ✅ Error handling prevents data exposure

## 🎉 Next Steps

Once the AI summary is working:

1. **Create a summary display screen** to show AI insights
2. **Add summary history** to track progress over time
3. **Implement summary sharing** features
4. **Add summary analytics** for recovery insights

## 💰 Cost Considerations

- **OpenAI API**: ~$0.002 per summary (GPT-3.5-turbo)
- **Supabase Edge Functions**: Free tier includes 500,000 invocations/month
- **Estimated monthly cost**: ~$5-10 for 1000 users

Your AI summary system is now ready! 🚀 