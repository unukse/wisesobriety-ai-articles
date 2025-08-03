# Supabase Setup Guide for Wise Sobriety

## 🚀 Quick Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `wise-sobriety`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Update `src/lib/supabase.js`:

```javascript
const supabaseUrl = 'YOUR_PROJECT_URL_HERE';
const supabaseAnonKey = 'YOUR_ANON_KEY_HERE';
```

### 3. Set Up Authentication

1. Go to **Authentication** → **Settings**
2. Configure email settings:
   - **Enable email confirmations**: ON
   - **Enable email change confirmations**: ON
   - **Enable secure email change**: ON

### 4. Configure Password Reset

1. Go to **Authentication** → **URL Configuration**
2. Set the **Site URL** to: `https://unukse.github.io`
3. Add **Redirect URLs**:
   - `https://unukse.github.io/wisesobriety-confirmation/reset-password.html`
   - `https://unukse.github.io/wisesobriety-confirmation/confirmation.html`
4. Save the configuration

### 5. Create Database Tables

Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
```

### 6. Test Your Setup

1. Start your app: `npx expo start`
2. Test sign up with a new email
3. Check your email for verification
4. Test sign in with the verified account
5. Test password reset flow:
   - Go to "Forgot Password" screen
   - Enter your email
   - Check email for reset link
   - Click the link and reset password
   - Try signing in with new password

### 7. Set Up Secrets for Edge Functions

To securely provide API keys (like RESEND or Supabase Service Role) to your Edge Functions, use the new Supabase CLI secrets commands:

```sh
# Set a secret
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# List all secrets
supabase secrets list

# Remove a secret
supabase secrets unset RESEND_API_KEY
```

After setting or updating secrets, always redeploy your function:

```sh
supabase functions deploy confirm-user
```

## 🔧 Additional Features

### Email Templates

Customize email templates in **Authentication** → **Email Templates**:
- **Confirm signup**
- **Reset password**
- **Change email address**

### Social Auth (Optional)

Add social authentication providers:
1. Go to **Authentication** → **Providers**
2. Enable providers like Google, GitHub, etc.
3. Add your OAuth credentials

### Database Schema Extensions

You can extend the database with additional tables:

```sql
-- Check-ins table
CREATE TABLE check_ins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  triggers TEXT[],
  reflection TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wins table
CREATE TABLE wins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'achievement',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meditation sessions table
CREATE TABLE meditation_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id INTEGER NOT NULL,
  duration INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🛡️ Security Best Practices

1. **Row Level Security**: All tables have RLS enabled
2. **User Isolation**: Users can only access their own data
3. **Email Verification**: Required for new accounts
4. **Secure Passwords**: Enforce strong password policies

## 📱 Environment Variables

For production, use environment variables:

```javascript
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
```

Create a `.env` file:
```
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 🎉 You're Ready!

Your Wise Sobriety app now has:
- ✅ Secure email/password authentication
- ✅ User profile management
- ✅ Email verification
- ✅ Password reset functionality
- ✅ Session management
- ✅ Database integration ready

The app will automatically handle user authentication and redirect users appropriately based on their login status.

## Deep Linking for Email Confirmation

To enable users to be directed to the ConfirmScreen after clicking the confirmation link in their email, set the Supabase redirect URL for email confirmations to:

```
wisesobriety://confirm
```

This will open the app and route to the ConfirmScreen when the user clicks the confirmation link.

## Troubleshooting Password Reset Issues

If users encounter "invalid reset link" errors:

1. **Check Supabase Settings**: Ensure the redirect URL is correctly configured in Authentication → URL Configuration
2. **Verify Email Templates**: Check that the reset password email template includes the correct redirect URL
3. **Test the Flow**: Use the test email feature in Supabase to verify the reset link works
4. **Check Console Logs**: The updated reset-password.html now includes better error logging
5. **Token Expiration**: Reset links expire after 1 hour by default - users may need to request a new one

Common issues and solutions:
- **"Invalid reset link"**: Usually means expired tokens or incorrect redirect URL
- **"Email not found"**: User account doesn't exist with that email
- **"Rate limit exceeded"**: Too many reset requests - wait before trying again 