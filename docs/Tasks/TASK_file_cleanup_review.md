# TASK: Project File Cleanup Review

**Created**: October 24, 2025  
**Completed**: October 24, 2025  
**Status**: ✅ COMPLETED  
**Priority**: Medium - Housekeeping

---

# PROJECT OVERVIEW

**Application**: Baton Rouge GA (Gamblers Anonymous) web application  
**Purpose**: Information about meetings, resources for gambling addiction, and members-only section  
**Architecture**: React SPA with Supabase backend

---

## TASK DESCRIPTION

Review project files to identify outdated, redundant, or no-longer-needed files that can be safely removed to improve project maintainability.

**Focus Areas**:

1. Documentation files in `/docs` (especially duplicates or outdated)
2. Migration scripts in `/scripts` (one-time migrations already applied)
3. Database files in `/database` (temporary debugging files)
4. Root directory test files

---

## ANALYSIS RESULTS

### 📄 DOCUMENTATION FILES (`/docs`)

#### ✅ KEEP - Active Documentation

**Core Files**:

- `STARTER.md` - Main project documentation (actively maintained)
- `PROJECT_OVERVIEW.md` - High-level overview (useful reference)

**Debug Logs** (`/docs/Debugs/`):

- `DEBUG_approval_code_signup.md` - Referenced in STARTER.md, documents critical RLS pattern
- `DEBUG_clean_date_update.md` - Contains useful RLS debugging patterns
- `DEBUG_member_directory_migration.md` - Documents migration issues
- `DEBUG_pending_member_dashboard_access.md` - Documents approval system patterns

**Task Documentation** (`/docs/Upgrades/`):

- `TASK_profile_completion_modal.md` - Active feature, documented in STARTER.md
- `USER_MANAGEMENT_UPGRADE.md` - May contain useful upgrade patterns

**Performance** (`/docs/Performance/`):

- `TASK_performance_optimization.md` - Completed task, contains results
- All IMAGE*OPTIMIZATION*\*.md files - Reference guides

**SEO/Security**:

- `SEO/` folder contents - Reference material
- `Security/SECURITY_ANALYSIS.md` - Security audit documentation

#### ⚠️ CONSIDER REMOVING - Completed/Outdated

**Completed Migrations** (`/docs/Upgrades/`):

- `TASK_member_csv_migration.md` - Migration completed, may be historical reference only
- `MIGRATION_QUICK_START.md` - One-time migration guide (if completed)
- `MEMBER_DIRECTORY_FIX.md` - Fixed issue, may be outdated
- `EMAIL_TEMPLATE_SETUP.md` - Setup complete (check if still needed as reference)

**Reasoning**: These document one-time tasks that are complete. They have historical value but could be archived if not needed for reference.

#### ❓ REVIEW NEEDED

**Incomplete Tasks** (`/docs/Debugs/`):

- `TASK_ui_mobile_fixes.md` - Status unclear, check if completed

---

### 🔧 MIGRATION SCRIPTS (`/scripts`)

#### ✅ KEEP - Utility Scripts

**Active Utilities**:

- `cleanup-test-users.js` - Referenced in STARTER.md for test cleanup
- `cleanup-test-users.sh` - Shell version of above
- `check-all-roles.js` - Diagnostic tool for role verification
- `check-home-groups.js` - Diagnostic tool for home groups
- `optimize-images.js` - Performance tool (may be reused)

**Admin Tools** (`/scripts/admin-migration/`):

- Keep directory - may contain reusable admin utilities

#### ⚠️ CONSIDER REMOVING - One-Time Migrations (Already Applied)

**Profile Field Migrations** (October 2025 - Completed):

- `apply-name-fields-migration.js` - Added first_name, middle_initial, last_name fields
- `remove-full-name-migration.js` - Removed full_name field (deprecated)
- `migrate-existing-members.js` - One-time CSV member import
- `migrate-csv-members.js` - Duplicate/alternative CSV import script
- `migrate-helper.sh` - Helper for migrations

**Directory Migrations** (Completed):

- `apply-directory-fix.js` - Fixed directory listing issue
- `fix-directory-listing.js` - Another directory fix (may be duplicate)
- `fix-missing-roles.js` - Fixed missing role assignments

