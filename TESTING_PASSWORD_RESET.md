# Password Reset Testing Guide

## 🧪 Systematic Testing Approach

Use this guide to test your password reset flow step by step.

## 📋 Pre-Testing Checklist

Before you start testing, verify these configurations:

### ✅ App Configuration
- [ ] `app.json` has `"scheme": "wisesobriety"`
- [ ] `ResetPasswordScreen` is in navigation stack
- [ ] Deep link routing is configured in `App.js`

### ✅ Supabase Configuration
- [ ] Site URL: `https://nzmtiwjdtcgzifxygxsa.supabase.co`
- [ ] Redirect URLs include: `wisesobriety://reset-password`
- [ ] Resend SMTP is configured (if using Resend)

### ✅ Development Setup
- [ ] App is installed on test device
- [ ] Using actual device (not simulator)
- [ ] Console logs are visible

## 🧪 Test 1: Manual Deep Link Test

**Purpose:** Verify your app can handle deep links

### Steps:
1. **Open your device's browser**
2. **Type this URL:** `wisesobriety://reset-password`
3. **Press Enter**
4. **Expected Result:** App should open and navigate to ResetPasswordScreen

### If Test 1 Fails:
- Check `app.json` scheme configuration
- Verify app is installed
- Try reinstalling the app

## 🧪 Test 2: Email Request Test

**Purpose:** Verify password reset email is sent

### Steps:
1. **Open your app**
2. **Go to ForgotPasswordScreen**
3. **Enter a test email address**
4. **Click "Send Reset Link"**
5. **Check for success message**
6. **Check email inbox (and spam folder)**

### Expected Results:
- ✅ Success message appears
- ✅ Email is received within 1-2 minutes
- ✅ Email contains a reset link

### If Test 2 Fails:
- Check Supabase configuration
- Verify email provider settings
- Check console for errors

## 🧪 Test 3: Email Link Format Test

**Purpose:** Verify the email link format is correct

### Steps:
1. **Open the password reset email**
2. **Examine the reset link**
3. **Copy the full link**

### Expected Link Format:
```
https://nzmtiwjdtcgzifxygxsa.supabase.co/auth/v1/verify?token_hash=...&type=recovery&redirect_to=wisesobriety://reset-password
```

### If Test 3 Fails:
- Check Supabase redirect URL configuration
- Verify AuthContext.js redirectTo setting

## 🧪 Test 4: Deep Link Click Test

**Purpose:** Verify clicking the email link opens your app

### Steps:
1. **Click the reset link in the email**
2. **Observe what happens**

### Expected Results:
- ✅ App opens automatically
- ✅ App navigates to ResetPasswordScreen
- ✅ No error messages

### If Test 4 Fails:
- Try copying link and pasting in browser
- Check if app is installed
- Test on different email clients

## 🧪 Test 5: Token Validation Test

**Purpose:** Verify the app can handle the reset tokens

### Steps:
1. **App should open ResetPasswordScreen**
2. **Check if screen shows loading state**
3. **Wait for token validation**
4. **Observe the result**

### Expected Results:
- ✅ Screen shows "Validating reset link..."
- ✅ Then shows password input fields
- ✅ No "Missing access token" error

### If Test 5 Fails:
- Check ResetPasswordScreen token validation logic
- Verify Supabase session handling
- Check console for errors

## 🧪 Test 6: Password Update Test

**Purpose:** Verify user can set a new password

### Steps:
1. **Enter a new password** (at least 6 characters)
2. **Confirm the password**
3. **Click "Update Password"**
4. **Wait for the result**

### Expected Results:
- ✅ Password is updated successfully
- ✅ Success message appears
- ✅ User is redirected to sign in

### If Test 6 Fails:
- Check password requirements
- Verify Supabase updateUser call
- Check console for errors

## 🧪 Test 7: Sign In Test

**Purpose:** Verify the new password works

### Steps:
1. **Go to sign in screen**
2. **Enter your email**
3. **Enter the new password**
4. **Click "Sign In"**

### Expected Results:
- ✅ Sign in is successful
- ✅ User is logged in
- ✅ App navigates to main screen

## 🔧 Debugging During Testing

### Add Console Logging
Add this to your ResetPasswordScreen for debugging:

```javascript
useEffect(() => {
  console.log('🔍 ResetPasswordScreen mounted');
  console.log('🔍 URL:', window.location.href);
  console.log('🔍 Hash:', window.location.hash);
  
  const checkAccessToken = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('🔍 Session:', session ? 'Present' : 'Missing');
      console.log('🔍 Error:', error);
      
      if (error || !session) {
        console.log('❌ No valid session found');
        setError('Invalid or expired reset link. Please request a new password reset.');
        setProcessing(false);
        return;
      }
      
      console.log('✅ Valid session found');
      setProcessing(false);
    } catch (error) {
      console.log('❌ Error checking session:', error);
      setError('Failed to validate reset link. Please try again.');
      setProcessing(false);
    }
  };

  checkAccessToken();
}, []);
```

### Check Supabase Logs
1. Go to Supabase Dashboard
2. Navigate to Authentication → Logs
3. Look for password reset events
4. Check for any errors

## 📊 Test Results Tracker

| Test | Status | Notes |
|------|--------|-------|
| Manual Deep Link | ⬜ Pass / ⬜ Fail | |
| Email Request | ⬜ Pass / ⬜ Fail | |
| Email Link Format | ⬜ Pass / ⬜ Fail | |
| Deep Link Click | ⬜ Pass / ⬜ Fail | |
| Token Validation | ⬜ Pass / ⬜ Fail | |
| Password Update | ⬜ Pass / ⬜ Fail | |
| Sign In | ⬜ Pass / ⬜ Fail | |

## 🚨 Common Issues & Quick Fixes

### Issue: "App doesn't open"
**Quick Fix:** Test manual deep link first

### Issue: "Missing access token"
**Quick Fix:** Check Supabase redirect URLs

### Issue: "Email not received"
**Quick Fix:** Check spam folder and Supabase email settings

### Issue: "Link format wrong"
**Quick Fix:** Verify AuthContext.js redirectTo setting

## 🎯 Testing Tips

1. **Test on real device** (not simulator)
2. **Use different email clients** (Gmail, Outlook, etc.)
3. **Test on both iOS and Android**
4. **Check console logs** for detailed error info
5. **Test with fresh reset links** (don't reuse old ones)

## ✅ Success Criteria

Your password reset flow is working correctly when:
- ✅ Manual deep link opens app
- ✅ Email is sent successfully
- ✅ Email link format is correct
- ✅ Clicking link opens app
- ✅ App shows ResetPasswordScreen
- ✅ User can set new password
- ✅ New password works for sign in

Use this guide to systematically test and debug your password reset flow! 🧪 