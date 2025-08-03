# Password Reset Link Troubleshooting

## 🔍 Quick Diagnosis

Let's identify what's happening when you click the password reset link:

### What should happen:
1. Click email link → App opens → ResetPasswordScreen
2. User sets new password → Success → Sign in

### What might be happening:
- ❌ App doesn't open at all
- ❌ App opens but shows error
- ❌ App opens but wrong screen
- ❌ Link doesn't work in email

## 🚨 Common Issues & Solutions

### Issue 1: App Doesn't Open When Clicking Link

**Symptoms:**
- Clicking link does nothing
- Link opens browser instead of app
- "Cannot open app" error

**Solutions:**

#### A. Check URL Scheme Configuration
Verify your `app.json` has the correct scheme:
```json
{
  "expo": {
    "scheme": "wisesobriety"
  }
}
```

#### B. Test Deep Link Manually
Try opening this URL manually in your device:
```
wisesobriety://reset-password
```

#### C. Check App Installation
- Ensure the app is installed on the device
- Try reinstalling the app
- Test on both iOS and Android

#### D. Email Client Issues
Some email clients block deep links. Try:
- Copy the link and paste in browser
- Use different email client
- Test on mobile vs desktop

### Issue 2: App Opens But Shows Error

**Symptoms:**
- App opens but shows "Missing access token"
- App opens but shows "Invalid reset link"
- App opens but crashes

**Solutions:**

#### A. Check Supabase Redirect URLs
Verify in Supabase Dashboard → Authentication → Settings:
```
wisesobriety://reset-password
```

#### B. Check ResetPasswordScreen Logic
The screen should handle missing tokens gracefully. Check:
- Token validation logic
- Error handling
- User feedback

#### C. Test with Valid Token
The issue might be that the link is expired or invalid. Try:
- Request a new password reset
- Check email immediately
- Click link within 24 hours

### Issue 3: App Opens But Wrong Screen

**Symptoms:**
- App opens but goes to wrong screen
- Navigation doesn't work properly
- Deep link routing fails

**Solutions:**

#### A. Check Navigation Configuration
Verify in `App.js`:
```javascript
const linking = {
  prefixes: ['wisesobriety://'],
  config: {
    screens: {
      ResetPassword: 'reset-password',
    },
  },
};
```

#### B. Check Screen Registration
Verify `ResetPasswordScreen` is in the stack:
```javascript
<Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
```

### Issue 4: Link Format Issues

**Symptoms:**
- Link looks wrong in email
- Link has extra parameters
- Link is truncated

**Solutions:**

#### A. Check Email Template
The reset email should contain a link like:
```
https://nzmtiwjdtcgzifxygxsa.supabase.co/auth/v1/verify?token_hash=...&type=recovery&redirect_to=wisesobriety://reset-password
```

#### B. Check Supabase Configuration
Verify in AuthContext.js:
```javascript
const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'wisesobriety://reset-password'
  });
  // ...
};
```

## 🧪 Step-by-Step Testing

### Test 1: Manual Deep Link
1. Open your device's browser
2. Type: `wisesobriety://reset-password`
3. Press Enter
4. Should open your app

### Test 2: Email Link Test
1. Request password reset
2. Check email immediately
3. Copy the full link
4. Paste in browser
5. Should redirect to your app

### Test 3: App State Test
1. Open your app
2. Go to ForgotPasswordScreen
3. Request reset
4. Check if app stays open
5. Check console for errors

### Test 4: Token Validation Test
1. Click reset link
2. App should open ResetPasswordScreen
3. Check if tokens are present
4. Try setting new password

## 🔧 Debugging Steps

### Step 1: Check Console Logs
Add logging to your ResetPasswordScreen:
```javascript
useEffect(() => {
  console.log('ResetPasswordScreen mounted');
  console.log('URL:', window.location.href);
  console.log('Hash:', window.location.hash);
}, []);
```

### Step 2: Check Supabase Logs
1. Go to Supabase Dashboard
2. Check Authentication → Logs
3. Look for password reset events
4. Check for any errors

### Step 3: Test Email Delivery
1. Check if email is being sent
2. Check spam folder
3. Verify email content
4. Test with different email providers

### Step 4: Verify Configuration
1. Check Supabase redirect URLs
2. Verify app.json scheme
3. Test deep link routing
4. Check navigation setup

## 🚀 Quick Fixes

### Fix 1: Update Redirect URL
If the link isn't working, try updating the redirect URL:
```javascript
// In AuthContext.js
const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'wisesobriety://reset-password?source=email'
  });
  // ...
};
```

### Fix 2: Add Fallback URL
Add a web fallback in case deep link fails:
```javascript
const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://wisesobriety.org/reset-password'
  });
  // ...
};
```

### Fix 3: Improve Error Handling
Update ResetPasswordScreen to handle missing tokens better:
```javascript
useEffect(() => {
  const checkAccessToken = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        setError('Invalid or expired reset link. Please request a new password reset.');
        setProcessing(false);
        return;
      }
      
      setProcessing(false);
    } catch (error) {
      setError('Failed to validate reset link. Please try again.');
      setProcessing(false);
    }
  };

  checkAccessToken();
}, []);
```

## 📋 Checklist

- [ ] App scheme is `wisesobriety://`
- [ ] Supabase redirect URL includes `wisesobriety://reset-password`
- [ ] ResetPasswordScreen is in navigation stack
- [ ] Deep link routing is configured
- [ ] Email is being sent successfully
- [ ] Link format is correct
- [ ] App is installed on test device
- [ ] Testing on actual device (not simulator)

## 🆘 Still Not Working?

If none of the above fixes work:

1. **Try HTML page approach** instead of deep links
2. **Check Supabase support** for your specific issue
3. **Test on different devices** and email clients
4. **Use Expo development build** instead of Expo Go

Your password reset should work once we identify the specific issue! 🔧 