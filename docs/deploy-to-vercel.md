# Deploy to Vercel

This guide walks you through deploying the Horizon Banking application to Vercel.

## Prerequisites

- Vercel account connected to GitHub
- GitHub repository: `rhixecompany/banking`

## Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Search/select **`rhixecompany/banking`**
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

### Database

```
DATABASE_URL = postgresql://neondb_owner:ep-misty-truth-a85d73oi-pooler.eastus2.azure.neon.tech:5432/banking?sslmode=require
```

### Authentication

```
AUTH_SECRET = 0123456789abcdef0123456789abcdef
AUTH_TRUST_HOST = true
NEXTAUTH_URL = https://your-project.vercel.app (update after deployment)
```

### OAuth Providers

```
GITHUB_CLIENT_ID = Ov23lilsIaJtd4AnJW5H
GITHUB_CLIENT_SECRET = 97193202f818286994546cf691e1ceb1d186530c
```

### Rate Limiting (Upstash Redis)

```
UPSTASH_REDIS_REST_URL = https://pet-sawfish-10129.upstash.io
UPSTASH_REDIS_REST_TOKEN = ASeRAAIncDI4NGQ3MmQ3ZmY3ZGQ0NDMwYmIwNjMwZDFmZDYyMmNlNXAyMTAxMjk
```

### Plaid (Banking Integration)

```
PLAID_CLIENT_ID = 68839713794ed3001f58911a
PLAID_SECRET = 2a290a2bd612fcaf7cbb434f8cbd5c
PLAID_ENV = sandbox
PLAID_PRODUCTS = auth,transactions,identity
PLAID_COUNTRY_CODES = US,CA
```

### Error Monitoring (Sentry)

```
SENTRY_DSN = https://870b13f4a2a2ea91fb7fe128d5fe5b04@o4510833603772416.ingest.de.sentry.io/4510833606066256
NEXT_PUBLIC_SENTRY_DSN = https://870b13f4a2a2ea91fb7fe128d5fe5b04@o4510833603772416.ingest.de.sentry.io/4510833606066256
```

### Image Services

```
IMAGEKIT_PUBLIC_KEY = public_UCHMBUlsWeivU+MgIke3Q5Eos2Q=
IMAGEKIT_PRIVATE_KEY = private_b0vg7mL51ps2J+O7UzBSt7LPiSI=
IMAGEKIT_URL_ENDPOINT = https://ik.imagekit.io/bt7aws08b
```

## Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Vercel will provide your deployment URL: `https://your-project.vercel.app`

## Step 5: Post-Deployment Configuration

### Update NEXTAUTH_URL

After deployment, go back to Vercel environment variables and update:

```
NEXTAUTH_URL = https://your-actual-project.vercel.app
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

- Verify `AUTH_SECRET` is set (must be 32+ characters)
- Ensure `NEXTAUTH_URL` matches your deployment URL exactly
- Check GitHub OAuth callback URL is correct

### Database Connection Failed

- Verify `DATABASE_URL` is correct
- Ensure Neon PostgreSQL allows connections from Vercel IP ranges
- Check if database URL has `?sslmode=require`

### 307 Redirect Loop

- Clear browser cookies and cache
- Verify `AUTH_TRUST_HOST` is set to `true`

## Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [GitHub OAuth Apps](https://github.com/settings/developers)
