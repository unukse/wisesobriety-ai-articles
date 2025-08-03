# Supabase Redirect URL Setup Guide

## 🔍 **The Issue: Missing Access Token**

The "Missing access token" error usually means Supabase isn't configured to redirect to your HTML page properly.

## 🛠️ **Step-by-Step Fix**

### Step 1: Check Supabase Dashboard

1. **Go to your Supabase Dashboard**
2. **Navigate to Authentication → Settings**
3. **Find the "Redirect URLs" section**

### Step 2: Add the Correct Redirect URL

Add this URL to your Supabase redirect URLs:
```
https://unukse.github.io/wisesobriety-confirmation/reset-password.html
```

### Step 3: Verify Email Templates

1. **Go to Authentication → Email Templates**
2. **Click on "Reset password" template**
3. **Check that the template includes the redirect URL**

### Step 4: Test the Configuration

1. **Request a password reset** from your app
2. **Check the email** - the link should look like:
   ```
   https://nzmtiwjdtcgzifxygxsa.supabase.co/auth/v1/verify?token_hash=...&type=recovery&redirect_to=https://unukse.github.io/wisesobriety-confirmation/reset-password.html
   ```

## 🔧 **Common Issues**

### Issue 1: Wrong Redirect URL
- **Problem**: URL doesn't match exactly
- **Solution**: Make sure the URL is exactly: `https://unukse.github.io/wisesobriety-confirmation/reset-password.html`

### Issue 2: Missing Redirect URL
- **Problem**: No redirect URL configured
- **Solution**: Add the URL to Supabase settings

### Issue 3: Email Template Issue
- **Problem**: Email template doesn't include redirect
- **Solution**: Update the email template

### Issue 4: HTTPS vs HTTP
- **Problem**: Mixed HTTP/HTTPS URLs
- **Solution**: Use HTTPS consistently

## 🧪 **Testing Steps**

### Test 1: Manual URL Test
Try this URL to test if the form works:
```
https://unukse.github.io/wisesobriety-confirmation/reset-password.html?access_token=test123&type=recovery
```

### Test 2: Debug Tool
Use the debug tool I created:
```
https://unukse.github.io/wisesobriety-confirmation/test-reset-link.html
```

### Test 3: Check Email Link
1. Request password reset
2. Copy the full email link
3. Open in browser
4. Check console for debugging info

## 📋 **What to Verify**

1. **Supabase Redirect URLs** include the correct URL
2. **Email template** includes the redirect URL
3. **HTTPS** is used consistently
4. **No typos** in the URL

## 🎯 **Expected Email Link Format**

The reset email should contain a link like:
```
https://nzmtiwjdtcgzifxygxsa.supabase.co/auth/v1/verify?token_hash=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...&type=recovery&redirect_to=https://unukse.github.io/wisesobriety-confirmation/reset-password.html
```

When clicked, it should redirect to:
```
https://unukse.github.io/wisesobriety-confirmation/reset-password.html?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...&refresh_token=...&type=recovery
```

## 🚨 **If Still Not Working**

1. **Check Supabase logs** for errors
2. **Verify the HTML page** is accessible
3. **Test with a simple redirect URL** first
4. **Check browser console** for any errors

The most common fix is adding the correct redirect URL to Supabase settings! 