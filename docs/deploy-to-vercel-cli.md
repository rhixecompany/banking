# Deploy to Vercel CLI

This guide walks you through deploying the Horizon Banking application to Vercel using the Vercel CLI.

## Prerequisites

- Vercel CLI installed (`npm i -g vercel`)
- Vercel account
- GitHub repository connected to Vercel (optional but recommended)

## Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

Or using pnpm:

```bash
pnpm add -g vercel
```

## Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate with your Vercel account.

## Step 3: Navigate to Project

```bash
cd path/to/your/banking-app
```

## Step 4: Deploy to Preview

To deploy to a preview URL (for testing):

```bash
vercel
```

Follow the prompts:

1. Set up and deploy? `Y`
2. Which scope? Select your account
3. Link to existing project? `N` (for first deploy) or `Y` (if already linked)
4. Project name? `banking` (or your preferred name)
5. Directory? `.` (current directory)
6. Override settings? `N`

Vercel will provide a preview URL like: `https://banking-abc123.vercel.app`

## Step 5: Deploy to Production

### Option A: Promote Preview to Production

If you have a successful preview deployment:

```bash
vercel --prod
```

### Option B: Direct Production Deploy

To deploy directly to production:

```bash
vercel --prod
```

## Step 6: Environment Variables

When deploying via CLI, you can set environment variables:

### Set during deployment

```bash
vercel env add DATABASE_URL
```

### Set for production only

```bash
vercel env add DATABASE_URL --environment=production
```

### Set for preview only

```bash
vercel env add DATABASE_URL --environment=preview
```

### Pull environment variables from Vercel

```bash
vercel env pull
```

This creates a `.env` file with all your Vercel environment variables.

## Required Environment Variables

### Database

```bash
vercel env add DATABASE_URL
# postgresql://neondb_owner:xxxxx@xxxxx.neon.tech:5432/banking?sslmode=require
```

### Authentication

```bash
vercel env add AUTH_SECRET
# Generate a secure 32+ character string

vercel env add AUTH_TRUST_HOST
# true

vercel env add NEXTAUTH_URL
# https://your-project.vercel.app (update after deployment)
```

### OAuth Providers

```bash
vercel env add GITHUB_CLIENT_ID
# Your GitHub OAuth Client ID

vercel env add GITHUB_CLIENT_SECRET
# Your GitHub OAuth Client Secret
```

### Rate Limiting (Upstash Redis)

```bash
vercel env add UPSTASH_REDIS_REST_URL
vercel env add UPSTASH_REDIS_REST_TOKEN
```

### Plaid

```bash
vercel env add PLAID_CLIENT_ID
vercel env add PLAID_SECRET
vercel env add PLAID_ENV
# sandbox
```

### Error Monitoring (Sentry)

```bash
vercel env add SENTRY_DSN
vercel env add NEXT_PUBLIC_SENTRY_DSN
```

## Step 7: View Deployment Status

```bash
vercel ls
```

This shows all your deployments with their status and URLs.

## Step 8: View Logs

```bash
vercel logs banking-abc123.vercel.app
```

Or for the current project:

```bash
vercel logs
```

## Step 9: Manage Domains

### Add custom domain

```bash
vercel domains add banking.yoursite.com
```

### List domains

```bash
vercel domains ls
```

## Useful Commands

| Command              | Description                     |
| -------------------- | ------------------------------- |
| `vercel`             | Deploy to preview               |
| `vercel --prod`      | Deploy to production            |
| `vercel ls`          | List deployments                |
| `vercel logs`        | View deployment logs            |
| `vercel env add`     | Add environment variable        |
| `vercel env rm`      | Remove environment variable     |
| `vercel domains add` | Add custom domain               |
| `vercel rollback`    | Rollback to previous deployment |
| `vercel inspect`     | Inspect deployment details      |
| `vercel alias`       | Set alias for deployment        |
| `vercel rm`          | Remove deployment               |

## Troubleshooting

### Build fails

Check build logs:

```bash
vercel logs your-project.vercel.app --build
```

### Environment variable issues

Verify variables are set:

```bash
vercel env ls
```

### Force redeploy

```bash
vercel --force
```

### Switch between projects

```bash
vercel link
```

This relinks the current directory to a different Vercel project.

## CI/CD Integration

For automated deployments, use a Vercel token:

```bash
vercel --token YOUR_VERCEL_TOKEN
```

Set the token in your CI environment:

```bash
export VERCEL_TOKEN=your_token_here
```

## Links

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Vercel Dashboard](https://vercel.com/dashboard)
