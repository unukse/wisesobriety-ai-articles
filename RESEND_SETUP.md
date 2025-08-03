# Resend API Setup Guide for Wise Sobriety

## 🚀 Quick Setup

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key

1. In your Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Give it a name (e.g., "Wise Sobriety")
4. Copy the API key (starts with `re_`)

### 3. Verify Your Domain

1. Go to **Domains** in your Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow the DNS verification steps
5. Wait for verification (usually takes a few minutes)

### 4. Update Environment Variables

Create a `.env` file in your project root:

```env
EXPO_PUBLIC_RESEND_API_KEY=re_your_api_key_here
EXPO_PUBLIC_RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### 5. Update Email Configuration

In `src/lib/resend.js`, update the `from` email address:

```javascript
const { data: result, error } = await resend.emails.send({
  from: 'Wise Sobriety <noreply@yourdomain.com>', // Update this line
  to: [to],
  subject: emailContent.subject,
  html: emailContent.html,
});
```

### 6. Install Dependencies

Run this command to install the Resend package:

```bash
npm install resend
```

## 🔧 Email Templates

The app includes two email templates:

### Welcome Email
- Sent when users create an account
- Includes confirmation link
- Beautiful gradient design matching your app

### Password Reset Email
- Sent when users request password reset
- Includes reset link
- Same design as welcome email

## 📧 Customizing Email Templates

You can customize the email templates in `src/lib/resend.js`:

```javascript
export const emailTemplates = {
  welcome: (userName, confirmationUrl) => ({
    subject: 'Your Custom Subject',
    html: `
      <div>
        <!-- Your custom HTML here -->
      </div>
    `
  }),
  // ... other templates
};
```

## 🎨 Email Design Features

- **Responsive Design**: Works on all email clients
- **Gradient Background**: Matches your app's design
- **Call-to-Action Buttons**: Clear confirmation/reset buttons
- **Fallback Links**: Text links for email clients that don't support HTML
- **Branding**: Consistent with Wise Sobriety branding

## 🔒 Security Best Practices

1. **API Key Security**: Never commit your API key to version control
2. **Domain Verification**: Always use a verified domain for sending emails
3. **Rate Limiting**: Resend has built-in rate limiting to prevent abuse
4. **Email Validation**: Validate email addresses before sending

## 📊 Email Analytics

Resend provides email analytics:
- Delivery rates
- Open rates
- Click rates
- Bounce rates

Access these in your Resend dashboard under **Analytics**.

## 🚨 Troubleshooting

### Common Issues:

1. **API Key Not Working**
   - Check that your API key is correct
   - Ensure the key has proper permissions

2. **Domain Not Verified**
   - Complete DNS verification
   - Wait for verification to complete

3. **Emails Not Sending**
   - Check your API key
   - Verify your domain
   - Check Resend dashboard for errors

4. **Emails Going to Spam**
   - Use a verified domain
   - Set up proper DNS records
   - Avoid spam trigger words

## 📱 Testing

To test email sending:

1. **Development**: Use your verified domain
2. **Production**: Use your production domain
3. **Testing**: Send to your own email first

## 🎉 You're Ready!

Your Wise Sobriety app now has:
- ✅ Professional email templates
- ✅ Email confirmation flow
- ✅ Password reset functionality
- ✅ Beautiful email design
- ✅ Email analytics

The app will automatically send welcome emails when users create accounts and password reset emails when requested.

## 📞 Support

If you need help with Resend:
- [Resend Documentation](https://resend.com/docs)
- [Resend Support](https://resend.com/support)
- [Resend Community](https://github.com/resendlabs/resend/discussions)

## Setting the RESEND API Key for Supabase Edge Functions

As of recent Supabase CLI versions, secrets are managed globally per project. Use the following command to set your RESEND API key:

```sh
supabase secrets set RESEND_API_KEY=your_resend_api_key
```

To list all secrets:
```sh
supabase secrets list
```

To remove the secret:
```sh
supabase secrets unset RESEND_API_KEY
```

After setting or updating secrets, redeploy your function:

```sh
supabase functions deploy confirm-user
``` 