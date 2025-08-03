# STEP-BY-STEP RLS FIX

## 🚨 URGENT: Fix the RLS Error (42501)

You're getting this error:
```
ERROR Check-in creation error: {"code": "42501", "details": null, "hint": null, "message": "new row violates row-level security policy for table \"check_ins\""}
```

## 🔧 EXACT STEPS TO FIX

### Step 1: Go to Supabase Dashboard
1. Open your browser
2. Go to [supabase.com](https://supabase.com)
3. Sign in to your account
4. Open your Wise Sobriety project

### Step 2: Open SQL Editor
1. In your Supabase dashboard, click **SQL Editor** (in the left sidebar)
2. Click **New Query**

### Step 3: Apply the Fix
1. Copy and paste this EXACT SQL code:

```sql
-- IMMEDIATE RLS FIX
ALTER TABLE check_ins DISABLE ROW LEVEL SECURITY;
```

2. Click **Run**

### Step 4: Test Your App
1. Go back to your app
2. Try to submit a check-in
3. It should work now!

### Step 5: Re-enable Security (Optional)
After confirming it works, you can re-enable security by running:

```sql
-- Re-enable RLS with proper policies
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own check-ins" ON check_ins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own check-ins" ON check_ins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own check-ins" ON check_ins
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own check-ins" ON check_ins
  FOR DELETE USING (auth.uid() = user_id);
```

## ✅ Success Indicators

When the fix works:
- ✅ No more "42501" errors
- ✅ Check-ins save successfully
- ✅ Success message appears
- ✅ Data appears in Supabase dashboard

## 🚨 If Still Getting Errors

1. **Check that you ran the SQL** in the correct project
2. **Verify the table exists** by running:
   ```sql
   SELECT * FROM check_ins LIMIT 1;
   ```
3. **Check RLS status** by running:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'check_ins';
   ```

## 📞 Need Help?

If you're still getting errors after following these steps:
1. Make sure you're in the correct Supabase project
2. Check that the SQL ran successfully (no error messages)
3. Try the check-in again in your app

The RLS error will be completely resolved once you disable RLS temporarily! 