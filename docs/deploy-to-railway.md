# Deploy Banking App to Railway

## Overview

This guide covers deploying the banking app to Railway using GitHub Actions for automatic deployments.

## Prerequisites

- GitHub account (already connected: `rhixecompany/banking`)
- Railway account (to be created at railway.app)

---

## Phase 1: Railway Setup (Manual)

### 1.1 Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Authorize Railway to access your repositories

### 1.2 Create Railway Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose the `rhixecompany/banking` repository
4. Wait for initial deployment to fail (expected - we need to add database first)

### 1.3 Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Wait for provisioning to complete
4. Click "PostgreSQL" → "Connection"
5. Copy the `DATABASE_URL` (format: `postgres://user:password@host:5432/db`)

### 1.4 Configure Environment Variables

In Railway project → "Variables" tab, add:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | From PostgreSQL plugin |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Railway URL (e.g., `https://banking.up.railway.app`) |
| `AUTH_GITHUB_ID` | (optional) From GitHub OAuth App |
| `AUTH_GITHUB_SECRET` | (optional) From GitHub OAuth App |
| `AUTH_GOOGLE_ID` | (optional) From Google Cloud Console |
| `AUTH_GOOGLE_SECRET` | (optional) From Google Cloud Console |
| `PLAID_CLIENT_ID` | From Plaid dashboard |
| `PLAID_SECRET` | From Plaid dashboard |
| `PLAID_ENV` | `sandbox` |
| `DWOLLA_KEY` | From Dwolla dashboard |
| `DWOLLA_SECRET` | From Dwolla dashboard |
| `DWOLLA_BASE_URL` | `https://api-sandbox.dwolla.com` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Your email |
| `SMTP_PASS` | App password |
| `SENTRY_DSN` | (optional) From Sentry |
| `SENTRY_ORG` | (optional) Your Sentry org |
| `SENTRY_PROJECT` | (optional) Your Sentry project |

### 1.5 Get Railway URL

1. After adding variables, Railway will auto-redeploy
2. Once deployed, you'll get a URL like: `https://banking.up.railway.app`
3. Update `NEXTAUTH_URL` in Railway variables to this URL

---

## Phase 2: GitHub Actions Setup (Automated)

### 2.1 Add Railway Token to GitHub

1. In Railway → "Account Settings" → "Tokens"
2. Create new token named "GitHub Deploy"
3. Copy the token

### 2.2 Add Secrets to GitHub Repository

1. Go to `github.com/rhixecompany/banking/settings/secrets`
2. Add new repository secret:
   - Name: `RAILWAY_TOKEN`
   - Value: Your Railway token from step 2.1

### 2.3 Workflow File

The workflow is already created at `.github/workflows/deploy.yml`.

### 2.4 Add Additional GitHub Secrets

In `github.com/rhixecompany/banking/settings/secrets`, add:

| Secret Name          | Value                                |
| -------------------- | ------------------------------------ |
| `DATABASE_URL`       | Same as Railway (for build step)     |
| `NEXTAUTH_SECRET`    | Same as Railway                      |
| `NEXTAUTH_URL`       | Your Railway URL                     |
| `RAILWAY_PROJECT_ID` | From Railway project URL or settings |
| `SENTRY_DSN`         | (optional)                           |

---

## Phase 3: Deployment

### 3.1 Trigger Deployment

Push any change to the `main` branch:

```bash
git add .
git commit -m "Enable Railway deployment"
git push origin main
```

### 3.2 Monitor Deployment

1. Go to GitHub repository → "Actions" tab
2. Watch the "Deploy to Railway" workflow
3. Check Railway dashboard for deployment status

---

## Troubleshooting

### Build Fails

- Check GitHub Actions logs for errors
- Ensure all environment variables are set in GitHub secrets

### Database Connection Fails

- Verify `DATABASE_URL` is correct in Railway
- Ensure PostgreSQL plugin is active

### Authentication Issues

- Regenerate `NEXTAUTH_SECRET`
- Ensure `NEXTAUTH_URL` matches your Railway URL exactly

---

## Useful Commands

```bash
# View Railway logs
railway logs

# Open Railway shell
railway run sh

# Check environment
railway env
```
