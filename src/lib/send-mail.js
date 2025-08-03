import 'react-native-url-polyfill/auto';

// Resend API configuration
const RESEND_API_KEY = process.env.EXPO_PUBLIC_RESEND_API_KEY || 'your-resend-api-key';
const FROM_EMAIL = 'Wise Sobriety <support@wisesobriety.org>';

// Validate Resend configuration
if (!RESEND_API_KEY || RESEND_API_KEY === 'your-resend-api-key') {
  console.warn('⚠️ Resend API key not configured. Please set EXPO_PUBLIC_RESEND_API_KEY in your environment variables.');
}

// Email templates
const emailTemplates = {
  // Welcome/Confirmation email template
  welcome: (userName, confirmationUrl) => ({
    subject: 'Confirm Your Signup',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Wise Sobriety</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to Wise Sobriety</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Your journey to wellness starts here</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 20px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Hi ${userName || 'there'}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
              Thank you for joining Wise Sobriety. We're excited to be part of your journey to a healthier, happier life.
            </p>
            
            <p style="color: #666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
              To get started, please confirm your email address by clicking the button below:
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${confirmationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 16px 32px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;
                        font-size: 16px;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                        transition: all 0.3s ease;">
                Confirm Email Address
              </a>
            </div>
            
            <!-- Fallback Link -->
            <p style="color: #999; font-size: 14px; margin: 30px 0 0 0; text-align: center; line-height: 1.5;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${confirmationUrl}" style="color: #667eea; word-break: break-all; text-decoration: underline;">${confirmationUrl}</a>
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
    `
  }),
  
  // Password reset email template
  passwordReset: (userName, resetUrl) => ({
    subject: 'Reset Your Password - Wise Sobriety',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Wise Sobriety</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Reset Your Password</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Wise Sobriety</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 20px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Hi ${userName || 'there'}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 16px 32px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;
                        font-size: 16px;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                        transition: all 0.3s ease;">
                Reset Password
              </a>
            </div>
            
            <!-- Fallback Link -->
            <p style="color: #999; font-size: 14px; margin: 30px 0 0 0; text-align: center; line-height: 1.5;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #667eea; word-break: break-all; text-decoration: underline;">${resetUrl}</a>
            </p>
            
            <p style="color: #999; font-size: 14px; margin: 30px 0 0 0; text-align: center; line-height: 1.5;">
              If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0; line-height: 1.4;">
              This email was sent from Wise Sobriety.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send email using Resend API
export const sendEmail = async (to, template, data) => {
  try {
    console.log('Sending email to:', to);
    console.log('Email template:', template);
    
    const emailContent = emailTemplates[template](data.name, data.url);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: emailContent.subject,
        html: emailContent.html,
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Email sending error:', result);
      return { success: false, error: result };
    }
    
    console.log('Email sent successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
};

// Send welcome/confirmation email
export const sendWelcomeEmail = async (email, userName, confirmationUrl) => {
  console.log('Sending welcome email:', { email, userName, confirmationUrl });
  return await sendEmail(email, 'welcome', {
    name: userName,
    url: confirmationUrl
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, userName, resetUrl) => {
  console.log('Sending password reset email:', { email, userName, resetUrl });
  return await sendEmail(email, 'passwordReset', {
    name: userName,
    url: resetUrl
  });
};

// Test email sending
export const testEmailSending = async () => {
  console.log('Testing email sending...');
  return await sendWelcomeEmail(
    'test@example.com',
    'Test User',
    'https://wisesobriety.org/confirm'
  );
}; 