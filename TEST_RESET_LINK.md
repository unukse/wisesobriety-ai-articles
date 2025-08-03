# Debug Password Reset Link Issue

## 🔍 **Problem: Missing Access Token**

The `reset-password.html` page is showing "Missing access token" error. This means the access token isn't being found in the URL.

## 🧪 **Debugging Steps**

### Step 1: Test the Reset Link
1. **Request a password reset** from your app
2. **Check your email** for the reset link
3. **Copy the full URL** from the email
4. **Open the URL** in your browser
5. **Click "Debug URL Parameters"** button
6. **Check the console** for detailed information

### Step 2: Check URL Format
The reset link should look like one of these formats:

**Format 1 (Search Parameters):**
```
https://unukse.github.io/wisesobriety-confirmation/reset-password.html?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...&refresh_token=...&type=recovery
```

**Format 2 (Hash Parameters):**
```
https://unukse.github.io/wisesobriety-confirmation/reset-password.html#access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...&refresh_token=...&type=recovery
```

### Step 3: Check Supabase Configuration
1. **Go to Supabase Dashboard**
2. **Navigate to Authentication → Settings**
3. **Check Redirect URLs** - should include:
   ```
   https://unukse.github.io/wisesobriety-confirmation/reset-password.html
   ```

### Step 4: Test with Manual URL
Try accessing the page with a test token:
```
https://unukse.github.io/wisesobriety-confirmation/reset-password.html?access_token=test&type=recovery
```

## 🔧 **Possible Issues**

### Issue 1: Wrong URL Format
- **Problem**: Supabase might be sending tokens in hash instead of search params
- **Solution**: Updated code now checks both locations

### Issue 2: Missing Redirect URL
- **Problem**: Supabase not configured to redirect to your HTML page
- **Solution**: Add the correct redirect URL in Supabase dashboard

### Issue 3: Email Template Issue
- **Problem**: Email template not configured correctly
- **Solution**: Check Supabase email templates

### Issue 4: Token Expiration
- **Problem**: Reset link has expired (1 hour limit)
- **Solution**: Request a new password reset

## 📋 **What to Check**

1. **Email Link Format**: What does the actual reset link look like?
2. **Console Logs**: What parameters are being detected?
3. **Supabase Settings**: Is the redirect URL configured correctly?
4. **Token Validity**: Is the link fresh (less than 1 hour old)?

## 🎯 **Next Steps**

1. **Test the reset link** and click the debug button
2. **Share the debug output** so we can see what's happening
3. **Check Supabase configuration** for redirect URLs
4. **Verify email template** is sending the correct link format

The updated code now handles both URL parameter formats and provides detailed debugging information! 