# Deploy Banking App to Hostinger VPS

## Overview

This guide covers deploying the banking app to a Hostinger KVM VPS with Neon PostgreSQL database.

## Prerequisites

- Hostinger KVM 1 plan (or higher)
- Neon account (free tier at [neon.tech](https://neon.tech))
- GitHub repository with the banking app code

---

## Phase 1: Neon Database Setup

### 1.1 Create Neon Account

1. Go to [neon.tech](https://neon.tech)
2. Click "Sign Up" → "GitHub" to sign in with your GitHub account
3. Authorize Neon to access your GitHub repositories

### 1.2 Create a New Project

1. In Neon dashboard, click "Create Project"
2. Name your project (e.g., `banking-app`)
3. Select the closest region to your Hostinger VPS location
4. Click "Create Project"

### 1.3 Get Connection String

1. Once the project is created, click "Connection Details"
2. Select "Pooled connection" (recommended) or "Direct connection"
3. Copy the connection string — it will look like:

```
postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/banking?sslmode=require

```

1. **Save this connection string** — you'll need it for the DATABASE_URL environment variable

> **Note**: For security, create a separate user with limited permissions instead of using the default root user. In Neon: Settings → Roles → Create Role.

---

## Phase 2: Hostinger VPS Setup

### 2.1 Access Your VPS

1. Log in to Hostinger hPanel
2. Go to VPS → Your VPS plan
3. Click "SSH Access" to get your credentials:
   - IP Address
   - Username (usually `root`)
   - Password

4. Connect via terminal (Mac/Linux) or PuTTY (Windows):

   ```bash
   ssh root@YOUR_VPS_IP
   ```

### 2.2 Update System Packages

```bash
apt update && apt upgrade -y
```

### 2.3 Install Node.js 20.x

```bash
# Install NodeSource repository for Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version
```

### 2.4 Install PM2 (Process Manager)

PM2 keeps your Next.js app running even after you close the SSH connection.

```bash
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### 2.5 Install nginx

nginx will act as a reverse proxy to forward traffic to your Next.js app.

```bash
sudo apt install -y nginx
```

---

## Phase 3: Application Deployment

### 3.1 Clone the Repository

```bash
# Navigate to web directory
cd /var/www

# Clone your repository (replace with your actual repo URL)
git clone https://github.com/rhixecompany/banking.git

# Navigate to the project directory
cd banking
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Configure Environment Variables

1. Create the `.env` file:

```bash
nano .env
```

1. Add the following variables:

```env
# ============ DATABASE ============
# From Neon dashboard (Phase 1)
DATABASE_URL=postgresql://neondb_owner:npg_f3MZAHjDJ0lz@ep-weathered-hall-amij2m6x-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# ============ AUTH ============
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=uXhdStI+pNRt0YsNktJ1QxePMala6d/OEdDoS885kE0=
NEXTAUTH_URL=[http://YOUR_VPS_IP](http://76.13.26.9/)
NEXT_PUBLIC_SITE_URL=[http://YOUR_VPS_IP](http://76.13.26.9/)

# ============ PLAID (Banking Integration) ============
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SECRET=your-plaid-secret
PLAID_ENV=sandbox
PLAID_PRODUCTS=auth,transactions,identity
PLAID_COUNTRY_CODES=US,CA

# ============ DWOLLA (Fund Transfers) ============
DWOLLA_KEY=your-dwolla-key
DWOLLA_SECRET=your-dwolla-secret
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
DWOLLA_ENV=sandbox

# ============ SMTP (Email - Optional) ============
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

1. Save and exit (Ctrl+O, Enter, Ctrl+X)

### 3.4 Generate NEXTAUTH_SECRET

If you haven't generated a secret yet, run:

```bash
openssl rand -base64 32
```

Copy the output and add it as `NEXTAUTH_SECRET` in your `.env` file.

### 3.5 Run Database Migrations

```bash
npm run db:push
```

Or if you need to generate and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

### 3.6 Build the Application

```bash
npm run build
```

This may take several minutes. Ensure the build completes without errors.

### 3.7 Start the Application with PM2

```bash
pm2 start npm --name "banking" -- start
```

Verify it's running:

```bash
pm2 status
pm2 logs banking
```

### 3.8 Configure PM2 Auto-Restart

```bash
# Save current PM2 process list
pm2 save

# Generate startup script
pm2 startup
```

Copy and run the output command to enable auto-restart on server reboot.

---

## Phase 4: Nginx Reverse Proxy

### 4.1 Create Nginx Configuration

```bash
nano /etc/nginx/sites-available/banking
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name YOUR_VPS_IP;

    # Forward all requests to Next.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
    }
}
```

### 4.2 Enable the Site

```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/banking /etc/nginx/sites-enabled/

# Test nginx configuration
nginx -t

# Restart nginx
systemctl restart nginx
```

---

## Phase 5: Access Your Application

### 5.1 Verify Everything is Running

```bash
# Check PM2 status
pm2 status

# Check nginx status
systemctl status nginx

# Check application logs
pm2 logs banking --lines 50
```

### 5.2 Access the App

Open your browser and navigate to:

```
[http://YOUR_VPS_IP](http://76.13.26.9/)
```

Replace `YOUR_VPS_IP` with your actual Hostinger VPS IP address.

---

## Phase 6: Maintenance & Updates

### 6.1 Updating the Application

When you push changes to your GitHub repository:

```bash
# Navigate to project directory
cd /var/www/banking

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Rebuild the application
npm run build

# Restart PM2
pm2 restart banking
```

### 6.2 Useful Commands

```bash
# View application logs
pm2 logs banking

# View logs with timestamps
pm2 logs banking --time

# Monitor CPU/Memory usage
pm2 monit

# Restart the application
pm2 restart banking

# Stop the application
pm2 stop banking

# View all PM2 processes
pm2 list
```

### 6.3 Troubleshooting

#### App Won't Start

```bash
# Check for errors
pm2 logs banking --err --lines 100

# Common issues:
# - DATABASE_URL is incorrect
# - Missing environment variables
# - Port 3000 is already in use
```

#### Database Connection Failed

1. Verify DATABASE_URL is correct
2. Check Neon dashboard — ensure project is active
3. Test connection from VPS:

   ```bash
   apt install -y postgresql-client
   psql "your-database-url"
   ```

#### nginx 502 Bad Gateway

```bash
# Check if Next.js is running
pm2 status

# Check nginx error logs
tail -f /var/log/nginx/error.log
```

---

## Security Recommendations

### 1. Firewall Configuration

```bash
# Allow SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 2. Keep Software Updated

```bash
# Regular updates
apt update && apt upgrade -y
```

### 3. Secure .env File

```bash
# Prevent others from reading .env
chmod 600 .env
```

---

## Cost Summary

| Service          | Cost            |
| ---------------- | --------------- |
| Hostinger KVM 1  | $6.49/month     |
| Neon (Free Tier) | $0              |
| **Total**        | **$6.49/month** |

---

## Next Steps

### Add a Domain (Optional)

If you want to use a custom domain:

1. Buy a domain from Hostinger or any registrar
2. In Hostinger DNS settings, add an A record pointing to your VPS IP
3. Install Certbot for free SSL:

   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

4. Update NEXTAUTH_URL and NEXT_PUBLIC_SITE_URL in .env

---

## Useful Links

- [Neon Documentation](https://neon.tech/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [Hostinger VPS Knowledge Base](https://www.hostinger.com/tutorials)
