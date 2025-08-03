# Fix Sign-In Authentication Error

## Current Error
```
ERROR Sign in error: [AuthApiError: Invalid login credentials]
```

## Possible Causes

### 1. Wrong Email/Password
- Check that you're using the correct email and password
- Make sure caps lock is off
- Verify there are no extra spaces

### 2. Account Doesn't Exist
- You may need to create a new account first
- Check if you're trying to sign in with an email that was never registered

### 3. Email Not Confirmed
- If you created an account, check your email for a confirmation link
- Click the confirmation link before trying to sign in

### 4. Account Deleted or Disabled
- The account may have been deleted from Supabase dashboard
- Check your Supabase dashboard → Authentication → Users

## Quick Fixes

### Fix 1: Create New Account
1. Go to the Auth screen
2. Switch to "Sign Up" mode
3. Enter your email and password
4. Create the account
5. Check your email for confirmation
6. Click the confirmation link
7. Try signing in again

### Fix 2: Check Supabase Dashboard
1. Go to your Supabase dashboard
2. Navigate to Authentication → Users
3. Check if your user account exists
4. If it exists, check if it's confirmed

### Fix 3: Reset Password
1. Go to the Auth screen
2. Click "Forgot Password?"
3. Enter your email
4. Check your email for reset link
5. Set a new password
6. Try signing in with the new password

### Fix 4: Test with Simple Credentials
Try creating a test account with simple credentials:
- Email: `test@example.com`
- Password: `password123`

## Debug Steps

### Step 1: Check Console Logs
Look for these logs when trying to sign in:
```
Signing in user: [email]
Sign in error: [error details]
```

### Step 2: Verify Supabase Configuration
Check that your Supabase URL and API key are correct in `src/lib/supabase.js`

### Step 3: Test Network Connection
Make sure your app can connect to Supabase:
1. Check internet connection
2. Verify Supabase project is active
3. Check API keys are valid

## Expected Behavior

When sign-in works correctly:
- ✅ No "Invalid login credentials" error
- ✅ User is redirected to main app
- ✅ Session is established
- ✅ User can access check-ins and other features

## If Still Getting Errors

1. **Check the exact error message** in console logs
2. **Verify your Supabase project** is active and accessible
3. **Try creating a completely new account** with different credentials
4. **Check if your Supabase project** has the correct authentication settings

The sign-in error should be resolved once you use the correct credentials or create a new account! 