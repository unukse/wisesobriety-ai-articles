# API Key Fix Guide

## 🔍 **The Issue: Invalid API Key**

The error "Invalid API key" occurs because the HTML file is using a placeholder API key instead of the real Supabase anon key.

## 🛠️ **How to Fix This**

### Step 1: Get Your Real Supabase Anon Key

1. **Go to your Supabase Dashboard**
2. **Navigate to Settings → API**
3. **Copy the "anon public" key** (not the service role key)
4. **The key should look like**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56bXRpd2pkdGNnemlmeHhneHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzE5NzAsImV4cCI6MjA1MDU0Nzk3MH0.REAL_KEY_HERE`

### Step 2: Update the HTML File

Replace the placeholder API key in `reset-password.html` with your real anon key.

**Current (placeholder):**
```javascript
'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56bXRpd2pkdGNnemlmeHhneHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzE5NzAsImV4cCI6MjA1MDU0Nzk3MH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'
```

**Replace with your real anon key:**
```javascript
'apikey': 'YOUR_REAL_ANON_KEY_HERE'
```

### Step 3: Test the Fix

1. **Update the API key** in the HTML file
2. **Request a fresh password reset**
3. **Test the password update** functionality

## 📋 **What You Need**

1. **Supabase Project URL**: `https://nzmtiwjdtcgzifxygxsa.supabase.co` ✅
2. **Real Anon Key**: Get this from your Supabase dashboard
3. **Updated HTML File**: Replace placeholder with real key

## 🎯 **Expected Result**

After fixing the API key:
- ✅ "Test API Connection" button should work
- ✅ Password update should succeed
- ✅ No more "Invalid API key" errors

## 🚨 **Security Note**

- **Never share your anon key publicly**
- **The anon key is safe to use in client-side code**
- **It's designed for public use in web applications**

## 🔧 **Quick Fix Steps**

1. **Get your anon key** from Supabase dashboard
2. **Replace the placeholder** in `reset-password.html`
3. **Test the password reset** functionality
4. **Share the result** so we can confirm it works

The anon key is the key to making the password reset work! 🔑 