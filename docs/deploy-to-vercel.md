# Deploy to Vercel

This guide walks you through deploying the Banking application to Vercel.

## Prerequisites

- Vercel account connected to GitHub
- GitHub repository: your Banking repo

## Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Search/select your Banking repository
5. Framework: **Next.js** (auto-detected)

## Step 2: Configure Build Settings

In the Vercel project configuration screen:

| Setting              | Value           |
| -------------------- | --------------- |
| **Build Command**    | `npm run build` |
| **Output Directory** | `.next`         |
| **Install Command**  | `npm install`   |

## Step 3: Add Environment Variables

Add these in Vercel dashboard → **Environment Variables** section:

> ⚠️ **Security:** Never paste real secrets into documentation. Use placeholders and provide real values only in the Vercel UI or secure secret stores.

### Database

```
DATABASE_URL = postgresql://<user>:<password>@<host>:5432/banking?sslmode=require
```

### Authentication

```
NEXTAUTH_SECRET = <32+ character secret>
NEXTAUTH_URL = https://your-project.vercel.app
NEXT_PUBLIC_SITE_URL = https://your-project.vercel.app
```

### OAuth Providers (optional)

```
AUTH_GITHUB_ID = <github-oauth-client-id>
AUTH_GITHUB_SECRET = <github-oauth-client-secret>
AUTH_GOOGLE_ID = <google-oauth-client-id>
AUTH_GOOGLE_SECRET = <google-oauth-client-secret>
```

### Redis (optional)

```
REDIS_URL = redis://:<password>@<host>:6379
```

### Plaid (optional)

```
PLAID_CLIENT_ID = <plaid-client-id>
PLAID_SECRET = <plaid-secret>
PLAID_ENV = sandbox
PLAID_BASE_URL = https://sandbox.plaid.com
```

### Dwolla (optional)

```
DWOLLA_KEY = <dwolla-key>
DWOLLA_SECRET = <dwolla-secret>
DWOLLA_ENV = sandbox
DWOLLA_BASE_URL = https://api-sandbox.dwolla.com
```

## Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Vercel will provide your deployment URL: `https://your-project.vercel.app`

## Step 5: Post-Deployment Configuration

### Update NEXTAUTH_URL and NEXT_PUBLIC_SITE_URL

After deployment, go back to Vercel environment variables and update:

```
NEXTAUTH_URL = https://your-actual-project.vercel.app
NEXT_PUBLIC_SITE_URL = https://your-actual-project.vercel.app
```

### Update GitHub OAuth Settings

1. Go to **GitHub** → **Settings** → **Developer settings** → **OAuth Apps**
2. Click on your OAuth app (Horizon Banking)
3. Update the following:

| Field | Value |
| --- | --- |
| **Homepage URL** | `https://your-project.vercel.app` |
| **Authorization callback URL** | `https://your-project.vercel.app/api/auth/callback/github` |

## Step 6: Custom Domain (Optional)

To add a custom domain:

1. In Vercel → **Settings** → **Domains**
2. Enter your domain name (e.g., `banking.yoursite.com`)
3. Add the DNS records provided by Vercel to your domain registrar
4. Wait for SSL certificate to be provisioned

## Troubleshooting

### Build Fails

- Ensure all environment variables are set
- Check Vercel build logs for specific errors
- Verify `package.json` scripts are correct

### Authentication Not Working

- Verify `NEXTAUTH_SECRET` is set (must be 32+ characters)
- Ensure `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` match your deployment URL exactly
- Check GitHub OAuth callback URL is correct

### Database Connection Failed

- Verify `DATABASE_URL` is correct
- Ensure Neon PostgreSQL allows connections from Vercel IP ranges
- Check if database URL has `?sslmode=require`

### 307 Redirect Loop

- Clear browser cookies and cache
- Verify `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` match your deployment URL exactly

## Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [GitHub OAuth Apps](https://github.com/settings/developers)
