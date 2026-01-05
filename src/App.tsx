import React, { useState, useCallback, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from '@theme/index';
import { colors } from '@theme/colors';
import { ThemedText } from '@theme/text';
import { Column, ColumnCenter } from '@components/layouts/Column';
import Row from '@components/layouts/Row';
import { Input } from '@components/common/Input';
import { Button, ButtonRow } from '@components/common/Button';

// Extend window to include peer auth extension
declare global {
  interface Window {
    peer?: {
      requestConnect: () => Promise<{ connected: boolean; address?: string }>;
      onramp: (queryString: string) => void;
    };
  }
}

// Chrome extension store URL for PeerAuth
const PEERAUTH_EXTENSION_URL = 'https://chromewebstore.google.com/detail/peerauth/jnlhkbkpojfngaiaghlfpcfkpfnfdodn';

interface FormData {
  referrer: string;
  referrerLogo: string;
  callbackUrl: string;
  inputCurrency: string;
  inputAmount: string;
  paymentPlatform: string;
  amountUsdc: string;
  toToken: string;
  recipientAddress: string;
}

// Predefined examples
const examples: Record<string, FormData> = {
  baseEth: {
    referrer: "Rampy Pay",
    referrerLogo: "https://demo.zkp2p.xyz/Rampy_logo.svg",
    callbackUrl: "https://demo.zkp2p.xyz",
    inputCurrency: "",
    inputAmount: "",
    paymentPlatform: "",
    amountUsdc: "",
    toToken: "8453:0x0000000000000000000000000000000000000000",
    recipientAddress: "0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929"
  },
  solana: {
    referrer: "Rampy Pay",
    referrerLogo: "https://demo.zkp2p.xyz/Rampy_logo.svg",
    callbackUrl: "https://demo.zkp2p.xyz",
    inputCurrency: "USD",
    inputAmount: "10",
    paymentPlatform: "",
    amountUsdc: "",
    toToken: "792703809:11111111111111111111111111111111",
    recipientAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  },
  mainnetEth: {
    referrer: "Rampy Pay",
    referrerLogo: "https://demo.zkp2p.xyz/Rampy_logo.svg",
    callbackUrl: "https://demo.zkp2p.xyz",
    inputCurrency: "EUR",
    inputAmount: "10",
    paymentPlatform: "revolut",
    amountUsdc: "",
    toToken: "1:0x0000000000000000000000000000000000000000",
    recipientAddress: "0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929"
  },
  avalancheUsdc: {
    referrer: "Rampy Pay",
    referrerLogo: "https://demo.zkp2p.xyz/Rampy_logo.svg",
    callbackUrl: "https://demo.zkp2p.xyz",
    inputCurrency: "USD",
    inputAmount: "10",
    paymentPlatform: "",
    amountUsdc: "",
    toToken: "43114:0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
    recipientAddress: "0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929"
  },
  exactUsdc: {
    referrer: "Rampy Pay",
    referrerLogo: "https://demo.zkp2p.xyz/Rampy_logo.svg",
    callbackUrl: "https://demo.zkp2p.xyz",
    inputCurrency: "",
    inputAmount: "",
    paymentPlatform: "",
    amountUsdc: "1000000",
    toToken: "",
    recipientAddress: "0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929"
  }
};

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    referrer: "",
    referrerLogo: "",
    callbackUrl: "",
    inputCurrency: "",
    inputAmount: "",
    paymentPlatform: "",
    amountUsdc: "",
    toToken: "",
    recipientAddress: ""
  });

  const [extensionStatus, setExtensionStatus] = useState<'checking' | 'installed' | 'not_installed'>('checking');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if PeerAuth extension is installed
  useEffect(() => {
    const checkExtension = () => {
      if (typeof window.peer !== 'undefined') {
        setExtensionStatus('installed');
      } else {
        setExtensionStatus('not_installed');
      }
    };

    // Give some time for extension to inject
    const timer = setTimeout(checkExtension, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = useCallback((field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const setExample = useCallback((exampleKey: string) => {
    const data = examples[exampleKey];
    if (data) {
      setFormData(data);
    }
  }, []);

  // Build query string from form data
  const buildQueryString = useCallback(() => {
    const params: string[] = [];
    const fields: (keyof FormData)[] = [
      "referrer", "referrerLogo", "callbackUrl", "inputCurrency",
      "inputAmount", "paymentPlatform", "amountUsdc", "toToken", "recipientAddress"
    ];

    fields.forEach(field => {
      const value = formData[field].trim();
      if (value) {
        params.push(`${encodeURIComponent(field)}=${encodeURIComponent(value)}`);
      }
    });

    return params.length ? `?${params.join("&")}` : "";
  }, [formData]);

  // Handle the onramp flow with PeerAuth extension
  const handleOnramp = useCallback(async () => {
    setError(null);

    // Check if extension is installed
    if (!window.peer) {
      window.open(PEERAUTH_EXTENSION_URL, '_blank');
      return;
    }

    setIsConnecting(true);

    try {
      // Request connection if not already connected
      if (!connectedAddress) {
        const result = await window.peer.requestConnect();
        if (!result.connected) {
          setError('Connection was rejected. Please approve the connection request.');
          setIsConnecting(false);
          return;
        }
        if (result.address) {
          setConnectedAddress(result.address);
        }
      }

      // Call onramp with query params
      const queryString = buildQueryString();
      window.peer.onramp(queryString);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to PeerAuth');
    } finally {
      setIsConnecting(false);
    }
  }, [connectedAddress, buildQueryString]);

  // Get button text based on state
  const getButtonText = () => {
    if (extensionStatus === 'checking') return 'Checking extension...';
    if (extensionStatus === 'not_installed') return 'Install PeerAuth Extension';
    if (isConnecting) return 'Connecting...';
    if (connectedAddress) return 'Onramp with ZKP2P';
    return 'Connect & Onramp';
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <ContentWrapper>
          <HeaderSection>
            <Logo src="/Rampy_logo.svg" alt="Rampy Logo" />
            <ThemedText.Hero>Rampy Demo Wallet</ThemedText.Hero>
            <ThemedText.BodySecondary style={{ textAlign: 'center', maxWidth: '600px', marginTop: '8px' }}>
              This page demonstrates integration with ZKP2P via the PeerAuth extension.
              Select an example or customize the query parameters below.
            </ThemedText.BodySecondary>
          </HeaderSection>

          {/* Extension Status */}
          <StatusBadge status={extensionStatus}>
            {extensionStatus === 'checking' && 'Checking for PeerAuth extension...'}
            {extensionStatus === 'installed' && (connectedAddress ? `Connected: ${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}` : 'PeerAuth extension detected')}
            {extensionStatus === 'not_installed' && 'PeerAuth extension not detected'}
          </StatusBadge>

          {/* Examples Section */}
          <Section>
            <ThemedText.HeadlineSmall>Examples</ThemedText.HeadlineSmall>
            <ButtonRow>
              <Button variant="secondary" onClick={() => setExample('baseEth')}>
                Onramp to Base ETH
              </Button>
              <Button variant="secondary" onClick={() => setExample('solana')}>
                Onramp 10 USD to Solana
              </Button>
              <Button variant="secondary" onClick={() => setExample('mainnetEth')}>
                Onramp 10 EUR via Revolut to Mainnet ETH
              </Button>
              <Button variant="secondary" onClick={() => setExample('avalancheUsdc')}>
                Onramp 10 USD to Avalanche USDC
              </Button>
              <Button variant="secondary" onClick={() => setExample('exactUsdc')}>
                Onramp Exact 1 USDC
              </Button>
            </ButtonRow>
          </Section>

          <Divider />

          {/* Query Parameters Section */}
          <Section>
            <ThemedText.HeadlineSmall>Customize Query Parameters</ThemedText.HeadlineSmall>
            <FormGrid>
              <Input
                label="referrer"
                name="referrer"
                value={formData.referrer}
                onChange={handleInputChange('referrer')}
                placeholder="Your app name"
              />
              <Input
                label="referrerLogo"
                name="referrerLogo"
                value={formData.referrerLogo}
                onChange={handleInputChange('referrerLogo')}
                placeholder="https://example.com/logo.svg"
              />
              <Input
                label="callbackUrl"
                name="callbackUrl"
                value={formData.callbackUrl}
                onChange={handleInputChange('callbackUrl')}
                placeholder="https://example.com/callback"
              />
              <Input
                label="inputCurrency"
                name="inputCurrency"
                value={formData.inputCurrency}
                onChange={handleInputChange('inputCurrency')}
                placeholder="USD, EUR, etc."
              />
              <Input
                label="inputAmount"
                name="inputAmount"
                value={formData.inputAmount}
                onChange={handleInputChange('inputAmount')}
                placeholder="10"
              />
              <Input
                label="paymentPlatform"
                name="paymentPlatform"
                value={formData.paymentPlatform}
                onChange={handleInputChange('paymentPlatform')}
                placeholder="venmo, revolut, etc."
              />
              <Input
                label="amountUsdc"
                name="amountUsdc"
                value={formData.amountUsdc}
                onChange={handleInputChange('amountUsdc')}
                placeholder="1000000 (6 decimals)"
              />
              <Input
                label="toToken"
                name="toToken"
                value={formData.toToken}
                onChange={handleInputChange('toToken')}
                placeholder="chainId:tokenAddress"
              />
              <Input
                label="recipientAddress"
                name="recipientAddress"
                value={formData.recipientAddress}
                onChange={handleInputChange('recipientAddress')}
                placeholder="0x..."
              />
            </FormGrid>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <CTARow>
              <Button
                onClick={handleOnramp}
                disabled={extensionStatus === 'checking' || isConnecting}
              >
                {getButtonText()}
              </Button>
            </CTARow>
          </Section>
        </ContentWrapper>
      </AppContainer>
    </ThemeProvider>
  );
};

// Styled Components
const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.container};
  display: flex;
  justify-content: center;
  padding: 40px 20px;
`;

const ContentWrapper = styled(ColumnCenter)`
  max-width: 800px;
  width: 100%;
  gap: 32px;
`;

const HeaderSection = styled(ColumnCenter)`
  gap: 12px;
  margin-bottom: 16px;
`;

const Logo = styled.img`
  height: 80px;
  margin-bottom: 8px;
`;

const StatusBadge = styled.div<{ status: 'checking' | 'installed' | 'not_installed' }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${({ status }) => {
    switch (status) {
      case 'installed': return colors.validGreen + '20';
      case 'not_installed': return colors.warningYellow + '20';
      default: return colors.backgroundSecondary;
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'installed': return colors.validGreen;
      case 'not_installed': return colors.warningYellow;
      default: return colors.textSecondary;
    }
  }};
  border: 1px solid ${({ status }) => {
    switch (status) {
      case 'installed': return colors.validGreen + '40';
      case 'not_installed': return colors.warningYellow + '40';
      default: return colors.defaultBorderColor;
    }
  }};
`;

const Section = styled(Column)`
  width: 100%;
  gap: 16px;
`;

const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid ${colors.defaultBorderColor};
  margin: 8px 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  width: 100%;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const CTARow = styled(Row)`
  justify-content: center;
  margin-top: 16px;
`;

const ErrorMessage = styled.div`
  color: ${colors.warningRed};
  font-size: 14px;
  padding: 12px;
  background-color: ${colors.warningRed}20;
  border-radius: 8px;
  border: 1px solid ${colors.warningRed}40;
`;

export default App;
