# Environment Variables Setup

## 🔧 Required Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Resend Configuration
EXPO_PUBLIC_RESEND_API_KEY=your-resend-api-key
```

## 📋 How to Get Your Credentials

### 1. Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy your **Project URL** and **anon public** key
4. Update the `.env` file with these values

### 2. Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up or log in to your account
3. Go to **API Keys** section
4. Create a new API key
5. Copy the API key and add it to your `.env` file

## 🚀 Quick Setup Steps

1. **Create `.env` file** in your project root
2. **Add your credentials** using the template above
3. **Restart your development server**: `npx expo start --clear`
4. **Test the authentication flow**

## ⚠️ Important Notes

- Never commit your `.env` file to version control
- The `.env` file should be in your `.gitignore`
- Environment variables starting with `EXPO_PUBLIC_` are available in your app
- Restart your development server after changing environment variables

## 🔍 Troubleshooting

If you see warnings about missing credentials:
1. Check that your `.env` file exists in the project root
2. Verify that the environment variable names are correct
3. Restart your development server
4. Check the console for any error messages

## 📱 Testing

After setting up your environment variables:

1. Test sign up with a new email
2. Check that confirmation emails are sent via Resend
3. Test sign in with verified accounts
4. Test password reset functionality

Your authentication system will now use Resend SMTP for sending emails and Supabase for user management! 