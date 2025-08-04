# 🔍 GitHub Secrets Verification Guide

## Step 1: Check Secret Names

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Verify these **exact** secret names exist:
- `OPENAI_API_KEY_ARTICLES`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Step 2: Recreate Secrets

If the values appear empty when editing, recreate them:

### Secret 1: OPENAI_API_KEY_ARTICLES
- **Name**: `OPENAI_API_KEY_ARTICLES`
- **Value**: Your article generation API key (starts with `sk-`)

### Secret 2: SUPABASE_URL
- **Name**: `SUPABASE_URL`
- **Value**: `https://nzmtiwjdtcgzifxygxsa.supabase.co`

### Secret 3: SUPABASE_SERVICE_ROLE_KEY
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: Your Supabase service role key (starts with `eyJ`)

## Step 3: Get Supabase Service Role Key

1. Go to: https://supabase.com/dashboard/project/nzmtiwjdtcgzifxygxsa
2. Navigate to **Settings** → **API**
3. Copy the **service_role** key (not anon key)

## Step 4: Test Workflow

1. Go to repository → **Actions** tab
2. Click **"Generate AI Articles"**
3. Click **"Run workflow"**
4. Monitor the logs for errors

## Common Issues

- **Secret name mismatch**: Make sure it's `OPENAI_API_KEY_ARTICLES` not `OPENAI_API_KEY`
- **Wrong Supabase key**: Use service_role key, not anon key
- **Missing secret**: All 3 secrets must exist 