import React, { useState, useCallback, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from '@theme/index';
import { colors } from '@theme/colors';
import { ThemedText } from '@theme/text';
import { Column, ColumnCenter } from '@components/layouts/Column';
import Row from '@components/layouts/Row';
import { Input } from '@components/common/Input';
import { Button, ButtonRow } from '@components/common/Button';
import { peerExtensionSdk } from '@zkp2p/sdk';
import type { PeerExtensionOnrampParams } from '@zkp2p/sdk';

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

const disconnectedStatuses = new Set([
  'disconnected',
]);

const isConnectedStatus = (status: string | null) => {
  if (!status) return false;
  const normalized = status.trim().toLowerCase();
  if (!normalized) return false;
  return !disconnectedStatuses.has(normalized);
};

// Predefined examples
const examples: Record<string, FormData> = {
  baseEth: {
    referrer: "PeerPanda Wallet",
    referrerLogo: "https://demo.zkp2p.xyz/panda.jpg",
    callbackUrl: "https://demo.zkp2p.xyz",
    inputCurrency: "",
    inputAmount: "",
    paymentPlatform: "",
    amountUsdc: "",
    toToken: "8453:0x0000000000000000000000000000000000000000",
    recipientAddress: "0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929"
  },
  solana: {
    referrer: "PeerPanda Wallet",
    referrerLogo: "https://demo.zkp2p.xyz/panda.jpg",
    callbackUrl: "https://demo.zkp2p.xyz",
    inputCurrency: "USD",
    inputAmount: "10",
    paymentPlatform: "",
    amountUsdc: "",
    toToken: "792703809:11111111111111111111111111111111",
    recipientAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  },
  mainnetEth: {
    referrer: "PeerPanda Wallet",
    referrerLogo: "https://demo.zkp2p.xyz/panda.jpg",
    callbackUrl: "https://demo.zkp2p.xyz",
    inputCurrency: "EUR",
    inputAmount: "10",
    paymentPlatform: "revolut",
    amountUsdc: "",
    toToken: "1:0x0000000000000000000000000000000000000000",
    recipientAddress: "0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929"
  },
  avalancheUsdc: {
    referrer: "PeerPanda Wallet",
    referrerLogo: "https://demo.zkp2p.xyz/panda.jpg",
    callbackUrl: "https://demo.zkp2p.xyz",
    inputCurrency: "USD",
    inputAmount: "10",
    paymentPlatform: "",
    amountUsdc: "",
    toToken: "43114:0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
    recipientAddress: "0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929"
  },
  exactUsdc: {
    referrer: "PeerPanda Wallet",
    referrerLogo: "https://demo.zkp2p.xyz/panda.jpg",
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
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Check if PeerAuth extension is installed
  useEffect(() => {
    let isActive = true;
    const checkExtension = async () => {
      const state = await peerExtensionSdk.getState();
      if (!isActive) return;
      setExtensionStatus(state === 'needs_install' ? 'not_installed' : 'installed');
    };

    // Give some time for extension to inject
    const timer = setTimeout(() => {
      void checkExtension();
    }, 500);
    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, []);

  // Poll connection status while the extension is available
  useEffect(() => {
    if (extensionStatus !== 'installed') {
      setConnectionStatus('');
      return;
    }

    let isActive = true;
    const pollConnectionStatus = async () => {
      try {
        const status = await peerExtensionSdk.checkConnectionStatus();
        if (isActive) {
          setConnectionStatus(status ?? '');
        }
      } catch {
        if (isActive) {
          setConnectionStatus('');
        }
      }
    };

    pollConnectionStatus();
    const interval = setInterval(pollConnectionStatus, 1500);
    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [extensionStatus]);

  const handleInputChange = useCallback((field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const setExample = useCallback((exampleKey: string) => {
    const data = examples[exampleKey];
    if (data) {
      setFormData(data);
    }
  }, []);

  // Build onramp params from form data
  const buildOnrampParams = useCallback((): PeerExtensionOnrampParams => {
    const params: PeerExtensionOnrampParams = {};
    const setParam = <K extends keyof PeerExtensionOnrampParams>(key: K, value: string) => {
      const trimmed = value.trim();
      if (trimmed) {
        params[key] = trimmed;
      }
    };

    setParam('referrer', formData.referrer);
    setParam('referrerLogo', formData.referrerLogo);
    setParam('callbackUrl', formData.callbackUrl);
    setParam('inputCurrency', formData.inputCurrency);
    setParam('inputAmount', formData.inputAmount);
    setParam('paymentPlatform', formData.paymentPlatform);
    setParam('amountUsdc', formData.amountUsdc);
    setParam('toToken', formData.toToken);
    setParam('recipientAddress', formData.recipientAddress);

    return params;
  }, [formData]);

  const waitForConnection = useCallback(async () => {
    const timeoutMs = 15000;
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      const status = await peerExtensionSdk.checkConnectionStatus();
      setConnectionStatus(status ?? '');
      if (isConnectedStatus(status ?? '')) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return false;
  }, []);

  // Handle the onramp flow with PeerAuth extension
  const handleOnramp = useCallback(async () => {
    setError(null);

    // Check if extension is installed
    if (!peerExtensionSdk.isAvailable()) {
      peerExtensionSdk.openInstallPage();
      return;
    }

    setIsConnecting(true);

    try {
      let status = '';
      try {
        status = await peerExtensionSdk.checkConnectionStatus();
        setConnectionStatus(status ?? '');
      } catch {
        setConnectionStatus('');
      }
      const alreadyConnected = isConnectedStatus(status ?? '');

      if (!alreadyConnected) {
        const approved = await peerExtensionSdk.requestConnection();
        if (!approved) {
          setError('Connection was rejected. Please approve the connection request.');
          return;
        }
      }

      const connected = alreadyConnected || (await waitForConnection());
      if (!connected) {
        setError('Connection is still pending. Please approve the extension request and try again.');
        return;
      }

      // Call onramp with query params
      const params = buildOnrampParams();
      peerExtensionSdk.onramp(params);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to PeerAuth');
    } finally {
      setIsConnecting(false);
    }
  }, [buildOnrampParams, waitForConnection]);

  // Get button text based on state
  const getButtonText = () => {
    if (extensionStatus === 'checking') return 'Checking extension...';
    if (extensionStatus === 'not_installed') return 'Install PeerAuth Extension';
    if (isConnecting) return 'Connecting...';
    if (isConnectedStatus(connectionStatus)) return 'Onramp with ZKP2P';
    return 'Connect & Onramp';
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <ContentWrapper>
          <HeaderSection>
            <Logo src="/panda.jpg" alt="PeerPanda Logo" />
            <ThemedText.Hero>PeerPanda Wallet</ThemedText.Hero>
            <ThemedText.BodySecondary style={{ textAlign: 'center', maxWidth: '600px', marginTop: '6px' }}>
              This page demonstrates integration with ZKP2P via the PeerAuth extension.
              Select an example or customize the query parameters below.
            </ThemedText.BodySecondary>
          </HeaderSection>

          {/* Examples Section */}
          <Section>
            <ThemedText.HeadlineSmall>Examples</ThemedText.HeadlineSmall>
            <ExampleButtons>
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
            </ExampleButtons>
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
  min-height: 100dvh;
  background-color: ${colors.container};
  display: flex;
  justify-content: center;
  padding: 32px 20px 28px;

  @media (max-height: 800px) {
    padding: 24px 16px 20px;
  }
`;

const ContentWrapper = styled(ColumnCenter)`
  max-width: 960px;
  width: 100%;
  gap: 24px;

  @media (max-height: 800px) {
    gap: 16px;
  }
`;

const HeaderSection = styled(ColumnCenter)`
  gap: 8px;
  margin-bottom: 8px;
`;

const Logo = styled.img`
  height: 64px;
  margin-bottom: 4px;
  border-radius: 12px;
`;

const Section = styled(Column)`
  width: 100%;
  gap: 12px;
`;

const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid ${colors.defaultBorderColor};
  margin: 4px 0;
`;

const ExampleButtons = styled(ButtonRow)`
  margin-top: 8px;
  gap: 10px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  width: 100%;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 960px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const CTARow = styled(Row)`
  justify-content: center;
  margin-top: 10px;
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
