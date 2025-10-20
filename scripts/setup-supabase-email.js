#!/usr/bin/env node

/**
 * Setup script for Supabase email configuration
 * This script provides the SQL commands and configuration steps needed
 * to set up custom email templates and SMTP in Supabase
 */

console.log(`
🔧 Supabase Email Setup Script
===============================

This script will guide you through setting up custom email templates 
and SMTP configuration for your Supabase project.

📋 STEP 1: Configure Email Templates in Supabase Dashboard
----------------------------------------------------------

1. Visit your Supabase project dashboard:
   https://app.supabase.com/project/${process.env.VITE_SUPABASE_URL ? process.env.VITE_SUPABASE_URL.split('//')[1].split('.')[0] : 'YOUR_PROJECT_ID'}

2. Go to Authentication → Email Templates

3. Update each template with the HTML provided below:

📧 CONFIRM SIGNUP TEMPLATE:
===========================
`);

console.log(`
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #8BB7D1; color: white; padding: 20px; text-align: center;">
    <h1>Welcome to Baton Rouge GA</h1>
  </div>
  <div style="padding: 20px; background-color: #f9f9f9;">
    <p>Thank you for joining our community. Please confirm your email address by clicking the link below:</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #6B92B0; color: white; text-decoration: none; border-radius: 5px;">
        Confirm your account
      </a>
    </p>
    <p>This link will expire in 24 hours.</p>
    <p>If you didn't create an account, you can safely ignore this email.</p>
  </div>
  <div style="background-color: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
    <p>Baton Rouge Gamblers Anonymous<br>Recovery starts with a single step.</p>
  </div>
</div>

📧 MAGIC LINK TEMPLATE:
=======================
`);

console.log(`
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #8BB7D1; color: white; padding: 20px; text-align: center;">
    <h1>Sign in to Baton Rouge GA</h1>
  </div>
  <div style="padding: 20px; background-color: #f9f9f9;">
    <p>Click the link below to sign in to your account:</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="{{ .Token }}" style="display: inline-block; padding: 12px 24px; background-color: #6B92B0; color: white; text-decoration: none; border-radius: 5px;">
        Sign in to your account
      </a>
    </p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this email, you can safely ignore it.</p>
  </div>
  <div style="background-color: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
    <p>Baton Rouge Gamblers Anonymous<br>Recovery starts with a single step.</p>
  </div>
</div>

📧 RESET PASSWORD TEMPLATE:
===========================
`);

console.log(`
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #8BB7D1; color: white; padding: 20px; text-align: center;">
    <h1>Reset Your Password</h1>
  </div>
  <div style="padding: 20px; background-color: #f9f9f9;">
    <p>You requested a password reset for your Baton Rouge GA account.</p>
    <p>Click the link below to reset your password:</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="{{ .Token }}" style="display: inline-block; padding: 12px 24px; background-color: #6B92B0; color: white; text-decoration: none; border-radius: 5px;">
        Reset your password
      </a>
    </p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this reset, you can safely ignore this email.</p>
  </div>
  <div style="background-color: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
    <p>Baton Rouge Gamblers Anonymous<br>Recovery starts with a single step.</p>
  </div>
</div>

📋 STEP 2: Configure Site URL
-----------------------------

1. Go to Authentication → URL Configuration
2. Set Site URL to: https://batonrougega.org
3. Add Redirect URLs:
   - https://batonrougega.org/**
   - http://localhost:3000/** (for development)

📋 STEP 3: Optional SMTP Configuration
--------------------------------------

For production, consider setting up custom SMTP:

1. Go to Authentication → Settings → SMTP Settings
2. Choose an email provider (SendGrid, Mailgun, Amazon SES, etc.)
3. Fill in your SMTP credentials

Popular SMTP Providers:
- SendGrid: smtp.sendgrid.net:587
- Mailgun: smtp.mailgun.org:587
- Amazon SES: email-smtp.us-east-1.amazonaws.com:587

📋 STEP 4: Test Email Functionality
-----------------------------------

After configuration, test your setup:

1. Start your development server: npm run dev:full
2. Navigate to /admin (if you have admin access)
3. Use the EmailTestPanel component to test different email types

✅ Setup Complete!
==================

Your Supabase email configuration is now ready. The application can now send:

- Authentication emails (signup confirmation, password reset)
- Custom emails (welcome messages, meeting reminders, announcements)
- Contact form emails (via Resend API)

Need help? Check the documentation:
- docs/SUPABASE_EMAIL_SETUP.md
- Supabase Auth documentation: https://supabase.com/docs/guides/auth
`);

// Check if this script is being run directly (ES module way)
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('\n🚀 Email setup guide displayed successfully!\n');
}