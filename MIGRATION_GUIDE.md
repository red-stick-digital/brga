# User Migration Guide

This guide explains how to migrate existing users from your previous Baton Rouge GA site to the new system.

## 🎯 Migration System Overview

The user migration system provides two ways to import existing users:

1. **Manual Entry** - Add users one-by-one through a web form
2. **Bulk CSV Import** - Upload a CSV file with multiple users

Both methods will:

- Create Supabase Auth accounts with temporary passwords
- Set up complete member profiles with all GA-specific data
- Automatically approve users (no approval process needed)
- Send welcome emails with login instructions
- Create or associate users with their home groups

## 🔧 Setup Requirements

### 1. Environment Variables

Add to your `.env` file:

```env
# Required for migration
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Required for email notifications
RESEND_API_KEY=your_resend_api_key_here
```

**Getting the Service Role Key:**

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the `service_role` key (not the anon key!)
4. ⚠️ **Keep this secret** - it has admin privileges

### 2. Install Dependencies

```bash
npm install csv-parser formidable
```

### 3. Start Development Server

```bash
npm run dev:full
```

## 📋 Using the Migration System

### Access the Migration Interface

1. Log in as an admin user
2. Go to the Admin Dashboard
3. Click the "User Migration" tab

### Option 1: Manual Entry

Perfect for adding a few users or testing the system.

**Required Fields:**

- Email address (must be unique)
- Full name

**Optional Fields:**

- Phone number
- Clean date (YYYY-MM-DD format)
- Home group name
- Directory listing preference
- Willing to sponsor preference

**Process:**

1. Fill out the form
2. Click "Add User"
3. User is created immediately with temporary password
4. Welcome email is sent automatically

### Option 2: CSV Bulk Import

Best for migrating many users at once.

**CSV Format:**
Download the template from the interface or use this structure:

```csv
email,full_name,phone,clean_date,home_group_name,listed_in_directory,willing_to_sponsor
john.doe@email.com,John Doe,555-1234,2020-01-15,Monday Night Group,true,false
jane.smith@email.com,Jane Smith,555-5678,2019-06-20,Tuesday Noon Group,false,true
```

**Field Descriptions:**

- `email` - Required, must be valid email format
- `full_name` - Required, member's full name
- `phone` - Optional, phone number
- `clean_date` - Optional, format: YYYY-MM-DD
- `home_group_name` - Optional, will create group if doesn't exist
- `listed_in_directory` - Optional, true/false/1/0/yes/no
- `willing_to_sponsor` - Optional, true/false/1/0/yes/no

**Process:**

1. Prepare your CSV file (use template)
2. Upload the file
3. Click "Import Users"
4. Review results for any errors

## 🏠 Home Groups

The migration system handles home groups intelligently:

- **Existing Groups**: If a home group name matches an existing group, the user is associated with it
- **New Groups**: If a home group doesn't exist, a placeholder is created with default settings:
  - Start time: 7:00 PM
  - Address: "TBD - Please Update"
  - City: Baton Rouge, LA 70801

**After Migration**: Update placeholder home groups with correct meeting details in the admin interface.

## 📧 Email Notifications

Each migrated user receives a welcome email containing:

- Their login credentials (email + temporary password)
- Link to the member portal
- Instructions to change their password
- Overview of available features

**Email Customization**: Edit the email templates in:

- `api/migrate-user.js` (manual migration)
- `api/migrate-users-bulk.js` (bulk migration)

## 🔐 Security & Passwords

**Temporary Passwords:**

- Auto-generated, 8 characters + special character
- Displayed in migration results
- Sent via email
- Should be changed by user on first login

**User Status:**

- All migrated users are automatically approved
- Assigned "member" role with full access
- No approval workflow needed

## 📊 Migration Results

The system provides detailed feedback:

**Success Indicators:**

- ✅ User account created
- ✅ Member profile populated
- ✅ Welcome email sent
- ✅ Home group associated (if specified)

**Error Handling:**

- Duplicate email addresses
- Invalid email formats
- Missing required fields
- Database connection issues
- Email delivery failures

## 🚨 Troubleshooting

### Common Issues

**"Authentication required" error:**

- Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env` file
- Restart the development server

**"Failed to create user account" error:**

- Check if email already exists in system
- Verify Supabase Service Role Key is correct
- Check Supabase project quotas

**Email delivery failures:**

- Verify `RESEND_API_KEY` is set correctly
- Check Resend account limits and status
- User is still created, just no email sent

**CSV parsing errors:**

- Ensure CSV has required columns: `email`, `full_name`
- Check for special characters or formatting issues
- Verify file is actually CSV format

### Rate Limits

**Bulk Import Safeguards:**

- Processes users in batches of 5
- 1-second delay between batches
- Prevents overwhelming Supabase/email services

**For Large Datasets (100+ users):**

- Consider splitting into smaller CSV files
- Monitor Supabase usage quotas
- Watch for email service rate limits

## 📈 Best Practices

### Before Migration

1. **Backup existing data** (if any)
2. **Test with a few users first** using manual entry
3. **Prepare CSV carefully** - validate emails and formats
4. **Inform users** about the migration and new login process

### During Migration

1. **Monitor results** - check for errors
2. **Keep temporary passwords secure** - don't log them
3. **Verify email delivery** - check for bounced emails
4. **Update home groups** - replace placeholder data

### After Migration

1. **Test user logins** - verify accounts work
2. **Update member profiles** - help users complete their info
3. **Clean up home groups** - add proper meeting details
4. **User support** - help with password changes and navigation

## 🔒 Production Considerations

**Before Production Deployment:**

1. **Enable Authentication**: Remove the development auth bypass in API endpoints
2. **Secure Service Role Key**: Use proper secrets management (Vercel secrets, etc.)
3. **Rate Limiting**: Add additional rate limiting for migration endpoints
4. **Logging**: Implement proper logging for migration activities
5. **Validation**: Add more robust data validation
6. **Rollback Plan**: Have a plan to handle failed migrations

**Production Auth Implementation:**

```javascript
// In API endpoints, replace development bypass with:
const authResult = await verifyAdminUser(req);
if (!authResult.success) {
  return res.status(401).json({ error: "Admin access required" });
}
```

## 📞 Support

If you encounter issues during migration:

1. **Check the browser console** for detailed error messages
2. **Review the migration results** for specific failure reasons
3. **Verify environment variables** are set correctly
4. **Test with a single user** before bulk operations
5. **Contact system admin** if problems persist

---

**Migration Checklist:**

- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Test migration with sample user
- [ ] CSV file prepared (if bulk importing)
- [ ] Users notified about migration
- [ ] Home group data ready to update
- [ ] Email templates customized (optional)

The migration system is designed to be safe and recoverable. Users are created with approved status, so they can immediately access the system once migrated.
