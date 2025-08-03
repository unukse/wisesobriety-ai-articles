# Deep Link Password Reset Setup Guide

## Overview
Your app now supports deep links for password reset. When users click the password reset link in their email, it will open your app and navigate to the ResetPasswordScreen where they can set a new password.

## How It Works

1. **User requests password reset** from the ForgotPasswordScreen
2. **Supabase sends email** with a reset link containing `wisesobriety://reset-password`
3. **User clicks email link** which opens your app
4. **App navigates to ResetPasswordScreen** where user can set new password
5. **Password is updated** and user is redirected to sign in

## Configuration

### 1. URL Scheme
Your app already has the URL scheme `wisesobriety://` configured in `app.json`.

### 2. Supabase Configuration
- `detectSessionInUrl: true` is enabled in `src/lib/supabase.js`
- Password reset redirects to `wisesobriety://reset-password`

### 3. Navigation Setup
- ResetPasswordScreen is added to the navigation stack
- Deep link routing is configured in `App.js`

## Testing the Flow

### Method 1: Using Expo Development Build
1. Build your app with `expo build:android` or `expo build:ios`
2. Install the development build on your device
3. Request a password reset from your app
4. Check your email and click the reset link
5. The app should open and navigate to the password reset screen

### Method 2: Using Expo Go (Limited)
1. Run `expo start` in development
2. Open the app in Expo Go
3. Request a password reset
4. Click the email link (may not work in Expo Go due to URL scheme limitations)

### Method 3: Manual Testing
1. Open your app
2. Navigate to ForgotPasswordScreen
3. Enter your email and request reset
4. Check your email for the reset link
5. Copy the link and manually open it in your device's browser
6. The link should redirect to your app

## Expected URL Format
The reset link from Supabase will look like:
```
https://your-project.supabase.co/auth/v1/verify?token_hash=...&type=recovery&redirect_to=wisesobriety://reset-password
```

## Troubleshooting

### Issue: App doesn't open when clicking email link
**Solution:**
- Ensure you're using a development build, not Expo Go
- Check that the URL scheme is properly configured
- Verify the email link contains the correct redirect URL

### Issue: "Missing access token" error
**Solution:**
- This happens when accessing the reset screen directly without tokens
- The screen should only be accessed via email links
- Check that `detectSessionInUrl: true` is set in Supabase config

### Issue: ResetPasswordScreen shows "Invalid reset link"
**Solution:**
- The link may have expired (usually 24 hours)
- Request a new password reset
- Check that the email link is complete and not truncated

## Production Deployment

When deploying to production:

1. **Update Supabase Site URL**: Set your production domain in Supabase dashboard
2. **Configure Redirect URLs**: Add your production URLs to Supabase auth settings
3. **Test with Production Build**: Use a production build to test the flow

## Security Notes

- Password reset links expire after 24 hours by default
- Links are single-use and become invalid after use
- The app validates the session before allowing password changes
- All password changes require valid authentication tokens

## Next Steps

1. Test the flow with a development build
2. Verify the ResetPasswordScreen handles all error cases
3. Test with expired links to ensure proper error handling
4. Deploy to production and test the complete flow 