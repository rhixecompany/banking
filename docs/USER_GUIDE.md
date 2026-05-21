# User Guide

## Introduction

The Banking application is a full-stack fintech platform for managing personal finances, connecting bank accounts, and processing ACH transfers.

## What You Can Do

- **Create Account**: Sign up with email and password
- **Connect Banks**: Link bank accounts via Plaid
- **View Balances**: See all connected account balances
- **Transfer Money**: Send funds via ACH (Dwolla)
- **Transaction History**: View past transactions
- **Manage Recipients**: Save frequently used recipients

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Bank account with online access (for connecting)
- Valid email address

### Installation (Self-Hosted)

```bash
# Install dependencies
bun install

# Set up environment
cp .env.example .env.local

# Configure your API keys (Plaid, Dwolla)

# Start database
docker-compose up -d

# Push schema
bun run db:push

# Start application
bun run dev
```

Visit `http://localhost:3000` in your browser.

## Using the Application

### 1. Creating an Account

1. Click "Sign Up"
2. Enter your email and password
3. Confirm password
4. Click "Create Account"

### 2. Connecting a Bank

1. Navigate to "Wallets" or "Connect Bank"
2. Click "Connect Bank Account"
3. Authenticate with your bank via Plaid Link
4. Select accounts to connect
5. Accounts appear in your wallet

### 3. Viewing Balance

Connected accounts display:

- Current balance
- Available balance
- Account type (checking/savings)
- Last updated timestamp

### 4. Transferring Money

1. Click "Transfer" or "Send Money"
2. Select recipient (or add new)
3. Enter amount
4. Review and confirm
5. Await processing (1-3 business days for ACH)

### 5. Managing Recipients

Add recipients for quick transfers:

- Name
- Email or account number
- Bank details (for ACH)

## Configuration

### Environment Variables

| Variable          | Description                   | Required |
| ----------------- | ----------------------------- | -------- |
| `DATABASE_URL`    | PostgreSQL connection string  | Yes      |
| `NEXTAUTH_SECRET` | Secret for session encryption | Yes      |
| `PLAID_CLIENT_ID` | Plaid API client ID           | Yes      |
| `PLAID_SECRET`    | Plaid API secret              | Yes      |
| `DWOLLA_KEY`      | Dwolla API key                | Yes      |
| `DWOLLA_SECRET`   | Dwolla API secret             | Yes      |

### Plaid Integration

Plaid handles bank authentication. The app supports:

- Checking accounts
- Savings accounts
- Multiple institutions

### Dwolla Integration

Dwolla handles ACH transfers:

- Standard ACH: 1-3 business days
- Same-day ACH: Available in production

## Troubleshooting

### Bank Connection Issues

**"Connection failed"**

- Verify bank supports Plaid
- Check Plaid credentials in `.env`
- Try again or contact bank

**"Institution not found"**

- Bank may not be supported in Plaid Sandbox
- Check supported institutions in Plaid dashboard

### Transfer Issues

**"Transfer pending"**

- ACH transfers take 1-3 business days
- Check Dwolla dashboard for status

**"Transfer failed"**

- Insufficient funds
- Invalid account details
- Contact support for assistance

### Account Issues

**"Cannot create account"**

- Email already in use
- Password doesn't meet requirements (8+ chars)

**"Cannot sign in"**

- Verify credentials
- Check email verification
- Reset password if needed

## Security

- **Passwords**: Encrypted with bcrypt
- **Sessions**: HTTP-only secure cookies
- **API Keys**: Stored in environment variables
- **Bank Tokens**: Encrypted at rest
- **Soft Delete**: Data never hard-deleted

## Data Handling

### Personal Data

- Email, name stored in database
- Passwords hashed (never stored in plain text)
- Bank tokens encrypted

### Financial Data

- Account balances from Plaid
- Transactions stored locally
- ACH details via Dwolla

### Privacy

- No data sold to third parties
- Bank credentials never stored
- Encryption for sensitive data

## Frequently Asked Questions

**Is this a real bank?** No, this is a demo/development application. No real money is processed.

**Is my data secure?** Security measures include encryption, secure sessions, and soft-delete.

**How do I delete my account?** Contact support or use account deletion in settings.

**Can I use this in production?** This is a template. You'd need to add PCI compliance, SOC 2, etc.

## Related Documentation

- [Quick Start Guide](../README.md)
- [Architecture](../ARCHITECTURE.md)
- [Developer Guide](DEVELOPER_GUIDE.md)
- [API Documentation](api-payments.md)
