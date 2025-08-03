# Deep Link Troubleshooting Guide

## 🚨 Deep Link Not Opening App - Quick Fixes

Since `wisesobriety://reset-password` is not opening your app, let's fix this step by step.

## 🔍 Step 1: Check What You're Using

### Are you using Expo Go?
**If YES:** This is likely the problem! Expo Go has limited deep link support.

**Solution:** Use a development build instead.

### Are you using a development build?
**If NO:** This is the main issue.

## 🚀 Step 2: Create a Development Build

### Option A: Using EAS Build (Recommended)
```bash
# Install EAS CLI if you haven't
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Create a development build
eas build --profile development --platform all
```

### Option B: Using Expo Classic Build
```bash
# Create development build
expo build:development
```

## 📱 Step 3: Install the Development Build

1. **Download the build** from the link provided
2. **Install it on your device**
3. **Test the deep link again**

## 🔧 Step 4: Alternative Testing Methods

### Method 1: Test with Expo CLI
```bash
# Start your app
expo start

# In another terminal, test the deep link
npx uri-scheme open wisesobriety://reset-password --ios
# or
npx uri-scheme open wisesobriety://reset-password --android
```

### Method 2: Test with Simulator/Emulator
```bash
# iOS Simulator
xcrun simctl openurl booted "wisesobriety://reset-password"

# Android Emulator
adb shell am start -W -a android.intent.action.VIEW -d "wisesobriety://reset-password" com.your.package.name
```

### Method 3: Test in Browser
1. **Open your device's browser**
2. **Type:** `wisesobriety://reset-password`
3. **Press Enter**

## 🔍 Step 5: Debug Deep Links

### Add Debug Logging to App.js
Add this to your `App.js` to see if deep links are being received:

```javascript
import { useEffect } from 'react';
import * as Linking from 'expo-linking';

// Add this inside your App component
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

### Check Console Logs
1. **Open your app**
2. **Open developer console**
3. **Test the deep link**
4. **Look for console logs**

## 🎯 Step 6: Verify Configuration

### Check app.json
Make sure your `app.json` has:
```json
{
  "expo": {
    "scheme": "wisesobriety"
  }
}
```

### Check App.js Linking Config
Make sure your `App.js` has:
```javascript
const linking = {
  prefixes: [
    'https://wisesobriety.org',
    'wisesobriety://'
  ],
  config: {
    screens: {
      ResetPassword: 'reset-password',
    },
  },
};
```

## 🚨 Step 7: Common Issues & Solutions

### Issue: "Cannot open app"
**Solution:** 
- Use development build instead of Expo Go
- Make sure app is installed
- Test on physical device

### Issue: Link opens browser
**Solution:**
- Check if app is installed
- Use development build
- Test on physical device

### Issue: App opens but wrong screen
**Solution:**
- Check linking configuration in App.js
- Verify ResetPasswordScreen is in navigation

## 🔧 Step 8: Quick Test Commands

### Test if your app can handle deep links:
```bash
# Install uri-scheme
npm install uri-scheme

# Test deep link
npx uri-scheme open wisesobriety://reset-password
```

### Test with Expo:
```bash
# Start your app
expo start

# In another terminal
npx uri-scheme open wisesobriety://reset-password --ios
```

## 📋 Step 9: Testing Checklist

- [ ] Using development build (not Expo Go)
- [ ] App is installed on device
- [ ] Testing on physical device
- [ ] Console logs show deep link events
- [ ] Manual deep link works
- [ ] Email link opens app

## 🎯 Step 10: If Still Not Working

### Fallback: HTML Page Approach
If deep links continue to fail, temporarily use an HTML page:

1. **Update AuthContext.js:**
```javascript
const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://wisesobriety.org/reset-password.html'
  });
  // ...
};
```

2. **Create reset-password.html** that redirects to your app
3. **Test the HTML page** first

## 🚀 Quick Action Plan

1. **Create a development build** (most likely solution)
2. **Install it on your device**
3. **Test the deep link again**
4. **If it works, test the email link**

**Try creating a development build first - this solves 90% of deep link issues in testing mode!** 🚀 