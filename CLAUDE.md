# ZKP2P Demo

PeerAuth extension onramp demo application. A branded reference implementation for integrating ZKP2P with the Peer browser extension.

## Overview

This is a single-page demo app that showcases the PeerAuth extension SDK integration. Users can configure onramp parameters and launch the Peer extension flow for fiat-to-crypto onramping.

**Live**: https://demo.zkp2p.xyz

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build**: Vite 5
- **Styling**: styled-components
- **SDK**: `@zkp2p/sdk` - PeerAuth extension communication
- **Brand**: `@zkp2p/brand` (local package) - Design system tokens

## Project Structure

```
zkp2p-demo/
├── src/
│   ├── App.tsx                    # Main application (form, SDK integration)
│   ├── index.tsx                  # React entry point
│   ├── index.css                  # Global styles
│   ├── components/
│   │   ├── common/               # Reusable UI components
│   │   │   ├── Button.tsx        # Primary/secondary/tertiary variants
│   │   │   ├── Input.tsx         # Form input with label
│   │   │   └── Card.tsx          # Card container
│   │   └── layouts/              # Layout primitives
│   │       ├── Column/           # Flex column
│   │       └── Row/              # Flex row
│   └── theme/
│       ├── index.ts              # Theme exports
│       ├── colors.tsx            # Color tokens (wraps @zkp2p/brand)
│       └── text.tsx              # Typography components
├── packages/
│   └── brand/                    # @zkp2p/brand design system
│       ├── src/                  # Tokens, components, utilities
│       ├── logos/                # SVG/PNG logo assets
│       ├── icons/                # Icon set
│       └── fonts/                # PP Valve, Inter fonts
└── vite.config.ts               # Build config with aliases
```

## Path Aliases

Configured in `vite.config.ts`:

| Alias | Path |
|-------|------|
| `@components` | `./src/components` |
| `@theme` | `./src/theme` |
| `@assets` | `./src/assets` |
| `@zkp2p/brand` | `./packages/brand/src` |
| `@zkp2p/brand/logos` | `./packages/brand/logos` |

## Development

```bash
bun install
bun dev        # Start dev server on port 3000
bun build      # Build to ./build
bun lint       # ESLint
bun typecheck  # TypeScript check
```

## SDK Integration

The app uses `@zkp2p/sdk` to communicate with the PeerAuth browser extension:

```typescript
import { peerExtensionSdk } from "@zkp2p/sdk";

// Check extension state
const state = await peerExtensionSdk.getState();  // "needs_install" | "installed"

// Request connection approval
const approved = await peerExtensionSdk.requestConnection();

// Check connection status
const status = await peerExtensionSdk.checkConnectionStatus();

// Launch onramp with parameters
peerExtensionSdk.onramp({
  referrer: "App Name",
  referrerLogo: "https://...",
  callbackUrl: "https://...",
  inputCurrency: "USD",
  inputAmount: "10",
  paymentPlatform: "venmo",
  toToken: "8453:0x...",       // chainId:tokenAddress
  recipientAddress: "0x...",
});
```

## Styling Conventions

Uses Peer brand design system via `@zkp2p/brand`:

- **Colors**: Import from `@theme/colors` - use `peer.*` tokens
- **Typography**: Use `PeerText.*` components from `@theme/text`
- **Gradients**: `gradients.ignite` for primary CTAs
- **Radii**: `radii.md` (10px) for buttons, `radii.xl` (24px) for cards

See `packages/brand/CLAUDE.md` for comprehensive design system documentation.

## Button Variants

```typescript
<Button variant="primary">IGNITE gradient CTA</Button>
<Button variant="secondary">White background</Button>
<Button variant="tertiary">Dark with border</Button>
```

## Supported Chains

Demo includes presets for:
- Base (ETH)
- Ethereum Mainnet (ETH)
- Solana (SOL)
- Avalanche (USDC)
- Hyperliquid (USDC)

Token format: `chainId:tokenAddress` (e.g., `8453:0x0000...` for Base native ETH)