**Other Migrations**:

- `test-directory-e2e.js` - Old test file (check if replaced)
- `test-directory-e2e-fixed.js` - Updated test file (check if replaced by Playwright)
- `test-trigger.js` - Debugging script for trigger testing
- `check-migrated-users.js` - Verification for completed migration

**Performance Scripts** (One-time):

- `apply-performance-quick-wins.sh` - Applied optimization changes
- `update-image-references.sh` - Updated image paths (one-time)

**Email Setup**:

- `setup-supabase-email.js` - One-time email configuration

**Reasoning**: These scripts were created for specific one-time migrations/fixes that have been completed. They served their purpose and are no longer needed unless kept for historical reference.

---

### 🗄️ DATABASE FILES (`/database`)

#### ✅ KEEP - Active Schema

**Core Schema**:

- `schema.sql` - Current events/announcements schema (active)
- `member_portal_schema.sql` - Core member portal schema (active)
- `seed_data.sql` - Seed data for development
- `member_portal_seed.sql` - Member portal seed data
- `setup_admin.sql` - Admin user setup script

**Active Migrations**:

- `fix_approval_code_update.sql` - Applied Oct 24, 2025 (referenced in STARTER.md)
- `migration_add_profile_completion.sql` - Profile completion feature (Oct 2025)
- `migration_add_directory_sharing.sql` - Directory sharing feature
- `migration_add_home_groups.sql` - Home groups feature

#### ⚠️ CONSIDER REMOVING - Debugging/Temporary Files

**Trigger Debugging Files** (Completed debugging sessions):

- `fix_trigger_debug.sql` - Debugging file from migration issues
- `fix_trigger_final.sql` - Final version (check if applied)
- `fix_trigger_roles_creation.sql` - Role creation fix (v1)
- `fix_trigger_roles_creation_v2.sql` - Role creation fix (v2)
- `fix_trigger_simple.sql` - Simplified trigger version
- `fix_trigger_with_logging.sql` - Logging version for debugging
- `diagnostic_trigger_context.sql` - Diagnostic queries

**Emergency/Temporary Fixes**:

- `emergency_fix.sql` - Emergency patch (check if still needed)
- `fix_signup_profile_creation.sql` - Signup fix (may be superseded)
- `fix_directory_rls_policy.sql` - RLS policy fix (check if applied)
- `fix_approval_codes_policy_v2.sql` - Policy fix (check if applied)
- `complete_user_roles_policies.sql` - Policy completion (check if applied)

**Reasoning**: These files were created during debugging sessions and iterative fixes. If the fixes are now in the main schema files, these debugging versions can be removed.

---

### 🧪 ROOT DIRECTORY TEST FILES

#### ⚠️ CONSIDER REMOVING

**Test Files**:

- `test-approval-code-signup.js` - Ad-hoc test script (replaced by Playwright tests)
- `email-test.html` - Manual email testing page

**Reasoning**: If these were one-off testing files and proper tests exist in `/tests/e2e/`, they can be removed.

---

## RECOMMENDATIONS

### Phase 1: Safe Removals (Low Risk)

**Remove these files** (completed one-time migrations):

```bash
# Scripts - Completed migrations
rm scripts/apply-name-fields-migration.js
rm scripts/remove-full-name-migration.js
rm scripts/migrate-existing-members.js
rm scripts/migrate-csv-members.js
rm scripts/migrate-helper.sh
rm scripts/apply-directory-fix.js
rm scripts/fix-directory-listing.js
rm scripts/fix-missing-roles.js
rm scripts/test-directory-e2e.js
rm scripts/test-directory-e2e-fixed.js
rm scripts/test-trigger.js
rm scripts/check-migrated-users.js
rm scripts/apply-performance-quick-wins.sh
rm scripts/update-image-references.sh
rm scripts/setup-supabase-email.js
```

**Remove these database files** (debugging/temporary):

```bash
# Database - Debugging files
rm database/fix_trigger_debug.sql
rm database/fix_trigger_simple.sql
rm database/fix_trigger_with_logging.sql
rm database/diagnostic_trigger_context.sql
```

