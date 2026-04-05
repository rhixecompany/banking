# Plaid Link Guide

## Introduction

Plaid Link is the client-side component that users interact with to link their bank accounts to your app.

## Supported Platforms

| Platform     | SDK                                          |
| ------------ | -------------------------------------------- |
| Web          | [Web SDK](/docs/link/web/)                   |
| iOS          | [iOS SDK](/docs/link/ios/)                   |
| Android      | [Android SDK](/docs/link/android/)           |
| React Native | [React Native SDK](/docs/link/react-native/) |
| Mobile Web   | [Hosted Link](/docs/link/hosted-link/)       |

## Link Flow Overview

1. **Create Link Token** - Call `/link/token/create` to create a `link_token`
2. **Initialize Link** - Pass the token to Link in your frontend
3. **User Authenticates** - User logs into their bank in the Link UI
4. **Exchange Token** - Call `/item/public_token/exchange` to get `access_token`
5. **Make API Requests** - Use `access_token` to access account data

## Initializing Link

```typescript
// Create link token on server
const linkToken = await createLinkToken(userId);

// Initialize Link on client
const { open, ready } = usePlaidLink({
  token: linkToken,
  onSuccess: publicToken => {
    // Send publicToken to your server
  }
});
```

## Key Features

### OAuth Support

Many institutions use OAuth. See the [OAuth guide](/docs/link/oauth/) for implementation.

### Returning Users

Enable faster linking for users who have already connected their accounts. See [Returning user experience](/docs/link/returning-user/).

### Update Mode

Allow users to refresh their credentials if they change their bank password. See [Update mode](/docs/link/update-mode/).

### Error Handling

Handle common errors including:

- Invalid tokens
- Session timeouts
- Duplicate account linking

## Customization

Customize Link from the [Plaid Dashboard](https://dashboard.plaid.com/link):

- Institution selection
- Branding (colors, logos)
- Product selection

## Best Practices

- Use `link_token` for each new Link session
- Handle OAuth redirect properly
- Implement update mode for existing connections
- Track conversion analytics

## Next Steps

- See [Plaid Transactions](./transactions.md)
- See [Plaid Balance](./balance.md)
