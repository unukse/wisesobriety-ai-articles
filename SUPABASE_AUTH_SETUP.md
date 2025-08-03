# Supabase Authentication Setup Guide

## 🚀 Quick Setup

### 1. Configure Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy your **Project URL** and **anon public** key
4. Update `src/lib/supabase.js`:

```javascript
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
```

### 2. Configure Authentication Settings

1. Go to **Authentication** → **Settings**
2. Enable email confirmations: **ON**
3. Enable email change confirmations: **ON**
4. Enable secure email change: **ON**

### 3. Configure URL Settings

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://unukse.github.io`
3. Add **Redirect URLs**:
   - `wisesobriety://confirm` (for email confirmation)
   - `wisesobriety://reset-password` (for password reset)
   - `https://unukse.github.io/wisesobriety-confirmation/confirmation.html`
   - `https://unukse.github.io/wisesobriety-confirmation/reset-password.html`

### 4. Create Database Tables

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

### 5. Test the Authentication Flow

1. Start your app: `npx expo start`
2. Test sign up with a new email
3. Check your email for verification link
4. Click the verification link (should open app and navigate to ConfirmScreen)
5. Test sign in with the verified account
6. Test password reset flow

## 🔧 Authentication Flow Features

### Sign Up Flow
- User enters email and password
- Supabase creates account and sends confirmation email
- User receives email with confirmation link
- Clicking link opens app and navigates to ConfirmScreen
- After confirmation, user is redirected to main app

### Sign In Flow
- User enters email and password
- Supabase validates credentials
- If valid, user is redirected to main app
- If invalid, error message is shown

### Password Reset Flow
- User enters email on ForgotPasswordScreen
- Supabase sends reset email with link
- User clicks link and resets password
- User can then sign in with new password

### Email Confirmation
- Handles deep linking from email confirmation links
- Shows loading state while confirming
- Handles errors gracefully
- Provides retry functionality

## 🛡️ Security Features

- **Email Verification**: Required for new accounts
- **Password Requirements**: Minimum 6 characters
- **Session Management**: Automatic token refresh
- **Row Level Security**: Database-level user isolation
- **Secure Storage**: AsyncStorage for session persistence

## 📱 Deep Linking Setup

For email confirmation to work properly, ensure your app.json has the correct scheme:

```json
{
  "expo": {
    "scheme": "wisesobriety",
    "ios": {
      "bundleIdentifier": "com.yourcompany.wisesobriety"
    },
    "android": {
      "package": "com.yourcompany.wisesobriety"
    }
  }
}
```

## 🎯 Error Handling

The authentication flow includes comprehensive error handling:

- **Network Errors**: Graceful fallback with retry options
- **Invalid Credentials**: Clear error messages
- **Email Confirmation Errors**: Retry mechanism
- **Password Reset Errors**: User-friendly error messages

## 🔄 Session Management

- **Automatic Refresh**: Tokens are automatically refreshed
- **Persistent Sessions**: User stays logged in across app restarts
- **Secure Logout**: Properly clears all session data

## 🎉 Ready to Use!

Your authentication system now includes:
- ✅ Secure email/password authentication
- ✅ Email verification flow
- ✅ Password reset functionality
- ✅ Deep linking support
- ✅ Comprehensive error handling
- ✅ Session management
- ✅ Database integration

The app will automatically handle user authentication and redirect users appropriately based on their login status. 