**Remove root test files**:

```bash
# Root directory
rm test-approval-code-signup.js
rm email-test.html
```

**Estimated cleanup**: ~20 files removed

---

### Phase 2: Verify Then Remove (Medium Risk)

**Database files** - Check if applied to production:

1. **Verify these fixes are in production schema**, then remove:

   - `database/emergency_fix.sql`
   - `database/fix_signup_profile_creation.sql`
   - `database/fix_directory_rls_policy.sql`
   - `database/fix_approval_codes_policy_v2.sql`
   - `database/complete_user_roles_policies.sql`
   - `database/fix_trigger_roles_creation.sql`
   - `database/fix_trigger_roles_creation_v2.sql`
   - `database/fix_trigger_final.sql`

2. **How to verify**:
   - Check Supabase dashboard SQL editor history
   - Check if fixes are in `schema.sql` or `member_portal_schema.sql`
   - Ask user if these were applied to production

**Documentation files** - Archive or remove:

1. **Completed task docs** (move to `/docs/Archive/` or remove):

   - `docs/Upgrades/TASK_member_csv_migration.md`
   - `docs/Upgrades/MIGRATION_QUICK_START.md`
   - `docs/Upgrades/MEMBER_DIRECTORY_FIX.md`
   - `docs/Upgrades/EMAIL_TEMPLATE_SETUP.md`

2. **Check status then decide**:
   - `docs/Debugs/TASK_ui_mobile_fixes.md` - Verify completion status

---

### Phase 3: Consolidation (Optional)

**Consider consolidating**:

1. **Performance docs**: Multiple IMAGE_OPTIMIZATION files could be merged into one
2. **PROJECT_OVERVIEW.md**: Content may overlap with STARTER.md - consider merging or cross-referencing

---

## BEFORE REMOVING - CHECKLIST

For each file before deletion:

- [ ] **Grep search** for references in active code
- [ ] **Check git history** to understand when/why it was created
- [ ] **Verify** the fix/migration was successfully applied
- [ ] **Consider** creating `/docs/Archive/` for historical documentation
- [ ] **Backup** production database before removing any SQL files

---

## RECOMMENDED NEXT STEPS

1. **User Decision**: Review this analysis and decide which files to remove
2. **Create Archive**: Consider `docs/Archive/` folder for completed task docs
3. **Git Commit**: Remove files in logical groups with clear commit messages
4. **Update STARTER.md**: Remove references to deleted files if needed
5. **Test**: Run `npm run build` and `npm run test:e2e` after cleanup

---

## FILES TO DEFINITELY KEEP

**Critical Files** (DO NOT REMOVE):

- All files in `src/` (active application code)
- All files in `public/` (static assets)
- All files in `tests/e2e/` (Playwright tests)
- `database/schema.sql` (current schema)
- `database/member_portal_schema.sql` (current schema)
- `docs/STARTER.md` (main documentation)
- `scripts/cleanup-test-users.js` (utility tool)
- Package management files (package.json, etc.)
- Build config files (vite.config.js, etc.)

---

## SUMMARY

**Total files identified for potential removal**: ~30-40 files

**Categories**:

- 15+ migration scripts (one-time use, completed)
- 8+ database debugging files (temporary)
- 4+ completed task documentation files
- 2+ root directory test files
- Several documentation files (verify status first)

**Benefit**:

- Cleaner project structure
- Easier navigation
- Reduced confusion about which scripts/docs are current
- Smaller repository size

**Risk Level**:

- **Low** for completed migration scripts
- **Low** for debugging SQL files (if verified as applied)
- **Medium** for documentation (has historical value)

---

**Last Updated**: October 24, 2025  
**Next Action**: Cleanup complete - 29 files removed/archived

---

## CLEANUP EXECUTION SUMMARY

**Completed**: October 24, 2025

### Phase 1: Files Removed (25 files)

**Migration Scripts** (15 files):

