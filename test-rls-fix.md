# Test RLS Fix for Check-ins

## Quick Test Steps

### 1. Apply the Database Fix
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `SUPABASE_RLS_FIX.sql`
4. Click **Run** to execute

### 2. Verify the Fix
Run these queries in the SQL Editor to verify:

```sql
-- Check if RLS is enabled on check_ins table
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'check_ins';

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

You should see:
- `rowsecurity = true` for the check_ins table
- 4 policies: SELECT, INSERT, UPDATE, DELETE

### 3. Test the App
1. Start your app: `npx expo start`
2. Sign in to your account
3. Navigate to Check-in screen
4. Fill out the form and submit
5. Check the console for any errors

### 4. Expected Results
- ✅ No RLS errors (code 42501)
- ✅ Check-in saves successfully
- ✅ AI summary generates (if configured)
- ✅ Success message appears

### 5. If Still Getting Errors
1. **Check console logs** for detailed error messages
2. **Verify user session** is valid
3. **Check network connectivity**
4. **Ensure Supabase project is active**

## Debug Commands

```sql
-- Check current user session
SELECT auth.uid();

-- Test insert with current user
INSERT INTO check_ins (
  user_id,
  emotional_state,
  alcohol_consumption,
  craving_triggers,
  coping_strategies,
  proud_of,
  motivation_rating,
  support_need
) VALUES (
  auth.uid(),
  'Test emotional state',
  'No',
  ARRAY['Test trigger'],
  ARRAY['Test strategy'],
  'Test proud of',
  5,
  'Test support need'
);
```

## Common Issues and Solutions

### Issue: "Table doesn't exist"
**Solution**: Run `ENHANCED_CHECK_INS_TABLE.sql` first, then `SUPABASE_RLS_FIX.sql`

### Issue: "Policy already exists"
**Solution**: The SQL uses `DROP POLICY IF EXISTS` so it's safe to run multiple times

### Issue: "Authentication failed"
**Solution**: 
1. Check that user is properly signed in
2. Verify session is valid
3. Try signing out and back in

### Issue: "Network error"
**Solution**:
1. Check internet connectivity
2. Verify Supabase project is active
3. Check API keys are correct

## Success Indicators

When the fix is working correctly, you should see:

1. **Console logs** showing successful session refresh
2. **No RLS errors** in the console
3. **Success message** after check-in submission
4. **Data appears** in Supabase dashboard
5. **AI summary** generates (if configured)

The RLS fix should resolve the "new row violates row-level security policy" error and allow users to successfully save their check-ins. 