# ZKP2P Demo Wallet

Demo application showcasing integration with ZKP2P via the PeerAuth browser extension.

## Features

- **PeerAuth Extension Integration**: Automatically detects if the PeerAuth extension is installed
- **Connect & Onramp Flow**: Requests user connection and triggers onramp via extension sidebar
- **Customizable Parameters**: Configure all query parameters for the onramp flow
- **Preset Examples**: Quick-start with common onramp scenarios

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run typecheck

# Lint
npm run lint
```

## Deployment

This project is configured for deployment on Vercel. Push to `main` branch to trigger automatic deployment.

## Integration Flow

1. **Check Extension**: The app checks if `window.peer` exists
2. **Redirect to Install**: If not installed, user is directed to Chrome Web Store
3. **Request Connect**: If installed, calls `window.peer.requestConnect()`
4. **Trigger Onramp**: After connection, calls `window.peer.onramp(queryString)` to open the extension sidebar

## Query Parameters

| Parameter | Description |
|-----------|-------------|
| referrer | Your application name |
| referrerLogo | URL to your logo |
| callbackUrl | URL to redirect after completion |
| inputCurrency | Fiat currency (USD, EUR, etc.) |
| inputAmount | Amount in fiat currency |
| paymentPlatform | Payment method (venmo, revolut, etc.) |
| amountUsdc | Exact USDC amount (6 decimals) |
| toToken | Target token (format: chainId:tokenAddress) |
| recipientAddress | Destination wallet address |

## Live Demo

Visit [demo.zkp2p.xyz](https://demo.zkp2p.xyz)
