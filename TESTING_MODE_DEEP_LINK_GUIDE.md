# Testing Mode Deep Link Guide

## 🧪 Testing Your Password Reset Deep Links

Since you're in testing mode, here's how to ensure your password reset links navigate to your app instead of just opening in a browser.

## ✅ Your Current Setup Looks Good

I can see your app is properly configured:

### ✅ App Configuration
- **URL Scheme:** `wisesobriety://` ✅
- **Deep Link Routing:** Configured in `App.js` ✅
- **ResetPasswordScreen:** Added to navigation ✅

## 🧪 Testing Steps for Deep Links

### Step 1: Test Manual Deep Link First

**Purpose:** Verify your app can handle deep links in testing mode

1. **Open your device's browser**
2. **Type:** `wisesobriety://reset-password`
3. **Press Enter**
4. **Expected Result:** Your app should open and show ResetPasswordScreen

**If this fails:**
- Make sure your app is installed on the test device
- Try reinstalling the app
- Check if you're using Expo Go (deep links work better with development builds)

### Step 2: Test Email Deep Link

**Purpose:** Verify the password reset email link opens your app

1. **Request a password reset** from your app
2. **Check your email** for the reset link
3. **Click the link** in the email
4. **Expected Result:** App should open automatically

## 🔧 Troubleshooting for Testing Mode

### Issue: Link Opens Browser Instead of App

**Quick Fixes:**

#### A. Check App Installation
```bash
# Make sure your app is installed and running
expo start --dev-client
```

#### B. Test with Expo Development Build
Deep links work better with development builds than Expo Go:

```bash
# Create a development build
expo build:development

# Or use EAS Build
eas build --profile development
```

#### C. Verify URL Scheme
Your `app.json` has the correct scheme:
```json
{
  "expo": {
    "scheme": "wisesobriety"
  }
}
```

### Issue: App Opens But Wrong Screen

**Check your linking configuration in `App.js`:**
```javascript
const linking = {
  prefixes: [
    'https://wisesobriety.org',
    'wisesobriety://'
  ],
  config: {
    screens: {
      ResetPassword: 'reset-password', // ✅ This should be here
    },
  },
};
```

### Issue: "Cannot Open App" Error

**Solutions:**
1. **Reinstall the app** on your test device
2. **Use a development build** instead of Expo Go
3. **Test on a physical device** (not simulator)

## 🧪 Testing Commands

### Test Deep Link Manually
```bash
# On iOS Simulator
xcrun simctl openurl booted "wisesobriety://reset-password"

# On Android Emulator
adb shell am start -W -a android.intent.action.VIEW -d "wisesobriety://reset-password" com.your.package.name
```

### Test with Expo
```bash
# Start your app
expo start

# Then test the deep link in browser or email
```

## 📱 Testing on Different Platforms

### iOS Testing
- **Simulator:** Deep links work well
- **Physical Device:** Best for testing
- **Email Apps:** Gmail, Mail app work well

### Android Testing
- **Emulator:** Deep links work well
- **Physical Device:** Best for testing
- **Email Apps:** Gmail, Outlook work well

## 🔍 Debug Deep Links

### Add Console Logging
Add this to your `App.js` to debug deep links:

```javascript
// Add this near the top of your App component
useEffect(() => {
  const handleDeepLink = (url) => {
    console.log('🔗 Deep link received:', url);
  };

  const subscription = Linking.addEventListener('url', handleDeepLink);
  
  // Check initial URL
  Linking.getInitialURL().then((url) => {
    if (url) {
      console.log('🔗 Initial URL:', url);
    }
  });

  return () => subscription?.remove();
}, []);
```

### Check Supabase Configuration
Make sure your Supabase redirect URLs include:
```
wisesobriety://reset-password
```

## 🚀 Quick Testing Checklist

- [ ] App is installed on test device
- [ ] Using development build (not Expo Go)
- [ ] Manual deep link works: `wisesobriety://reset-password`
- [ ] Email reset link opens app
- [ ] App shows ResetPasswordScreen
- [ ] No "Cannot open app" errors

## 🎯 Testing Tips for Development

1. **Use a development build** for better deep link support
2. **Test on physical devices** when possible
3. **Check console logs** for deep link events
4. **Test with fresh reset links** (don't reuse old ones)
5. **Try different email clients** (Gmail, Outlook, etc.)

## 🔧 If Deep Links Still Don't Work

### Fallback: HTML Page Approach
If deep links continue to fail, you can temporarily use an HTML page approach:

1. **Update AuthContext.js:**
```javascript
const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://wisesobriety.org/reset-password.html'
  });
  // ...
};
```

2. **Create a simple HTML page** that redirects to your app
3. **Test the HTML page** first, then implement deep links

## ✅ Success Criteria for Testing Mode

Your deep links are working when:
- ✅ Manual deep link opens app
- ✅ Email reset link opens app
- ✅ App shows ResetPasswordScreen
- ✅ No browser fallback needed

**Start with Step 1 (Manual Deep Link Test) and let me know what happens!** 🧪 