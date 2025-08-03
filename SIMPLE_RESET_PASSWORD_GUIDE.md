# Simple Reset Password Flow (HTML Page)

## ✅ Implementation Complete!

Your app now has a **simple reset password flow using an HTML page**. Here's how it works:

## 🔄 How It Works

### 1. **User Requests Reset**
- User goes to `ForgotPasswordScreen`
- Enters email address
- Clicks "Send Reset Link"

### 2. **Email is Sent**
- Supabase sends email with reset link
- Link contains: `https://unukse.github.io/wisesobriety-confirmation/reset-password.html`
- No code validation needed

### 3. **User Clicks Email Link**
- Link opens the HTML page in browser
- User sets new password on the web page
- Password is updated via Supabase API

### 4. **Password is Updated**
- User enters new password on web page
- Password is updated via Supabase
- User is redirected to app after success

## 🎯 Benefits of This Approach

✅ **No code validation needed** - Simpler implementation  
✅ **Works without app installed** - HTML page works anywhere  
✅ **Standard flow** - Most apps use this approach  
✅ **Secure** - Uses Supabase's built-in security  
✅ **User-friendly** - Works on any device with browser  
✅ **Reliable** - No deep link issues  

## 🧪 How to Test

### Step 1: Request Password Reset
1. **Open your app**
2. **Go to ForgotPasswordScreen**
3. **Enter your email address**
4. **Click "Send Reset Link"**
5. **Expected:** Success message and return to previous screen

### Step 2: Check Email
1. **Check your email** for the reset email
2. **Click the reset link** in the email
3. **Expected:** Opens HTML page in browser

### Step 3: Set New Password
1. **Enter a new password** (at least 6 characters)
2. **Confirm the password**
3. **Click "Update Password"**
4. **Expected:** Success message and redirect to app

## 📁 Files Involved

### ✅ **Updated Files**
- `src/contexts/AuthContext.js` - Updated `simpleResetPassword()` to use HTML page
- `src/screens/ForgotPasswordScreen.js` - Uses simple reset flow
- `reset-password.html` - Handles password reset on web page

### ✅ **Already Configured**
- `App.js` - Deep link routing configured (for app redirect)
- `app.json` - URL scheme configured
- Supabase - Redirect URLs configured

## 🔧 Configuration

### HTML Page Setup
```javascript
// In AuthContext.js
const simpleResetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://unukse.github.io/wisesobriety-confirmation/reset-password.html'
  });
  // ...
};
```

### HTML Page Features
- **Token validation** - Checks for valid access token
- **Password validation** - Ensures password meets requirements
- **Supabase integration** - Updates password via API
- **App redirect** - Redirects to app after success

## 🚀 Flow Summary

```
ForgotPasswordScreen → Email Sent → User Clicks Link → HTML Page → Password Update → App Redirect
```

## ⚠️ Important Notes

1. **HTML Page Required** - Must be hosted on GitHub Pages
2. **Email Access** - User must be able to access their email
3. **Link Expiration** - Reset links expire after 1 hour
4. **One-time Use** - Each link can only be used once
5. **Browser Required** - User needs a web browser

## 🎯 Comparison with Deep Links

| Feature | Deep Links | HTML Page |
|---------|------------|-----------|
| **App Required** | Yes | No |
| **Browser Required** | No | Yes |
| **Reliability** | Depends on app | High |
| **User Experience** | Native | Web |
| **Implementation** | Complex | Simple |

## ✅ Ready to Use!

Your simple reset password flow is **ready to use**! 

**To test:**
1. Request password reset from your app
2. Check email and click the link
3. Set new password on the HTML page
4. Sign in with new password

This approach is much more reliable than deep links and works even if the app isn't installed! 🎉 