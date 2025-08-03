# Supabase URL Configuration

## Exact URLs for Supabase Dashboard

Go to your [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → **Authentication** → **Settings** → **URL Configuration**

## 🔧 Site URL
```
https://nzmtiwjdtcgzifxygxsa.supabase.co
```

## 🔗 Redirect URLs

Add these URLs to the **Redirect URLs** section:

### For Email Confirmation (GitHub Pages)
```
https://unukse.github.io/wisesobriety-email-confirmation/index.html
```

### For Password Reset (Deep Link)
```
wisesobriety://reset-password
```

### For Email Confirmation (Deep Link - Alternative)
```
wisesobriety://confirm
```

### For Development/Testing
```
http://localhost:3000
http://localhost:19006
exp://localhost:19000
```

## 📋 Complete Redirect URLs List

Copy and paste this entire list into your Supabase Redirect URLs field:

```
https://unukse.github.io/wisesobriety-email-confirmation/index.html
wisesobriety://reset-password
wisesobriety://confirm
http://localhost:3000
http://localhost:19006
exp://localhost:19000
```

## 🎯 How to Configure

### Step 1: Go to Supabase Dashboard
1. Visit [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Settings**

### Step 2: Configure Site URL
- **Site URL**: `https://nzmtiwjdtcgzifxygxsa.supabase.co`

### Step 3: Add Redirect URLs
- Click **Add URL** for each redirect URL
- Add all URLs from the list above
- Replace `YOUR_USERNAME` with your actual GitHub username

### Step 4: Save Configuration
- Click **Save** at the bottom of the page

## 🔍 URL Breakdown

### Email Confirmation URLs
- **GitHub Pages**: `https://unukse.github.io/wisesobriety-email-confirmation/index.html`
  - Used for email confirmation (HTML page approach)
  - Points to your unified `index.html` page that handles both email confirmation and password reset

### Password Reset URLs
- **Deep Link**: `wisesobriety://reset-password`
  - Used for password reset (app deep link approach)
  - Opens your app directly

### Development URLs
- **Local Development**: `http://localhost:3000`, `http://localhost:19006`
- **Expo Development**: `exp://localhost:19000`

## ⚠️ Important Notes

### 1. GitHub Username Configured
Your GitHub username is set to: `unukse`
```
https://unukse.github.io/wisesobriety-email-confirmation/index.html
```

### 2. URL Scheme
Your app uses the URL scheme `wisesobriety://` (from `app.json`)

### 3. Supabase Project URL
Your Supabase project URL is: `https://nzmtiwjdtcgzifxygxsa.supabase.co`

## 🧪 Testing URLs

### Test Email Confirmation
1. Sign up with a test email
2. Check email for confirmation link
3. Click link → should open GitHub Pages confirmation page

### Test Password Reset
1. Request password reset
2. Check email for reset link
3. Click link → should open app → ResetPasswordScreen

## 🔧 Troubleshooting

### Issue: "Invalid redirect URL" error
**Solution:**
- Make sure all URLs are added to the redirect list
- Check for typos in URLs
- Ensure GitHub Pages URL uses your correct username

### Issue: Deep links not working
**Solution:**
- Verify URL scheme is `wisesobriety://`
- Test deep links manually: `wisesobriety://reset-password`
- Check app navigation configuration

### Issue: GitHub Pages not loading
**Solution:**
- Verify GitHub Pages is enabled
- Check that the HTML file is named `index.html`
- Test the URL manually in a browser

## 📱 Current Flow Configuration

### Email Confirmation
- **URL**: `https://unukse.github.io/wisesobriety-email-confirmation/index.html`
- **Method**: HTML page approach
- **User Experience**: Web page → App

### Password Reset
- **URL**: `wisesobriety://reset-password`
- **Method**: Deep link approach
- **User Experience**: Direct to App

## ✅ Verification Checklist

- [ ] Site URL set to: `https://nzmtiwjdtcgzifxygxsa.supabase.co`
- [ ] All redirect URLs added to list
- [ ] GitHub username replaced in GitHub Pages URL
- [ ] Configuration saved
- [ ] Test email confirmation flow
- [ ] Test password reset flow

Your Supabase URL configuration is now complete! 🎉 