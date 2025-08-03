# Supabase Email Template Setup Guide

## 🎯 Current Status

Your app now uses **only Supabase's built-in email confirmation** instead of the custom Resend emails. This means:

✅ **Single Email**: Users will receive only one email during signup  
✅ **Supabase Template**: Uses the exact template you see in your Supabase dashboard  
✅ **No Duplicates**: Eliminates the double email issue  

## 📧 Customizing the Email Template

### Step 1: Access Email Templates

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Emails** → **Templates**
3. Click on **"Confirm signup"** tab

### Step 2: Customize the Template

You can now customize the email template to match your brand:

#### Subject Line
- **Current**: "Confirm Your Signup"
- **You can change this** to any subject you prefer

#### Email Content
- **Current**: Basic template with "Confirm your signup" heading
- **You can customize** the HTML content to match your brand

### Step 3: Example Custom Template

Here's an example of how you could customize the template:

```html
<h1 style="color: #667eea; font-size: 24px; margin-bottom: 20px;">
  Welcome to Wise Sobriety!
</h1>

<p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
  Thank you for joining Wise Sobriety. We're excited to be part of your journey to a healthier, happier life.
</p>

<p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
  To get started, please confirm your email address by clicking the link below:
</p>

<a href="{{ .ConfirmationURL }}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
  Confirm Email Address
</a>

<p style="color: #999; font-size: 14px; margin-top: 30px;">
  If you didn't create an account, you can safely ignore this email.
</p>
```

### Step 4: Test the Template

1. **Save your changes** in the Supabase dashboard
2. **Create a test account** with a new email
3. **Check the email** to verify it looks exactly as you want

## 🔧 Technical Details

### What Changed

1. **Removed Custom Resend Email**: No longer sending custom emails via Resend
2. **Enabled Supabase Email**: Using Supabase's built-in email confirmation
3. **Simplified Code**: Removed unnecessary email sending logic

### Deep Linking

The email confirmation links will still work with your app's deep linking:
- **Confirmation URL**: `wisesobriety://confirm`
- **Reset Password URL**: `wisesobriety://reset-password`

## 🎉 Benefits

- ✅ **Single Email**: Only one email sent per signup
- ✅ **Consistent Branding**: Use Supabase's template system
- ✅ **Reliable Delivery**: Supabase handles email delivery
- ✅ **Easy Customization**: Change templates directly in dashboard
- ✅ **No API Keys**: No need for Resend API key

## 📱 Testing

To test the new setup:

1. **Restart your app**: `npx expo start --clear`
2. **Create a new account** with a different email
3. **Check your email** - you should receive only one email with the Supabase template
4. **Click the confirmation link** to verify it works properly

The email will now use the exact template you see in your Supabase dashboard with the subject "Confirm Your Signup". 