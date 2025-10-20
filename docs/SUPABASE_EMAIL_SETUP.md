# Supabase Email SMTP Setup Guide

## Overview

This guide covers setting up custom email templates and SMTP configuration for Supabase in the Baton Rouge GA application.

## Option 1: Using Supabase Built-in Email Service (Recommended for Development)

### Step 1: Configure Email Templates in Supabase Dashboard

1. Go to your Supabase project dashboard: https://app.supabase.com/project/nrpwrxeypphbduvlozbr
2. Navigate to **Authentication** → **Email Templates**
3. Configure the following templates:

#### Confirm Signup Template

```html
<h2>Welcome to Baton Rouge GA</h2>
<p>
  Thank you for joining our community. Please confirm your email address by
  clicking the link below:
</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your account</a></p>
<p>This link will expire in 24 hours.</p>
<p>If you didn't create an account, you can safely ignore this email.</p>

<hr />
<p>
  <em>Baton Rouge Gamblers Anonymous</em><br />
  Recovery starts with a single step.
</p>
```

#### Magic Link Template

```html
<h2>Sign in to Baton Rouge GA</h2>
<p>Click the link below to sign in to your account:</p>
<p><a href="{{ .Token }}">Sign in to your account</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this email, you can safely ignore it.</p>

<hr />
<p>
  <em>Baton Rouge Gamblers Anonymous</em><br />
  Recovery starts with a single step.
</p>
```

#### Change Email Address Template

```html
<h2>Confirm Email Address Change</h2>
<p>Please confirm your new email address by clicking the link below:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm new email address</a></p>
<p>This link will expire in 24 hours.</p>
<p>If you didn't request this change, please contact us immediately.</p>

<hr />
<p>
  <em>Baton Rouge Gamblers Anonymous</em><br />
  Recovery starts with a single step.
</p>
```

#### Reset Password Template

```html
<h2>Reset Your Password</h2>
<p>You requested a password reset for your Baton Rouge GA account.</p>
<p>Click the link below to reset your password:</p>
<p><a href="{{ .Token }}">Reset your password</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this reset, you can safely ignore this email.</p>

<hr />
<p>
  <em>Baton Rouge Gamblers Anonymous</em><br />
  Recovery starts with a single step.
</p>
```

### Step 2: Configure Site URL

1. In your Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://batonrougega.org` (or your production URL)
3. Set **Redirect URLs** to include:
   - `https://batonrougega.org/**`
   - `http://localhost:3000/**` (for development)

## Option 2: Resend SMTP Configuration (Recommended - Uses Your Existing Account)

Since you already have Resend API working, you can use Resend's SMTP service for Supabase authentication emails. This centralizes all email sending through your existing Resend account.

### Step 1: Get Resend SMTP Credentials

1. Log in to your Resend dashboard: https://resend.com/dashboard
2. Go to **Settings** → **SMTP**
3. Use these credentials:

```
SMTP Host: smtp.resend.com
SMTP Port: 587 (or 465 for SSL)
SMTP User: resend
SMTP Pass: [Your existing Resend API Key: re_XxDKFExG_CQZb8nwACsi1B7c6a43Ap4cp]
```

### Step 2: Configure SMTP in Supabase

1. Go to **Authentication** → **Settings** → **SMTP Settings** in your Supabase dashboard
2. Fill in the Resend SMTP details:

```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP User: resend
SMTP Pass: re_XxDKFExG_CQZb8nwACsi1B7c6a43Ap4cp
Sender Name: Baton Rouge GA
Sender Email: noreply@batonrougega.org
```

**Note**: Make sure `noreply@batonrougega.org` is verified in your Resend dashboard, or use a verified sender email.

## Option 3: Alternative SMTP Providers

If you prefer other providers:

### SendGrid:

```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Pass: [Your SendGrid API Key]
```

### Mailgun:

```
SMTP Host: smtp.mailgun.org
SMTP Port: 587
SMTP User: [Your Mailgun SMTP username]
SMTP Pass: [Your Mailgun SMTP password]
```

### Step 3: Verify Domain (Optional but Recommended)

Most SMTP providers require domain verification for better deliverability:

1. Add DNS records provided by your SMTP service
2. Verify the domain in your SMTP provider's dashboard

## Environment Variables

Add these to your `.env` file if using custom SMTP:

```env
# SMTP Configuration (if not using Supabase dashboard)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_api_key_here
SMTP_FROM_NAME=Baton Rouge GA
SMTP_FROM_EMAIL=noreply@batonrougega.org
```

## Testing Email Configuration

### Test 1: Sign Up Flow

1. Create a test account with a real email address
2. Check that confirmation email is received
3. Verify email template formatting and branding

### Test 2: Password Reset

1. Use "Forgot Password" functionality
2. Verify reset email is received with correct template
3. Test that reset link works properly

### Test 3: Email Change

1. Change email address in user profile
2. Verify confirmation email is sent to new address
3. Test confirmation process

## Troubleshooting

### Common Issues:

1. **Emails not being sent**: Check SMTP credentials and firewall settings
2. **Emails in spam**: Verify domain authentication (SPF, DKIM, DMARC)
3. **Template not rendering**: Check for syntax errors in HTML
4. **Wrong redirect URL**: Verify Site URL and Redirect URLs in settings

### Debug Steps:

1. Check Supabase logs in dashboard
2. Test SMTP connection using tools like `telnet` or online SMTP testers
3. Verify DNS records for domain authentication
4. Check email provider's delivery logs

## Custom Email Functions

For advanced email functionality beyond authentication, you can create custom functions that integrate with your existing Resend setup or SMTP configuration.