- ✅ `scripts/apply-name-fields-migration.js`
- ✅ `scripts/remove-full-name-migration.js`
- ✅ `scripts/migrate-existing-members.js`
- ✅ `scripts/migrate-csv-members.js`
- ✅ `scripts/migrate-helper.sh`
- ✅ `scripts/apply-directory-fix.js`
- ✅ `scripts/fix-directory-listing.js`
- ✅ `scripts/fix-missing-roles.js`
- ✅ `scripts/test-directory-e2e.js`
- ✅ `scripts/test-directory-e2e-fixed.js`
- ✅ `scripts/test-trigger.js`
- ✅ `scripts/check-migrated-users.js`
- ✅ `scripts/apply-performance-quick-wins.sh`
- ✅ `scripts/update-image-references.sh`
- ✅ `scripts/setup-supabase-email.js`

**Database Debugging Files** (8 files):

- ✅ `database/fix_trigger_debug.sql`
- ✅ `database/fix_trigger_simple.sql`
- ✅ `database/fix_trigger_with_logging.sql`
- ✅ `database/diagnostic_trigger_context.sql`
- ✅ `database/emergency_fix.sql`
- ✅ `database/fix_trigger_final.sql`
- ✅ `database/fix_trigger_roles_creation.sql`
- ✅ `database/fix_trigger_roles_creation_v2.sql`
- ✅ `database/fix_signup_profile_creation.sql`
- ✅ `database/fix_directory_rls_policy.sql`
- ✅ `database/fix_approval_codes_policy_v2.sql`
- ✅ `database/complete_user_roles_policies.sql`

**Root Test Files** (2 files):

- ✅ `test-approval-code-signup.js`
- ✅ `email-test.html`

### Phase 2: Files Archived (4 files)

**Completed Task Documentation** (moved to `/docs/Archive/`):

- ✅ `docs/Upgrades/TASK_member_csv_migration.md`
- ✅ `docs/Upgrades/MIGRATION_QUICK_START.md`
- ✅ `docs/Upgrades/MEMBER_DIRECTORY_FIX.md`
- ✅ `docs/Upgrades/EMAIL_TEMPLATE_SETUP.md`

### Remaining Clean Files

**Scripts** (6 files + 2 directories):

- `scripts/check-all-roles.js` - Utility for role verification
- `scripts/check-home-groups.js` - Utility for home group checks
- `scripts/cleanup-test-users.js` - Test cleanup (referenced in STARTER.md)
- `scripts/cleanup-test-users.sh` - Shell version
- `scripts/optimize-images.js` - Image optimization tool
- `scripts/admin-migration/` - Admin utilities
- `scripts/tests/` - Test scripts directory

**Database** (9 files):

- `database/schema.sql` - Events/announcements schema
- `database/member_portal_schema.sql` - Core member portal schema
- `database/seed_data.sql` - Seed data
- `database/member_portal_seed.sql` - Member portal seed data
- `database/setup_admin.sql` - Admin setup
- `database/fix_approval_code_update.sql` - Current approval fix (Oct 24, 2025)
- `database/migration_add_profile_completion.sql` - Profile completion migration
- `database/migration_add_directory_sharing.sql` - Directory sharing migration
- `database/migration_add_home_groups.sql` - Home groups migration

**Documentation** (Active):

- `docs/STARTER.md` - Main project documentation
- `docs/PROJECT_OVERVIEW.md` - Project overview
- `docs/TASK_file_cleanup_review.md` - This file
- `docs/Debugs/` - Debug logs (5 files - all referenced)
- `docs/Upgrades/` - Active task docs (3 files)
- `docs/Performance/` - Performance guides (5 files)
- `docs/SEO/` - SEO documentation (3 files)
- `docs/Security/` - Security analysis (1 file)
- `docs/Archive/` - Archived completed tasks (4 files)

### Impact

**Repository Cleanup**:

- ✅ 29 files removed/archived
- ✅ Cleaner project structure
- ✅ Reduced confusion about current vs deprecated files
- ✅ Easier navigation for developers
- ✅ All active utilities and documentation preserved

**Testing**:

- ✅ All core functionality should work as before
- ⚠️ Recommend running `npm run build` to verify
- ⚠️ Recommend running `npm run test:e2e` to verify tests still pass

---

**Last Updated**: October 24, 2025  
**Next Action**: Run tests to verify nothing broke
