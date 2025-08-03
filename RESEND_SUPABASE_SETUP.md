# Resend + Supabase Email Configuration

## Overview
Configure Supabase to use Resend as the email provider for authentication emails (signup confirmation, password reset, etc.).

## Method 1: Configure Supabase to Use Resend (Recommended)

### Step 1: Get Your Resend API Key
1. Go to [Resend Dashboard](https://resend.com/dashboard)
2. Navigate to API Keys section
3. Copy your API key (starts with `re_`)

### Step 2: Configure Supabase Auth Settings

#### Option A: Using Supabase Dashboard
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Settings**
4. Scroll down to **SMTP Settings**
5. Configure the following:

```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP User: resend
SMTP Pass: YOUR_RESEND_API_KEY
Sender Name: Wise Sobriety
Sender Email: support@wisesobriety.org
```

#### Option B: Using Supabase CLI
```bash
# Set SMTP configuration
supabase secrets set SMTP_HOST=smtp.resend.com
supabase secrets set SMTP_PORT=587
supabase secrets set SMTP_USER=resend
supabase secrets set SMTP_PASS=YOUR_RESEND_API_KEY
supabase secrets set SMTP_SENDER_NAME="Wise Sobriety"
supabase secrets set SMTP_SENDER_EMAIL=support@wisesobriety.org
```

### Step 3: Update Your App Configuration

Update your `src/contexts/AuthContext.js` to use the GitHub Pages URL:

```javascript
const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://YOUR_USERNAME.github.io/wisesobriety-email-confirmation/',
        data: {
          email_confirmed: false
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      data,
      message: 'Account created successfully. Please check your email to confirm your account.'
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: 'Failed to create account. Please check your configuration.' };
  }
};
```

### Step 4: Test the Configuration
1. Sign up with a test email
2. Check your email - it should come from Resend
3. Click the confirmation link
4. Verify it opens your GitHub Pages confirmation page

## Method 2: Custom Resend Implementation (Advanced)

If you want more control over email templates and sending logic, you can use your existing Resend setup:

### Step 1: Create Supabase Edge Function for Email Sending

Create a new file `supabase/functions/send-auth-email/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = 'Wise Sobriety <support@wisesobriety.org>'

serve(async (req) => {
  try {
    const { to, subject, html, type } = await req.json()
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to send email')
    }
    
    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" } }
    )
  }
})
```

### Step 2: Set Resend API Key in Supabase
```bash
supabase secrets set RESEND_API_KEY=YOUR_RESEND_API_KEY
```

### Step 3: Deploy the Function
```bash
supabase functions deploy send-auth-email
```

## Email Templates for GitHub Pages

### Confirmation Email Template
When using GitHub Pages, your confirmation emails should include:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email - Wise Sobriety</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Confirm Your Email</h1>
      <p style="color: white; margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Wise Sobriety</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 20px;">
      <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Welcome to Wise Sobriety!</h2>
      
      <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
        Thank you for joining us. To complete your registration, please confirm your email address.
      </p>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 40px 0;">
        <a href="https://YOUR_USERNAME.github.io/wisesobriety-email-confirmation/" 
           style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                  color: white; 
                  padding: 16px 32px; 
                  text-decoration: none; 
                  border-radius: 25px; 
                  display: inline-block; 
                  font-weight: bold;
                  font-size: 16px;
                  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
          Confirm Email Address
        </a>
      </div>
      
      <p style="color: #999; font-size: 14px; margin: 30px 0 0 0; text-align: center; line-height: 1.5;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="https://YOUR_USERNAME.github.io/wisesobriety-email-confirmation/" 
           style="color: #667eea; word-break: break-all; text-decoration: underline;">
          https://YOUR_USERNAME.github.io/wisesobriety-email-confirmation/
        </a>
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
      <p style="color: #999; font-size: 12px; margin: 0; line-height: 1.4;">
        This email was sent from Wise Sobriety. If you didn't create an account, you can safely ignore this email.
      </p>
    </div>
  </div>
</body>
</html>
```

## Testing Your Setup

### 1. Test Email Sending
1. Sign up with a test email
2. Check your email (check spam folder too)
3. Verify the email comes from Resend
4. Click the confirmation link

### 2. Test GitHub Pages Integration
1. Click the confirmation link in the email
2. Verify it opens your GitHub Pages confirmation page
3. Test the "Open Wise Sobriety App" button

## Troubleshooting

### Issue: Emails not being sent
**Solution:**
- Check your Resend API key is correct
- Verify SMTP settings in Supabase dashboard
- Check Resend dashboard for any errors
- Ensure your domain is verified in Resend

### Issue: Emails going to spam
**Solution:**
- Verify your domain in Resend
- Set up SPF and DKIM records
- Use a consistent "from" email address
- Avoid spam trigger words in subject lines

### Issue: Confirmation link not working
**Solution:**
- Verify your GitHub Pages URL is correct
- Check that the HTML file is properly deployed
- Test the URL manually in a browser

## Benefits of This Setup

✅ **Professional email delivery** - Resend's reliable infrastructure  
✅ **Beautiful email templates** - Custom HTML templates  
✅ **Analytics and tracking** - See email open rates and clicks  
✅ **Spam protection** - Better deliverability than default providers  
✅ **GitHub Pages integration** - Clean confirmation flow  
✅ **Cost effective** - Resend's generous free tier  

## Next Steps

1. **Configure Supabase SMTP settings** with your Resend credentials
2. **Update your GitHub Pages URL** in the AuthContext
3. **Test the complete flow** from signup to confirmation
4. **Monitor email delivery** in Resend dashboard
5. **Customize email templates** to match your brand

Your Resend + Supabase + GitHub Pages email confirmation flow is now ready! 🎉 