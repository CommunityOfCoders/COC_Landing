# Project Showcase Feature - Setup Guide

## Overview

This feature adds a complete project showcase and submission system to the COC website, allowing users to submit their projects for review and display them in a public showcase once approved by admins.

## Features

### User-Facing Features
- **Project Showcase Page** (`/projects`)
  - Browse all approved projects
  - Filter by category (Web Dev, App Dev, ML, AI, Blockchain, etc.)
  - View featured projects
  - Like projects (requires authentication)
  - View project details in a modal
  - Track views and likes
  - Search and filter functionality

- **Project Submission**
  - Submit projects for review
  - Add project details (title, description, category, tags)
  - Include links (GitHub, live demo, video)
  - Add team information
  - Upload project images

### Admin Features
- **Project Management Dashboard** (Admin Dashboard > Projects tab)
  - Review pending project submissions
  - Approve or reject projects
  - Add review notes
  - Toggle featured status
  - Delete projects
  - View submission statistics

## Database Setup

### Step 1: Run Migrations

Execute the following SQL migrations in your Supabase database in order:

#### 1. Create Projects Table
```sql
-- File: supabase/migrations/create_projects_table.sql
```
This migration creates:
- `projects` table with all necessary fields
- `project_likes` table for tracking user likes
- Indexes for performance optimization
- Row Level Security (RLS) policies
- Automatic timestamp updates

#### 2. Create Helper Functions
```sql
-- File: supabase/migrations/create_increment_views_function.sql
```
This creates the `increment_project_views()` function for atomic view count updates.

### Step 2: Verify Tables

After running migrations, verify the tables exist:

```sql
-- Check projects table
SELECT * FROM projects LIMIT 1;

-- Check project_likes table
SELECT * FROM project_likes LIMIT 1;
```

### Step 3: Test RLS Policies

RLS policies are automatically enabled. Test them:

```sql
-- Test viewing approved projects (should work)
SELECT * FROM projects WHERE status = 'approved';

-- Test viewing all projects (requires admin or owner)
SELECT * FROM projects;
```

## Database Schema

### Projects Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR(255) | Project title |
| description | TEXT | Short description |
| full_description | TEXT | Detailed description |
| category | VARCHAR(100) | Project category |
| tags | TEXT[] | Array of tags |
| github_url | VARCHAR(500) | GitHub repository URL |
| live_url | VARCHAR(500) | Live demo URL |
| video_url | VARCHAR(500) | Video demo URL |
| image_url | VARCHAR(500) | Main project image |
| additional_images | TEXT[] | Additional images |
| team_name | VARCHAR(255) | Team name |
| team_members | JSONB | Array of team member objects |
| submitted_by | VARCHAR(255) | User email |
| submitter_name | VARCHAR(255) | User name |
| submitter_year | INTEGER | Student year |
| submitter_branch | VARCHAR(100) | Student branch |
| status | VARCHAR(50) | pending/approved/rejected |
| review_notes | TEXT | Admin review notes |
| reviewed_by | VARCHAR(255) | Reviewer email |
| reviewed_at | TIMESTAMPTZ | Review timestamp |
| is_featured | BOOLEAN | Featured flag |
| views_count | INTEGER | View count |
| likes_count | INTEGER | Like count |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Update timestamp |

### Project Likes Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| project_id | UUID | Foreign key to projects |
| user_email | VARCHAR(255) | User email |
| created_at | TIMESTAMPTZ | Like timestamp |

## Valid Categories

- `web-development`
- `app-development`
- `machine-learning`
- `blockchain`
- `iot`
- `game-development`
- `ai`
- `data-science`
- `cybersecurity`
- `other`

## Server Actions

All project operations are handled through server actions in `app/actions/projects.ts`:

### User Actions
- `getApprovedProjects(category?, featured?)` - Get all approved projects
- `getProjectById(id, incrementView?)` - Get single project
- `submitProject(projectData)` - Submit new project
- `getMyProjects()` - Get user's own projects
- `toggleProjectLike(projectId)` - Like/unlike project
- `hasUserLikedProject(projectId)` - Check if user liked project
- `deleteProject(projectId)` - Delete own project

### Admin Actions
- `getAllProjects(status?)` - Get all projects (requires admin)
- `reviewProject(projectId, reviewData)` - Approve/reject project
- `toggleFeaturedProject(projectId)` - Toggle featured status

## Usage Examples

### Submitting a Project

```typescript
const projectData: ProjectSubmission = {
  title: "My Awesome Project",
  description: "A brief description",
  fullDescription: "Detailed description with features and tech stack",
  category: "web-development",
  tags: ["React", "Next.js", "TypeScript"],
  githubUrl: "https://github.com/username/repo",
  liveUrl: "https://myproject.com",
  imageUrl: "https://example.com/image.png",
  teamName: "Team Awesome",
  teamMembers: [
    { name: "John Doe", role: "Frontend", email: "john@example.com" },
    { name: "Jane Smith", role: "Backend", email: "jane@example.com" }
  ]
};

const result = await submitProject(projectData);
```

### Reviewing a Project (Admin)

```typescript
const reviewData: ProjectReviewData = {
  status: "approved",
  reviewNotes: "Great project! Well documented."
};

const result = await reviewProject(projectId, reviewData);
```

## File Structure

```
app/
├── projects/
│   └── page.tsx              # Project showcase page
├── actions/
│   └── projects.ts           # Server actions
├── admin-dashboard/
│   └── page.tsx              # Updated with Projects tab

components/
├── ProjectSubmissionModal.tsx    # Project submission form
├── ProjectDetailsModal.tsx       # Project details viewer
└── admin/
    └── ProjectManagement.tsx     # Admin project management

types/
└── projects.ts               # TypeScript types

supabase/
└── migrations/
    ├── create_projects_table.sql
    └── create_increment_views_function.sql
```

## Security & Permissions

### Row Level Security Policies

1. **View Projects**: Anyone can view approved projects, users can view their own pending/rejected projects
2. **Submit Projects**: Authenticated users can submit projects
3. **Update Projects**: Users can update their own pending projects
4. **Admin Actions**: Only admins can review, approve, reject, feature, or delete any project

### Admin Check

Admin status is verified via the `users` table:
```sql
SELECT is_admin FROM users WHERE email = 'user@example.com';
```

## Testing Checklist

- [ ] Run database migrations successfully
- [ ] Verify tables and indexes created
- [ ] Test RLS policies
- [ ] Submit a test project as a regular user
- [ ] View pending projects as admin
- [ ] Approve/reject projects as admin
- [ ] Toggle featured status
- [ ] Like/unlike projects
- [ ] View project details
- [ ] Filter projects by category
- [ ] Delete projects (as owner and admin)

## Troubleshooting

### Projects not appearing
- Check if projects are approved: `SELECT * FROM projects WHERE status = 'approved';`
- Verify RLS policies are working correctly

### Can't submit projects
- Ensure user is authenticated
- Check user profile exists in `users` table
- Verify email matches session email

### Admin features not working
- Verify `is_admin = 1` in users table
- Check session email matches admin email

## Future Enhancements

- [ ] Project search functionality
- [ ] Advanced filtering (tags, date range)
- [ ] Project comments/feedback
- [ ] Project upvoting system
- [ ] Analytics dashboard for project views
- [ ] Email notifications for project status changes
- [ ] Project categories suggestions
- [ ] Bulk import projects
- [ ] Export project data

## Support

For issues or questions, contact the development team or create an issue in the repository.
