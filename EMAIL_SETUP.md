# Email Setup Guide for Contact Form

The contact form on the website is configured to send emails to `batonrougega@gmail.com` using Resend. This setup uses your existing Resend account and a serverless function for secure email delivery.

## Prerequisites

- ✅ You already have a Resend.com account
- ✅ Serverless function is already created (`/api/send-email.js`)
- ✅ Contact form is updated to use the new API

## Setup Steps

### 1. Get Your Resend API Key

1. Log into your existing [Resend account](https://resend.com/login)
2. Go to [API Keys](https://resend.com/api-keys)
3. Click "Create API Key"
4. Give it a name like "Baton Rouge GA Website"
5. Copy the API key (starts with `re_`)

### 2. Configure Environment Variables

1. In your project root, copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Add your Resend API key to `.env`:
   ```env
   RESEND_API_KEY=re_your_actual_api_key_here
   ```

### 3. Domain Setup (Required!)

**⚠️ You must verify `batonrougega.org` in your Resend account:**

1. **Add Domain to Resend:**

   - Go to your [Resend Dashboard](https://resend.com/domains)
   - Click "Add Domain"
   - Enter `batonrougega.org`
   - Click "Add"

2. **Verify Domain with DNS:**

   - Resend will provide DNS records (usually TXT and MX records)
   - Add these records to your domain registrar's DNS settings
   - Wait for verification (usually 5-10 minutes)

3. **The serverless function is already configured to use:**
   ```javascript
   from: 'Baton Rouge GA Website <contact@batonrougega.org>',
   ```

**⚠️ Important:** The contact form will not work until `batonrougega.org` is verified in Resend!

### 4. Test the Contact Form

1. Start your development server: `npm run dev`
2. Navigate to the Contact Us page
3. Fill out and submit the form
4. Check your `batonrougega@gmail.com` inbox for the test email

## How It Works

### Email Flow:

1. User fills out contact form
2. Form sends POST request to `/api/send-email`
3. Serverless function validates data
4. Function calls Resend API to send email
5. Email arrives in your Gmail inbox

### Email Format:

- **From:** Baton Rouge GA Website (via your configured domain)
- **To:** batonrougega@gmail.com
- **Subject:** "New Contact Form Submission from [Name]"
- **Content:** Formatted HTML and plain text with sender details

### Security Benefits:

- ✅ API keys stay server-side (not exposed to browsers)
- ✅ Built-in spam protection
- ✅ Better email deliverability than client-side solutions
- ✅ Request validation and error handling

## Deployment

When you deploy to Vercel:

1. Add the environment variable in your Vercel dashboard:

   - Go to Project Settings > Environment Variables
   - Add `RESEND_API_KEY` with your API key value
   - Make sure it's available for Production, Preview, and Development

2. The serverless function will automatically work on Vercel

## Troubleshooting

### Common Issues:

1. **"Domain not verified" error**

   - Make sure you've added `batonrougega.org` to your Resend dashboard
   - Check that all DNS records are properly configured at your domain registrar
   - DNS changes can take up to 24 hours to propagate

2. **API key not working**

   - Double-check the key starts with `re_`
   - Make sure it's set correctly in environment variables
   - Restart your development server after adding .env

3. **Emails not arriving**

   - Check spam/junk folder
   - Verify the recipient email is correct
   - Check Resend logs in your dashboard

4. **Local development issues**
   - Make sure `.env` file is in project root
   - Restart dev server after environment changes
   - Check browser console for error messages

### Debugging:

```bash
# Check if environment variable is loaded
echo $RESEND_API_KEY

# View server logs (when running locally)
npm run dev
# Submit form and check terminal output
```

## Upgrading/Limits

- **Free Plan:** 100 emails/day, 3,000/month
- **Pro Plan:** Much higher limits if needed
- Check your current usage in the Resend dashboard

## DNS Records Setup

When you add `batonrougega.org` to Resend, you'll get DNS records like:

**TXT Record (for domain verification):**

- Name: `@` or leave empty
- Value: `resend-verification=abc123...` (Resend will provide the exact value)

**MX Records (for email delivery - if you want to receive emails):**

- Name: `@` or leave empty
- Value: `feedback-smtp.us-east-1.amazonses.com` (priority 10)

Add these to your domain registrar's DNS settings to verify the domain and enable professional email delivery.
