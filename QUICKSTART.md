# Quick Start Guide - Project Showcase Feature

## 🚀 Getting Started

Follow these steps to set up the project showcase feature on your COC website.

### Step 1: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

This will install the newly added `@radix-ui/react-select` dependency.

### Step 2: Run Database Migrations

Connect to your Supabase project and execute the SQL migrations in order:

#### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of each migration file:
   - First: `supabase/migrations/create_projects_table.sql`
   - Then: `supabase/migrations/create_increment_views_function.sql`
4. Click "Run" for each migration

#### Option B: Using Supabase CLI
```bash
# Make sure you have Supabase CLI installed
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Step 3: Verify Database Setup

Run this query in Supabase SQL Editor to verify:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('projects', 'project_likes');

-- Should return 2 rows
```

### Step 4: Set Up Admin Access

Make yourself an admin by running this in Supabase SQL Editor:

```sql
UPDATE users
SET is_admin = 1
WHERE email = 'your-email@example.com';
```

Replace `your-email@example.com` with your actual email.

### Step 5: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/projects` to see the project showcase page.

### Step 6: Test the Feature

#### As a User:
1. Navigate to `/projects`
2. Click "Submit Your Project" (must be signed in)
3. Fill out the form and submit
4. Your project will appear with "Pending" status

#### As an Admin:
1. Navigate to `/admin-dashboard`
2. Click on "Projects" tab
3. Review pending submissions
4. Approve or reject projects
5. Toggle featured status as needed

## 📁 Key Files & Locations

### User-Facing Pages
- **Project Showcase**: `/projects`
- **Project Submission**: Click button on showcase page

### Admin Pages
- **Project Management**: `/admin-dashboard` → Projects tab

### Database
- **Tables**: `projects`, `project_likes`
- **Migrations**: `supabase/migrations/`
- **Queries Reference**: `supabase/queries/project_queries.sql`

## 🔧 Common Tasks

### View All Projects (SQL)
```sql
SELECT id, title, status, submitter_name, created_at
FROM projects
ORDER BY created_at DESC;
```

### Approve a Project (SQL)
```sql
UPDATE projects
SET 
    status = 'approved',
    reviewed_by = 'admin@example.com',
    reviewed_at = NOW()
WHERE id = 'project-id-here';
```

### Make a Project Featured (SQL)
```sql
UPDATE projects
SET is_featured = true
WHERE id = 'project-id-here'
AND status = 'approved';
```

### Get Pending Projects Count (SQL)
```sql
SELECT COUNT(*) as pending_count
FROM projects
WHERE status = 'pending';
```

## ❓ Troubleshooting

### Projects Not Showing Up
- **Check status**: Only approved projects show on public page
- **Check RLS**: Ensure Row Level Security policies are active
- **Check database**: Run `SELECT * FROM projects` to see all records

### Can't Submit Projects
- **Sign in required**: User must be authenticated
- **Check session**: Verify NextAuth session is working
- **Check user table**: User profile must exist in `users` table

### Admin Features Not Working
- **Check admin status**: Run `SELECT is_admin FROM users WHERE email = 'your-email'`
- **Should return 1**: If not, update using Step 4 above
- **Clear cache**: Sign out and sign in again after making admin

### Missing UI Components
- **Run npm install**: Ensure `@radix-ui/react-select` is installed
- **Check imports**: Verify all imports in component files are correct
- **Restart dev server**: Stop and restart `npm run dev`

## 📊 Feature Overview

### User Features ✅
- Browse approved projects
- Filter by category
- View project details
- Like/unlike projects
- Submit new projects
- Track your submissions

### Admin Features ✅
- Review submissions
- Approve/reject with notes
- Toggle featured status
- Delete projects
- View statistics
- Filter by status

## 🎨 Customization

### Change Project Categories
Edit `types/projects.ts` and update the `ProjectCategory` type:

```typescript
export type ProjectCategory = 
  | 'web-development'
  | 'app-development'
  | 'your-new-category';
```

Also update the constraint in `create_projects_table.sql`:

```sql
CONSTRAINT valid_category CHECK (category IN (
    'web-development',
    'app-development',
    'your-new-category'
))
```

### Modify Theme Colors
The project uses the existing theme. To customize, edit the gradient colors in:
- `app/projects/page.tsx`
- `components/ProjectSubmissionModal.tsx`
- `components/admin/ProjectManagement.tsx`

Look for gradient classes like:
```tsx
className="bg-gradient-to-r from-blue-500 to-purple-600"
```

## 📚 Additional Resources

- **Full Documentation**: `PROJECT_SHOWCASE_SETUP.md`
- **Implementation Details**: `IMPLEMENTATION_SUMMARY.md`
- **SQL Queries**: `supabase/queries/project_queries.sql`

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review the full documentation files
3. Check Supabase logs for database errors
4. Verify all migrations ran successfully
5. Contact the development team

## ✨ Next Steps

After setup, you can:
1. Submit test projects
2. Test the review workflow
3. Customize categories for your needs
4. Add featured projects to homepage
5. Set up email notifications (future enhancement)

---

**Ready to go!** 🎉 Your project showcase feature is now set up and ready to use.
