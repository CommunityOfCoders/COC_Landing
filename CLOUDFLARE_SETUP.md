# Cloudflare Pages Deployment Guide

This guide covers deploying the COC Website to Cloudflare Pages using OpenNext Cloudflare adapter.

## Prerequisites

- Node.js >= 22.0.0 (check with `node -v`)
- Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Wrangler

Login to your Cloudflare account:

```bash
npx wrangler login
```

### 3. Add Secrets

All sensitive environment variables must be added as Cloudflare secrets (not in `wrangler.toml`):

```bash
# Google OAuth
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET

# NextAuth
npx wrangler secret put NEXTAUTH_SECRET

# Supabase
npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY

# JWT
npx wrangler secret put JWT_SECRET
```

You'll be prompted to enter each value interactively.

### 4. Local Development

For local testing with Wrangler:

1. Copy `.dev.vars.example` to `.dev.vars`:
   ```bash
   cp .dev.vars.example .dev.vars
   ```

2. Fill in your values in `.dev.vars`

3. Run the development server:
   ```bash
   npx wrangler dev
   ```

### 5. Deploy to Cloudflare Pages

#### Option A: Direct Upload (Recommended)

```bash
npm run build:cf
npx wrangler pages deploy .open-next --project-name=coc-website
```

#### Option B: GitHub Integration

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build:cf`
   - **Build output directory**: `.open-next`
   - **Root directory**: `/`
5. Add all secrets in **Settings** → **Environment variables** → **Production** → **Add variable**

### 6. Environment Variables in Cloudflare Dashboard

For non-secret variables, add them in the Cloudflare Pages dashboard:

1. Go to your project settings
2. Navigate to **Environment variables**
3. Add:
   - `NEXT_OUTPUT_STANDALONE` = `false`
   - `NODE_VERSION` = `22`

## Troubleshooting

### Build Fails with "Unsupported engine"

Ensure you're using Node.js >= 22.0.0:

```bash
node -v  # Should show v22.x.x or higher
nvm use 22  # If using nvm
```

### Missing Secrets

If you see errors about missing environment variables at runtime:

```bash
# List all secrets
npx wrangler secret list

# Re-add any missing secrets
npx wrangler secret put <SECRET_NAME>
```

### Middleware Issues

The middleware uses NextAuth for authentication. Ensure:
- `NEXTAUTH_SECRET` is correctly set as a secret
- Your authentication provider is properly configured

### Worker Size Limit Exceeded

If your build exceeds Cloudflare's worker size limit:

1. Check for large dependencies in your bundle
2. Use dynamic imports for heavy components
3. Consider moving server-heavy logic to API routes

## Project Structure

```
├── .dev.vars.example    # Template for local development variables
├── wrangler.toml        # Cloudflare Pages configuration
├── open-next.config.ts  # OpenNext configuration
├── next.config.mjs      # Next.js config
└── middleware.ts        # Edge middleware for auth protection
```

## Configuration Files

### wrangler.toml

```toml
name = "coc-website"
compatibility_flags = ["nodejs_compat"]
compatibility_date = "2026-02-01"

[build]
command = "npm run build && npx @opennextjs/cloudflare build"

[vars]
NODE_VERSION = "22"
NEXT_OUTPUT_STANDALONE = "false"
```

### open-next.config.ts

```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Default configuration for Cloudflare Pages
});
```

### next.config.mjs

The `output: 'standalone'` setting is disabled for Cloudflare builds. It's only enabled for Docker deployments via the `NEXT_OUTPUT_STANDALONE` environment variable.

## Useful Commands

```bash
# Check Wrangler version
wrangler --version

# View deployment logs
npx wrangler pages deployment list

# Tail deployment logs
npx wrangler tail

# Open project in browser
npx wrangler pages project open coc-website

# Local development
npx wrangler dev
```

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [OpenNext Cloudflare](https://opennext.js.org/cloudflare)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
