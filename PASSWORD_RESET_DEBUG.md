# Password Reset Debug Guide

## 🚨 Current Issue

You're getting the error: "No reset parameters found. Please check your reset link."

## 🔍 Debugging Steps

### Step 1: Check Supabase Configuration

1. **Verify Supabase URL and Key** in `reset-password.html`:
   ```javascript
   const supabaseUrl = 'https://nzmtiwjdtcgzifxygxsa.supabase.co';
   const supabaseKey = 'your-anon-key-here';
   ```

2. **Get your actual credentials**:
   - Go to your Supabase Dashboard
   - Navigate to **Settings** → **API**
   - Copy your **Project URL** and **anon public** key
   - Update the values in `reset-password.html`

### Step 2: Test Password Reset Flow

1. **Request a password reset** from your app
2. **Check your email** for the reset link
3. **Click the reset link** and check the browser console
4. **Look for these logs**:
   ```
   URL search params: ?access_token=...&refresh_token=...&type=recovery
   URL hash params: #access_token=...&refresh_token=...&type=recovery
   Parsed params: { accessToken: true, refreshToken: true, type: "recovery" }
   ```

### Step 3: Common Issues and Solutions

#### Issue 1: Wrong Supabase Credentials
**Symptoms**: "No reset parameters found" error
**Solution**: Update the Supabase URL and key in `reset-password.html`

#### Issue 2: Incorrect Redirect URL
**Symptoms**: Reset link doesn't work
**Solution**: Check your Supabase dashboard:
1. Go to **Authentication** → **URL Configuration**
2. Verify **Redirect URLs** includes: `https://unukse.github.io/wisesobriety-confirmation/reset-password.html`

#### Issue 3: Email Template Issues
**Symptoms**: Reset email doesn't contain proper link
**Solution**: Check your Supabase dashboard:
1. Go to **Authentication** → **Emails** → **Templates**
2. Click **"Reset password"** tab
3. Verify the template includes the correct redirect URL

### Step 4: Manual Testing

#### Test 1: Direct URL Test
Try accessing the reset page with test parameters:
```
https://unukse.github.io/wisesobriety-confirmation/reset-password.html?access_token=test&refresh_token=test&type=recovery
```

#### Test 2: Console Debugging
Open browser developer tools and check:
1. **Console tab** for error messages
2. **Network tab** for failed requests
3. **Application tab** for stored tokens

### Step 5: Expected URL Format

When you click a password reset link, the URL should look like:
```
https://unukse.github.io/wisesobriety-confirmation/reset-password.html?access_token=eyJ...&refresh_token=eyJ...&type=recovery
```

## 🔧 Quick Fixes

### Fix 1: Update Supabase Credentials
Replace the hardcoded values in `reset-password.html` with your actual credentials.

### Fix 2: Check Redirect URL
Ensure your Supabase dashboard has the correct redirect URL configured.

### Fix 3: Test with Simple Reset
1. Go to your app's "Forgot Password" screen
2. Enter your email
3. Check email for reset link
4. Click the link and check browser console

## 📱 Testing Checklist

- [ ] Supabase credentials are correct in `reset-password.html`
- [ ] Redirect URL is configured in Supabase dashboard
- [ ] Email template includes correct redirect URL
- [ ] Reset link opens the correct page
- [ ] Console shows proper URL parameters
- [ ] Password reset completes successfully

## 🆘 If Still Not Working

1. **Share the console logs** from the browser when you click the reset link
2. **Check the exact URL** that opens when you click the reset link
3. **Verify your Supabase project** is active and accessible

The debug information will help identify the exact issue with the password reset flow. 