# Authentication Debug Guide

## Current Error
```
TypeError: Cannot read property 'id' of null
```

This error indicates that `session.user` is null, which means the user session is not properly established.

## Debug Steps

### Step 1: Check Console Logs
When you try to submit a check-in, look for the debug output that starts with:
```
=== AUTH DEBUG ===
```

This will show:
- AuthContext user object
- Session object
- Session user object
- Any session errors

### Step 2: Common Issues and Solutions

#### Issue 1: Session is null
**Symptoms**: `Session: null` in debug output
**Solution**: 
1. Sign out of the app
2. Sign back in
3. Try the check-in again

#### Issue 2: Session exists but user is null
**Symptoms**: `Session user: null` in debug output
**Solution**:
1. The session might be corrupted
2. Sign out and sign back in
3. If that doesn't work, clear app data and sign in again

#### Issue 3: User exists but ID is missing
**Symptoms**: `Session user.id: undefined` in debug output
**Solution**:
1. This is a rare Supabase issue
2. Try refreshing the session manually
3. Sign out and sign back in

### Step 3: Manual Session Refresh
If the above doesn't work, try this in your app:

1. Go to the Check-in screen
2. Open the browser console (if testing on web)
3. Run this command:
```javascript
// Refresh the session manually
await supabase.auth.refreshSession();
```

### Step 4: Test Authentication
Run this test to verify authentication is working:

```javascript
// Test authentication status
const { data: { session }, error } = await supabase.auth.getSession();
console.log('Session:', session);
console.log('User:', session?.user);
console.log('User ID:', session?.user?.id);
```

## Quick Fixes to Try

### Fix 1: Sign Out and Back In
1. Go to your app
2. Sign out completely
3. Sign back in with your credentials
4. Try the check-in again

### Fix 2: Clear App Data
1. Close the app completely
2. Clear app data/cache
3. Reopen the app
4. Sign in again
5. Try the check-in

### Fix 3: Check Supabase Dashboard
1. Go to your Supabase dashboard
2. Check Authentication → Users
3. Verify your user account exists and is confirmed
4. If not confirmed, check your email for confirmation

### Fix 4: Test with Simple Check-in
Try submitting a minimal check-in with just required fields:
- Emotional state: "Good"
- Alcohol consumption: "No"

## Expected Debug Output

When authentication is working correctly, you should see:
```
=== AUTH DEBUG ===
AuthContext user: {id: "uuid-here", email: "user@example.com", ...}
AuthContext user.id: "uuid-here"
Session: {user: {id: "uuid-here", email: "user@example.com", ...}, ...}
Session user: {id: "uuid-here", email: "user@example.com", ...}
Session user.id: "uuid-here"
Session error: null
=== END AUTH DEBUG ===
```

## If Still Getting Errors

1. **Check the exact debug output** and share it
2. **Verify your Supabase project** is active and accessible
3. **Check your API keys** are correct in `src/lib/supabase.js`
4. **Try the emergency RLS fix** if authentication is working but RLS is still blocking

The authentication error should be resolved once the session is properly established! 