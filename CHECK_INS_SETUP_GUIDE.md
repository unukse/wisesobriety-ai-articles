# Enhanced Check-ins Table Setup Guide

## 🚀 Quick Setup

### Step 1: Create the Enhanced Check-ins Table

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `ENHANCED_CHECK_INS_TABLE.sql`
4. Click **Run** to execute the SQL

This will create:
- ✅ Enhanced `check_ins` table with all 7 questions
- ✅ Row Level Security (RLS) policies
- ✅ Performance indexes
- ✅ Automatic timestamp updates
- ✅ Data validation constraints

### Step 2: Verify the Table Structure

After running the SQL, you should see:
- A new `check_ins` table in your database
- RLS policies for user data isolation
- Indexes for better performance

### Step 3: Test the Implementation

1. **Start your app**: `npx expo start`
2. **Sign in** to your account
3. **Navigate to Check-in screen**
4. **Fill out the form** with test data
5. **Submit the check-in**
6. **Check your Supabase dashboard** to see the saved data

## 📊 Table Structure

The enhanced `check_ins` table includes:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | References auth.users |
| `emotional_state` | TEXT | How are you feeling emotionally today? |
| `alcohol_consumption` | TEXT | Did you drink alcohol today? |
| `craving_triggers` | TEXT[] | What triggered any cravings today? |
| `coping_strategies` | TEXT[] | What healthy coping strategy did you use? |
| `proud_of` | TEXT | What are you proud of today? |
| `motivation_rating` | INTEGER | Motivation to stay sober (1-10) |
| `support_need` | TEXT | What do you need most to support recovery? |
| `ai_summary` | TEXT | AI-generated summary (for future use) |
| `created_at` | TIMESTAMP | When the check-in was created |
| `updated_at` | TIMESTAMP | When the check-in was last updated |

## 🔒 Security Features

- **Row Level Security (RLS)**: Users can only access their own check-ins
- **Data Validation**: Constraints ensure valid data types and ranges
- **Automatic Timestamps**: Created and updated times are managed automatically

## 🧪 Testing

### Test Data Example

```sql
-- Insert test check-in (replace 'your-user-id' with actual user ID)
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
  'your-user-id-here',
  'Feeling a bit anxious but overall calm',
  'No',
  ARRAY['Stress or anxiety', 'Boredom or loneliness'],
  ARRAY['Exercise or movement', 'Talking to someone'],
  'I reached out to my sponsor even though I didn''t want to',
  8,
  'More structure in my morning routine'
);
```

## 🔧 Troubleshooting

### Common Issues

1. **"Table already exists" error**
   - The SQL uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times

2. **RLS Policy errors**
   - Make sure you're logged in when testing
   - Check that the user session is valid

3. **Data validation errors**
   - `alcohol_consumption` must be one of: 'No', 'Yes', 'I came close, but I relapsed', 'I prefer not to say'
   - `motivation_rating` must be between 1 and 10

### Debug Steps

1. **Check console logs** in your app for detailed error messages
2. **Verify user authentication** in Supabase dashboard
3. **Test database connection** using the SQL editor
4. **Check RLS policies** in the Authentication section

## 🎉 Next Steps

Once the table is set up and working:

1. **Test the check-in flow** in your app
2. **Verify data is being saved** in Supabase dashboard
3. **Ready for AI integration** - the `ai_summary` column is ready for OpenAI summaries

Your enhanced check-ins system is now ready! 🚀 