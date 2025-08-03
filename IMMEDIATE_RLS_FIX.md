# IMMEDIATE RLS FIX - Follow These Steps Now

## 🚨 URGENT: Fix the RLS Error

You're getting this error:
```
ERROR Check-in creation error: {"code": "42501", "details": null, "hint": null, "message": "new row violates row-level security policy for table \"check_ins\""}
```

## 🔧 STEP-BY-STEP FIX

### Step 1: Go to Supabase Dashboard
1. Open your browser
2. Go to [supabase.com](https://supabase.com)
3. Sign in to your account
4. Open your Wise Sobriety project

### Step 2: Run the SQL Fix
1. In your Supabase dashboard, click **SQL Editor** (in the left sidebar)
2. Click **New Query**
3. Copy and paste this EXACT SQL code:

```sql
-- IMMEDIATE RLS FIX FOR CHECK_INS TABLE
-- This will fix the "new row violates row-level security policy" error

-- First, ensure the check_ins table exists
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emotional_state TEXT,
  alcohol_consumption TEXT CHECK (alcohol_consumption IN ('No', 'Yes', 'I came close, but I relapsed', 'I prefer not to say')),
  craving_triggers TEXT[],
  coping_strategies TEXT[],
  proud_of TEXT,
  motivation_rating INTEGER CHECK (motivation_rating >= 1 AND motivation_rating <= 10),
  support_need TEXT,
  ai_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on check_ins table
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view own check-ins" ON check_ins;
DROP POLICY IF EXISTS "Users can insert own check-ins" ON check_ins;
DROP POLICY IF EXISTS "Users can update own check-ins" ON check_ins;
DROP POLICY IF EXISTS "Users can delete own check-ins" ON check_ins;

-- Create the correct RLS policies
CREATE POLICY "Users can view own check-ins" ON check_ins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own check-ins" ON check_ins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own check-ins" ON check_ins
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own check-ins" ON check_ins
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_created_at ON check_ins(created_at);

-- Verify the policies were created
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'check_ins'
ORDER BY policyname;
```

4. Click **Run** to execute the SQL

### Step 3: Verify the Fix
After running the SQL, you should see 4 policies listed. If you see any errors, let me know.

### Step 4: Test Immediately
1. Go back to your app
2. Try to submit a check-in
3. The error should be gone!

## 🔍 If You Still Get Errors

### Check 1: Verify Policies Exist
Run this query in SQL Editor:
```sql
SELECT 
    policyname,
    cmd
FROM pg_policies 
WHERE tablename = 'check_ins';
```

You should see 4 policies listed.

### Check 2: Test Direct Insert
Run this query to test if the policies work:
```sql
-- This should work if you're logged in
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

### Check 3: Verify RLS is Enabled
```sql
SELECT 
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'check_ins';
```

Should show `rowsecurity = true`.

## 🚨 Emergency Fix (If Above Doesn't Work)

If you're still getting errors, try this nuclear option:

```sql
-- TEMPORARILY DISABLE RLS FOR TESTING
ALTER TABLE check_ins DISABLE ROW LEVEL SECURITY;

-- Test your app now - it should work
-- Then re-enable with proper policies:

ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own check-ins" ON check_ins
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## ✅ Success Indicators

When the fix works, you should see:
- ✅ No more "42501" errors
- ✅ Check-ins save successfully
- ✅ Success message appears
- ✅ Data appears in Supabase dashboard

## 📞 Need Help?

If you're still getting errors after following these steps:
1. Check the console logs for exact error messages
2. Make sure you're signed in to your app
3. Verify your Supabase project is active
4. Try signing out and back in to refresh your session

The RLS error should be completely resolved after following these steps! 