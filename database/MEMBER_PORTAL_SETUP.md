# Member Portal Database Setup Guide

## Overview

This guide walks you through deploying the member portal database schema to Supabase and initializing the system.

## Step 1: Deploy Schema

1. **Open Supabase Dashboard**

   - Navigate to your Supabase project
   - Go to SQL Editor

2. **Run Schema SQL**

   - Copy the contents of `member_portal_schema.sql`
   - Paste into a new query in SQL Editor
   - Click "Run"
   - Verify: No errors, tables created successfully

3. **Run Seed Data**
   - Copy the contents of `member_portal_seed.sql`
   - Paste into a new query in SQL Editor
   - Click "Run"
   - Verify: 9 home groups inserted

## Step 2: Verify Tables

Run this query to confirm tables exist:

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

You should see:

- `home_groups`
- `member_profiles`
- `approval_codes`
- `user_roles` (existing table, updated with new column)

## Step 3: Initialize Superadmin User

**Prerequisites:** You need an auth user to promote to superadmin. You can create one through the Supabase Auth UI or use an existing one.

1. **Get Your User ID**

   - Go to Authentication > Users in Supabase
   - Copy the UUID of the user you want to make superadmin

2. **Run Superadmin Setup Query**

   - In SQL Editor, run:

   ```sql
   -- Replace YOUR_USER_ID with your actual UUID
   INSERT INTO user_roles (user_id, role, approval_status)
   VALUES ('993bdc0d-7a1d-46fc-a2af-7c7faf3b3034', 'superadmin', 'approved')
   ON CONFLICT (user_id) DO UPDATE SET
       role = 'superadmin',
       approval_status = 'approved';
   ```

3. **Verify**
   - Run:
   ```sql
   SELECT * FROM user_roles WHERE role = 'superadmin';
   ```

## Database Schema Reference

### home_groups

Stores the 9 GA meeting locations and times.

| Column     | Type      | Notes                                     |
| ---------- | --------- | ----------------------------------------- |
| id         | BIGSERIAL | Primary key                               |
| name       | TEXT      | Meeting identifier (e.g., "Monday Night") |
| start_time | TIME      | Meeting start time (24-hour format)       |
| street_1   | TEXT      | Primary address                           |
| street_2   | TEXT      | Descriptive location info (optional)      |
| city       | TEXT      | City name                                 |
| state      | TEXT      | State code                                |
| zip        | TEXT      | ZIP code                                  |
| created_at | TIMESTAMP | Auto-set                                  |
| updated_at | TIMESTAMP | Auto-updated                              |

### member_profiles

Individual member information linked to auth users.

| Column              | Type      | Notes                          |
| ------------------- | --------- | ------------------------------ |
| id                  | BIGSERIAL | Primary key                    |
| user_id             | UUID      | Foreign key to auth.users      |
| full_name           | TEXT      | Member's name                  |
| phone               | TEXT      | Contact phone                  |
| email               | TEXT      | Contact email                  |
| clean_date          | DATE      | Recovery milestone             |
| home_group_id       | BIGINT    | Foreign key to home_groups     |
| listed_in_directory | BOOLEAN   | Opt-in to directory visibility |
| willing_to_sponsor  | BOOLEAN   | Can sponsor others             |
| created_at          | TIMESTAMP | Auto-set                       |
| updated_at          | TIMESTAMP | Auto-updated                   |

### approval_codes

One-time use codes for approving new members.

| Column     | Type      | Notes                                         |
| ---------- | --------- | --------------------------------------------- |
| id         | BIGSERIAL | Primary key                                   |
| code       | TEXT      | Three-word format (e.g., "fish-taco-burrito") |
| created_by | UUID      | Admin who created the code                    |
| used_by    | UUID      | Member who used the code                      |
| used_at    | TIMESTAMP | When the code was used                        |
| expires_at | TIMESTAMP | Code expiration time                          |
| created_at | TIMESTAMP | Auto-set                                      |

### user_roles (Extended)

User permissions and approval status.

| Column          | Type | Notes                                                                        |
| --------------- | ---- | ---------------------------------------------------------------------------- |
| ...             | ...  | (existing columns)                                                           |
| approval_status | TEXT | 'pending' \| 'approved' \| 'rejected' \| 'editor' \| 'admin' \| 'superadmin' |

## Row-Level Security (RLS) Policies

### home_groups

- **SELECT**: Anyone can view (public)
- **INSERT/UPDATE/DELETE**: Editors, admins, superadmins only

### member_profiles

- **SELECT**: Users see only their own profile; Approved members can see opt-in directory listings; Admins see all
- **INSERT**: Users create their own profile
- **UPDATE**: Users update their own; Admins can update any

### approval_codes

- **SELECT**: Admins and superadmins only
- **INSERT**: Admins and superadmins only
- **UPDATE**: Any valid code can be used once

### user_roles

- **SELECT**: Users see their own; Admins see all
- **INSERT/UPDATE**: Superadmins only

## Next Steps

1. **Auth Flow Integration**: Update signup flow to check approval codes
2. **Member Dashboard**: Create dashboard for members to manage profiles
3. **Admin Dashboard**: Create admin interface for managing codes and approvals

## Troubleshooting

**Error: "relation \"home_groups\" does not exist"**

- Ensure schema SQL ran successfully
- Check that you're using the correct schema (public)

**Error: "permission denied for schema public"**

- Verify your Supabase role has sufficient permissions
- Try running as superuser or check RLS policies

**Approval codes not visible**

- Ensure your user_id has role = 'admin' or 'superadmin' in user_roles
- Check RLS policy on approval_codes table

## Support

For issues or questions, refer to the main README and deployment documentation.
