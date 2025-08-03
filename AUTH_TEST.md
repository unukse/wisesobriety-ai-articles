# Authentication Test Guide

## Quick Test Steps

### Step 1: Test Authentication Status
1. Open your app
2. Go to the Check-in screen
3. Try to submit a check-in
4. Check the console logs for the debug output

### Step 2: Check Debug Output
Look for this output in the console:
```
=== AUTH DEBUG ===
AuthContext user: {id: "uuid", email: "user@example.com", ...}
Session user: {id: "uuid", email: "user@example.com", ...}
Session user.id: "uuid"
=== END AUTH DEBUG ===
```

### Step 3: If Session is Null
If you see `Session: null` or `Session user: null`, try these fixes:

#### Fix 1: Sign Out and Back In
1. Use the sign out button in HomeScreen
2. Sign back in with your credentials
3. Try the check-in again

#### Fix 2: Refresh Session
1. Go to Check-in screen
2. Open browser console (if testing on web)
3. Run this command:
```javascript
await supabase.auth.refreshSession();
```

#### Fix 3: Clear App Data
1. Close the app completely
2. Clear app data/cache
3. Reopen and sign in again

### Step 4: Test with Minimal Data
Try submitting a check-in with just the required fields:
- Emotional state: "Good"
- Alcohol consumption: "No"

### Step 5: Check Supabase Dashboard
1. Go to your Supabase dashboard
2. Check Authentication → Users
3. Verify your user account exists and is confirmed

## Expected Behavior

When authentication is working correctly:
- ✅ Debug output shows valid user IDs
- ✅ Check-in submits successfully
- ✅ No "Cannot read property 'id' of null" errors
- ✅ Success message appears

## If Still Getting Errors

1. **Share the exact debug output** from the console
2. **Check if you're signed in** to the app
3. **Verify your Supabase project** is active
4. **Try the emergency RLS fix** if authentication works but RLS blocks

The authentication error should be resolved once the session is properly established! 