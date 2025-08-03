# Quick Fix for Authentication Error

## Current Error
```
ERROR Check-in submission error: [TypeError: Cannot read property 'id' of null]
```

## Immediate Fix

### Step 1: Sign Out and Sign Back In
1. Use the sign out button in HomeScreen
2. Sign back in with your credentials
3. Try the check-in again

### Step 2: Check Authentication Status
1. Go to Check-in screen
2. Press "Test Authentication" button (if available)
3. Check console logs for authentication status

### Step 3: If Still Getting Errors
1. **Clear app data** completely
2. **Restart the app**
3. **Sign in again**
4. **Try check-in**

## Debug Information

### Expected Console Output
When authentication is working:
```
=== AUTHENTICATION CHECK ===
AuthContext user: {id: "uuid", email: "user@example.com", ...}
AuthContext user.id: "uuid"
Using AuthContext user: "uuid"
```

### If You See This Error
```
AuthContext user: null
AuthContext user.id: undefined
```
**Solution**: Sign out and sign back in

## Quick Test

Try this simple test:
1. **Sign out** using the sign out button
2. **Sign back in** with your email and password
3. **Go to Check-in screen**
4. **Fill out just the required fields**:
   - Emotional state: "Good"
   - Alcohol consumption: "No"
5. **Submit the check-in**

## If Still Not Working

1. **Check your Supabase project** is active
2. **Verify your API keys** are correct
3. **Try creating a new account** with different credentials
4. **Check internet connection**

The authentication error should be resolved by signing out and signing back in! 