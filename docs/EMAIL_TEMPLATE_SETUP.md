# Email Template Setup Instructions

## Objective

Customize the Supabase "Reset Password" email template for the member migration process using Magic Link method with 24-hour expiration.

---

## Steps to Configure Email Template

### 1. Access Supabase Dashboard

1. Go to: https://app.supabase.com
2. Select your project: **nrpwrxeypphbduvlozbr** (Baton Rouge GA)
3. Navigate to: **Authentication** → **Email Templates**

### 2. Select Template to Edit

- Click on **"Reset Password"** template
- This template is sent when `auth.resetPasswordForEmail()` is called
- This uses the Magic Link method (user clicks link to reset password)

### 3. Verify Expiration Setting

- Go to **Authentication** → **Providers** → **Email**
- Verify **"Email OTP Expiration"** is set to **86000 seconds** (~24 hours)
- This applies to both Magic Links and OTPs

### 4. Customize Email Content

#### Subject Line:

```
Set Your Password - Baton Rouge GA Member Portal
```

#### Email Body (HTML):

```html
<h2>Welcome to the New Baton Rouge GA Website</h2>

<p>Your email has been loaded into the updated website.</p>

<p>
  To set your password and access the member portal, click the button below:
</p>

<p style="text-align: center; margin: 30px 0;">
  <a
    href="{{ .ConfirmationURL }}"
    style="background-color: #3B82F6; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            display: inline-block;
            font-weight: bold;"
  >
    Set Your Password
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p style="word-break: break-all; color: #666;">{{ .ConfirmationURL }}</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

<p style="color: #666; font-size: 14px;">
  <strong>Need help?</strong><br />
  If you have any trouble logging in or encounter any errors, call Marshall N.
  at <strong>337-889-8123</strong>.
</p>

<p style="color: #999; font-size: 12px; margin-top: 30px;">
  This link will expire in 24 hours. If you didn't request this, you can safely
  ignore this email.
</p>
```

### 5. Alternative Plain Text Version

If you want to also customize the plain text version:

```
Welcome to the New Baton Rouge GA Website

Your email has been loaded into the updated website.

To set your password and access the member portal, click the link below:

{{ .ConfirmationURL }}

Need help?
If you have any trouble logging in or encounter any errors,
call Marshall N. at 337-889-8123.

This link will expire in 24 hours. If you didn't request this, you can safely ignore this email.
```

### 6. Important Supabase Variables

The email template uses these built-in variables:

- `{{ .ConfirmationURL }}` - The password reset link (required)
- `{{ .SiteURL }}` - Your site URL (optional)
- `{{ .Token }}` - Raw token for custom implementations (not needed for our use case)

### 7. Save and Test

1. Click **Save** to apply changes
2. Test by running the migration script in test mode (see below)

---

## Testing the Email Template

### Run Migration in Test Mode

```bash
node scripts/migrate-csv-members.js --test
```

This will:

- Process only the first 2 members from CSV
- Send them password reset emails with your custom template
- Show detailed logs of the process

### Check Email Delivery

1. Check the inbox for the test users
2. Verify the email looks correct
3. Click the password reset link to test the flow
4. Set a new password and verify login works

---

## Full Migration Command

Once testing is successful, run the full migration:

```bash
node scripts/migrate-csv-members.js
```

This will process all 25 members from the CSV file.

---

## Expected Timeline

- **Email delivery**: 1-5 minutes after migration runs
- **Link expiration**: 24 hours (86,000 seconds - configured in Supabase)
- **Users can**: Click link → Set password → Login immediately

---

## Troubleshooting

### Email Not Received

1. Check spam/junk folders
2. Verify email address is correct in Supabase dashboard
3. Check Supabase logs: Authentication → Logs
4. Can manually resend: Call user and walk them through password reset from login page

### Link Expired

- User can click "Forgot Password" on login page
- Enter their email
- Will receive a new password reset email

### User Can't Login After Setting Password

1. Verify they completed password reset process
2. Check if user exists in Supabase Auth dashboard
3. Verify `user_roles` entry has `approval_status: 'approved'`
4. Check browser console for errors

---

## Support Contact

For migration issues or questions:

- **Marshall N.**: 337-889-8123
- Check migration logs in terminal
- Review Supabase dashboard for user status
