# Password Reset Test Guide

## Testing the Password Reset Flow

### Prerequisites
1. Make sure your Supabase project is properly configured
2. Verify the redirect URLs are set correctly in Supabase dashboard
3. Ensure the reset-password.html file is deployed to the correct location

### Test Steps

#### 1. Request Password Reset
1. Open your app
2. Go to the "Forgot Password" screen
3. Enter a valid email address that exists in your system
4. Click "Send Reset Link"
5. Verify you receive a success message

#### 2. Check Email
1. Check your email inbox
2. Look for the password reset email from Supabase
3. Verify the email contains a reset link
4. Check spam folder if not found in inbox

#### 3. Test Reset Link
1. Click the reset link in the email
2. Verify it opens the reset-password.html page
3. Check the browser console for any error messages
4. Try entering a new password and confirming it
5. Submit the form

#### 4. Verify Password Change
1. After successful password reset, try signing in with the new password
2. Verify you can access the app with the new password
3. Test that the old password no longer works

### Common Issues and Solutions

#### Issue: "Invalid reset link" error
**Possible causes:**
- Reset link has expired (links expire after 1 hour)
- Incorrect redirect URL configuration
- Malformed tokens in the URL

**Solutions:**
1. Request a new password reset
2. Check Supabase URL configuration
3. Verify the reset-password.html file is accessible

#### Issue: Reset link doesn't work
**Possible causes:**
- Incorrect redirect URL in Supabase settings
- File not deployed to the correct location
- Network connectivity issues

**Solutions:**
1. Verify the redirect URL in Supabase dashboard
2. Check that reset-password.html is accessible via browser
3. Test network connectivity

#### Issue: Password reset succeeds but can't sign in
**Possible causes:**
- Session not properly established
- Password update failed silently
- App cache issues

**Solutions:**
1. Clear app cache and try again
2. Check browser console for errors
3. Verify password was actually changed in Supabase

### Debugging Tips

1. **Check Browser Console**: The updated reset-password.html includes detailed logging
2. **Verify Supabase Settings**: Ensure redirect URLs are correctly configured
3. **Test with Different Browsers**: Some browsers handle URL parameters differently
4. **Check Network Tab**: Look for failed requests in browser developer tools

### Expected Console Output

When the reset link works correctly, you should see:
```
URL parameters: { accessToken: true, refreshToken: true, type: "recovery" }
Session established successfully
Password updated successfully
```

If there are issues, you'll see error messages that help identify the problem.

### Manual Testing Checklist

- [ ] Can request password reset
- [ ] Receives reset email
- [ ] Reset link opens correctly
- [ ] Can enter new password
- [ ] Password change succeeds
- [ ] Can sign in with new password
- [ ] Old password no longer works
- [ ] No console errors during process

### Configuration Verification

Ensure these settings are correct in your Supabase dashboard:

1. **Authentication → URL Configuration**:
   - Site URL: `https://unukse.github.io`
   - Redirect URLs: 
     - `https://unukse.github.io/wisesobriety-confirmation/reset-password.html`
     - `https://unukse.github.io/wisesobriety-confirmation/confirmation.html`

2. **Authentication → Email Templates**:
   - Reset password template should include the correct redirect URL

3. **File Deployment**:
   - reset-password.html should be accessible at the configured redirect URL 