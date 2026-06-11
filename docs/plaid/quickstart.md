# Plaid Quickstart

## Introduction

This guide covers getting started with Plaid's API for bank account linking.

## Quickstart Setup

1. Get API keys from [Plaid Dashboard](https://dashboard.plaid.com/developers/keys)
2. Clone the Quickstart repo: `git clone https://github.com/plaid/quickstart`
3. Copy `.env.example` to `.env` and add your keys
4. Start the backend: `cd quickstart/node && npm install && ./start.sh`
5. Start the frontend: `cd quickstart/frontend && npm install && npm start`
6. Visit localhost:3000 and log in with Sandbox credentials

## Sandbox Credentials

```text
username: user_good
password: pass_good
```

## How It Works

1. **Create Link Token**: Call `/link/token/create` to create a `link_token`
2. **Open Link**: Use the token to initialize Plaid Link on client side
3. **Exchange Token**: Call `/item/public_token/exchange` to get `access_token`
4. **Make API Requests**: Use `access_token` to fetch accounts, balances, transactions

## Key Endpoints

- `/link/token/create` - Create link token
- `/item/public_token/exchange` - Exchange public token
- `/accounts/get` - Get account info
- `/accounts/balance/get` - Get balances
- `/transactions/get` - Get transactions

## Next Steps

- See [Plaid Link Guide](./link-guide.md)
- See [Transactions Guide](./transactions.md)
