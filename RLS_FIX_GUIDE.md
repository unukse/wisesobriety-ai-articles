# Fixing Row Level Security (RLS) Error

## Problem
You're getting this error when trying to create a user profile:
```
ERROR Profile creation error: {"code": "42501", "details": null, "hint": null, "message": "new row violates row-level security policy for table \"profiles\""}
```

## Root Cause
The error occurs because Row Level Security (RLS) is enabled on the `profiles` table, but the user session is not properly established when the profile creation is attempted, causing the RLS policy to reject the insert operation.

## Solution

### Step 1: Fix Database Policies (Run in Supabase Dashboard)

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Run the SQL commands from `SUPABASE_RLS_FIX.sql`

This will:
- Enable RLS on the profiles table
- Drop and recreate the RLS policies properly
- Ensure users can insert their own profiles

### Step 2: Code Changes (Already Applied)

The following changes have been made to fix the issue:

1. **Updated `src/lib/supabase.js`**:
   - Modified `ensureUserAndCreateProfile` function to handle RLS errors
   - Added `createProfileWithRLS` function for better RLS compliance
   - Enhanced session management and error handling

2. **Updated `src/screens/AuthScreen.js`**:
   - Now uses the new `createProfileWithRLS` function
   - Better error handling for RLS-related issues

### Step 3: Test the Fix

1. Start your app: `npx expo start`
2. Try to create a new account
3. The profile creation should now work without RLS errors

## How the Fix Works

### Before (Problem)
- User signs up
- Profile creation attempted immediately
- Session not fully established
- RLS policy rejects the insert

### After (Solution)
- User signs up
- Session is properly established
- Profile creation uses RLS-compliant function
- Proper error handling and retry logic
- Session refresh if needed

## Key Changes Made

1. **Session Management**: Added proper session verification before profile creation
2. **RLS Error Handling**: Specific handling for RLS errors (code 42501)
3. **Session Refresh**: Automatic session refresh when RLS errors occur
4. **Retry Logic**: Multiple attempts with proper delays
5. **Better Error Messages**: More specific error handling

## Database Policies

The RLS policies ensure:
- Users can only view their own profile
- Users can only update their own profile  
- Users can only insert their own profile
- All operations require proper authentication

## Troubleshooting

If you still get RLS errors:

1. **Check Session**: Ensure user is properly signed in
2. **Verify Policies**: Run the SQL fix again
3. **Check User ID**: Ensure the user ID matches the session
4. **Network Issues**: Check internet connectivity
5. **Supabase Status**: Verify your Supabase project is active

## Additional Notes

- The fix includes automatic retry logic
- Session refresh is attempted on RLS errors
- Profile updates are handled if profile already exists
- Comprehensive error logging for debugging

The app should now handle profile creation properly without RLS violations.

## Problem
You're getting this error when trying to save check-ins:
```
ERROR Failed to save check-in: {"code": "42501", "details": null, "hint": null, "message": "new row violates row-level security policy for table \"check_ins\""}
```

## Root Cause
The error occurs because Row Level Security (RLS) is enabled on the `check_ins` table, but either:
1. The RLS policies haven't been properly created
2. The user session is not properly established when the check-in is attempted
3. The user_id doesn't match the authenticated user's ID

## Solution

### Step 1: Fix Database Policies (Run in Supabase Dashboard)

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Run the SQL commands from `SUPABASE_RLS_FIX.sql`

This will:
- Enable RLS on both `profiles` and `check_ins` tables
- Drop and recreate the RLS policies properly
- Ensure users can insert their own check-ins
- Verify the policies were created correctly

### Step 2: Verify the Check-ins Table Structure

Make sure the `check_ins` table exists with the correct structure by running:

```sql
-- Check if check_ins table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'check_ins'
);

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'check_ins'
ORDER BY ordinal_position;
```

### Step 3: Test the RLS Policies

Run this query to verify the policies are working:

```sql
-- Check RLS policies for check_ins table
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'check_ins'
ORDER BY policyname;
```

You should see 4 policies:
- "Users can view own check-ins" (SELECT)
- "Users can insert own check-ins" (INSERT)
- "Users can update own check-ins" (UPDATE)
- "Users can delete own check-ins" (DELETE)

### Step 4: Code Changes (Already Applied)

The following changes have been made to fix the issue:

1. **Updated `src/lib/supabase.js`**:
   - Enhanced `createCheckIn` function with better session management
   - Added session refresh before insert operations
   - Improved error handling for RLS errors
   - Added retry logic for failed operations

2. **Updated `src/screens/CheckInScreen.js`**:
   - Added session verification before submission
   - Better error handling and user feedback
   - Proper user ID validation

### Step 5: Test the Fix

1. Start your app: `npx expo start`
2. Sign in to your account
3. Navigate to the Check-in screen
4. Fill out the form and submit
5. The check-in should now save without RLS errors

## How the Fix Works

### Before (Problem)
- User tries to save check-in
- RLS policy rejects the insert because session/user mismatch
- Error 42501 is thrown

### After (Solution)
- User session is verified before submission
- Session is refreshed if needed
- User ID is properly validated
- RLS policies allow the insert operation
- Proper error handling and retry logic

## Key Changes Made

1. **Session Management**: Added proper session verification before check-in creation
2. **RLS Error Handling**: Specific handling for RLS errors (code 42501)
3. **Session Refresh**: Automatic session refresh when RLS errors occur
4. **Retry Logic**: Multiple attempts with proper delays
5. **Better Error Messages**: More specific error handling

## Database Policies

The RLS policies ensure:
- Users can only view their own check-ins
- Users can only insert their own check-ins
- Users can only update their own check-ins
- Users can only delete their own check-ins
- All operations require proper authentication

## Troubleshooting

If you still get RLS errors:

1. **Check Session**: Ensure user is properly signed in
2. **Verify Policies**: Run the SQL fix again
3. **Check User ID**: Ensure the user ID matches the session
4. **Network Issues**: Check internet connectivity
5. **Supabase Status**: Verify your Supabase project is active

### Debug Steps

1. **Check console logs** in your app for detailed error messages
2. **Verify user authentication** in Supabase dashboard
3. **Test database connection** using the SQL editor
4. **Check RLS policies** in the Authentication section

### Common Issues

1. **"Table doesn't exist" error**
   - Run the `ENHANCED_CHECK_INS_TABLE.sql` first
   - Then run the RLS fix

2. **"Policy already exists" error**
   - The SQL uses `DROP POLICY IF EXISTS` so it's safe to run multiple times

3. **"Authentication failed" error**
   - Check that the user is properly signed in
   - Verify the session is valid

## Additional Notes

- The fix includes automatic retry logic
- Session refresh is attempted on RLS errors
- Check-in updates are handled if check-in already exists
- Comprehensive error logging for debugging

The app should now handle check-in creation properly without RLS violations. 