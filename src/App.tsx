import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import theme from "@theme/index";
import { peer, gradients, radii, fontSizes, fontFamilies, fontWeights } from "@theme/colors";
import { PeerText } from "@theme/text";
import { Column, ColumnCenter } from "@components/layouts/Column";
import Row from "@components/layouts/Row";
import { Input } from "@components/common/Input";
import { Button, ButtonRow } from "@components/common/Button";
import { peerExtensionSdk } from "@zkp2p/sdk";
import type { PeerConnectionStatus, PeerExtensionOnrampParams } from "@zkp2p/sdk";
import { BackgroundNoise, GradientText, Logo } from "@zkp2p/brand/components";

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

const isConnectedStatus = (status: PeerConnectionStatus | "" | null) =>
  status === "connected";

// Predefined examples
const examples: Record<string, FormData> = {
  baseEth: {
    referrer: "Peer Demo Wallet",
    referrerLogo: "https://demo.zkp2p.xyz/peer-profile.png",
    callbackUrl: "https://demo.zkp2p.xyz",
    inputCurrency: "",
    inputAmount: "",
    paymentPlatform: "",
    amountUsdc: "",
    toToken: "8453:0x0000000000000000000000000000000000000000",
    recipientAddress: "0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929",
  },
  solana: {
    referrer: "Peer Demo Wallet",
    referrerLogo: "https://demo.zkp2p.xyz/peer-profile.png",
    callbackUrl: "https://demo.zkp2p.xyz",
    inputCurrency: "USD",
    inputAmount: "10",
    paymentPlatform: "",
    amountUsdc: "",
    toToken: "792703809:11111111111111111111111111111111",
    recipientAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  mainnetEth: {
    referrer: "Peer Demo Wallet",
    referrerLogo: "https://demo.zkp2p.xyz/peer-profile.png",
    callbackUrl: "https://demo.zkp2p.xyz",
    inputCurrency: "EUR",
    inputAmount: "10",
    paymentPlatform: "revolut",
    amountUsdc: "",
    toToken: "1:0x0000000000000000000000000000000000000000",
    recipientAddress: "0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929",
  },
  avalancheUsdc: {
    referrer: "Peer Demo Wallet",
    referrerLogo: "https://demo.zkp2p.xyz/peer-profile.png",
    callbackUrl: "https://demo.zkp2p.xyz",
    inputCurrency: "USD",
    inputAmount: "10",
    paymentPlatform: "",
    amountUsdc: "",
    toToken: "43114:0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
    recipientAddress: "0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929",
  },
  hyperliquidUsdc: {
    referrer: "Peer Demo Wallet",
    referrerLogo: "https://demo.zkp2p.xyz/peer-profile.png",
    callbackUrl: "https://demo.zkp2p.xyz",
    inputCurrency: "USD",
    inputAmount: "1000",
    paymentPlatform: "",
    amountUsdc: "",
    toToken: "1337:0x00000000000000000000000000000000",
    recipientAddress: "0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929",
  },
  exactUsdc: {
    referrer: "Peer Demo Wallet",
    referrerLogo: "https://demo.zkp2p.xyz/peer-profile.png",
    callbackUrl: "https://demo.zkp2p.xyz",
    inputCurrency: "",
    inputAmount: "",
    paymentPlatform: "",
    amountUsdc: "1000000",
    toToken: "",
    recipientAddress: "0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929",
  },
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
    recipientAddress: "",
  });

  const [extensionStatus, setExtensionStatus] = useState<
    "checking" | "installed" | "not_installed"
  >("checking");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<PeerConnectionStatus | "">("");
  const [error, setError] = useState<string | null>(null);

  // Check if PeerAuth extension is installed
  useEffect(() => {
    let isActive = true;
    let attempts = 0;
    const maxAttempts = 6;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const checkExtension = async () => {
      attempts += 1;
      try {
        const state = await peerExtensionSdk.getState();
        if (!isActive) return;
        if (state !== "needs_install") {
          setExtensionStatus("installed");
          return;
        }
      } catch {
        if (!isActive) return;
      }

      if (attempts >= maxAttempts) {
        setExtensionStatus("not_installed");
        return;
      }

      timer = setTimeout(checkExtension, 500);
    };

    // Give some time for extension to inject
    timer = setTimeout(checkExtension, 500);
    return () => {
      isActive = false;
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Poll connection status while the extension is available
  useEffect(() => {
    if (extensionStatus !== "installed") {
      setConnectionStatus((prev) => (prev === "" ? prev : ""));
      return;
    }

    let isActive = true;
    const pollConnectionStatus = async () => {
      try {
        const status = await peerExtensionSdk.checkConnectionStatus();
        if (isActive) {
          setConnectionStatus((prev) => (prev === (status ?? "") ? prev : (status ?? "")));
        }
      } catch {
        if (isActive) {
          setConnectionStatus((prev) => (prev === "" ? prev : ""));
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

  const handleInputChange = useCallback(
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    },
    []
  );

  const setExample = useCallback((exampleKey: string) => {
    const data = examples[exampleKey];
    if (data) {
      setFormData(data);
    }
  }, []);

  // Build onramp params from form data
  const buildOnrampParams = useCallback((): PeerExtensionOnrampParams => {
    const params: PeerExtensionOnrampParams = {};
    const setParam = <K extends keyof PeerExtensionOnrampParams>(
      key: K,
      value: string
    ) => {
      const trimmed = value.trim();
      if (trimmed) {
        params[key] = trimmed;
      }
    };

    setParam("referrer", formData.referrer);
    setParam("referrerLogo", formData.referrerLogo);
    setParam("callbackUrl", formData.callbackUrl);
    setParam("inputCurrency", formData.inputCurrency);
    setParam("inputAmount", formData.inputAmount);
    setParam("paymentPlatform", formData.paymentPlatform);
    setParam("amountUsdc", formData.amountUsdc);
    setParam("toToken", formData.toToken);
    setParam("recipientAddress", formData.recipientAddress);

    return params;
  }, [formData]);

  const waitForConnection = useCallback(async () => {
    const timeoutMs = 15000;
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      const status = await peerExtensionSdk.checkConnectionStatus();
      setConnectionStatus((prev) => (prev === (status ?? "") ? prev : (status ?? "")));
      if (isConnectedStatus(status ?? "")) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
      let status: PeerConnectionStatus | "" = "";
      try {
        status = await peerExtensionSdk.checkConnectionStatus();
        setConnectionStatus(status ?? "");
      } catch {
        setConnectionStatus("");
      }
      const isPending = status === "pending";
      const alreadyConnected = isConnectedStatus(status ?? "");

      if (!alreadyConnected && !isPending) {
        const approved = await peerExtensionSdk.requestConnection();
        if (!approved) {
          setError("Connection was rejected. Please approve the request.");
          return;
        }
      }

      const connected = alreadyConnected || (await waitForConnection());
      if (!connected) {
        setError("Connection is still pending. Please approve the extension request and try again.");
        return;
      }

      // Call onramp with query params
      const params = buildOnrampParams();
      peerExtensionSdk.onramp(params);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to PeerAuth");
    } finally {
      setIsConnecting(false);
    }
  }, [buildOnrampParams, waitForConnection]);

  // Get button text based on state
  const getButtonText = () => {
    if (extensionStatus === "checking") return "Checking extension";
    if (extensionStatus === "not_installed") return "Install PeerAuth Extension";
    if (isConnecting) return "Connecting";
    if (connectionStatus === "pending") return "Awaiting Approval";
    if (isConnectedStatus(connectionStatus)) return "Onramp with Peer";
    return "Connect & Onramp";
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <ContentWrapper>
          <HeaderSection>
            <LogoRow>
              <Logo height={28} variant="white" alt="Peer" />
            </LogoRow>
            <TitleRow>
              <PeerText.H2 as="h1">
                PEERAUTH <GradientText>ONRAMP</GradientText> DEMO
              </PeerText.H2>
            </TitleRow>
            <PeerText.BodySecondary style={{ textAlign: "center", maxWidth: "640px" }}>
              A branded reference flow for integrating ZKP2P with the PeerAuth extension.
              Use the presets or customize query parameters to launch the onramp.
            </PeerText.BodySecondary>
          </HeaderSection>

          <Panel>
            <Section>
              <SectionHeader>
                <PeerText.Sub2>Examples</PeerText.Sub2>
                <SectionRule />
              </SectionHeader>
              <ExampleButtons>
                <Button variant="secondary" onClick={() => setExample("baseEth")}>
                  Onramp to Base ETH
                </Button>
                <Button variant="secondary" onClick={() => setExample("solana")}>
                  Onramp 10 USD to Solana
                </Button>
                <Button variant="secondary" onClick={() => setExample("mainnetEth")}>
                  Onramp 10 EUR via Revolut
                </Button>
                <Button variant="secondary" onClick={() => setExample("avalancheUsdc")}>
                  Onramp 10 USD to Avalanche USDC
                </Button>
                <Button variant="secondary" onClick={() => setExample("hyperliquidUsdc")}>
                  Onramp 1000 USDC to Hyperliquid
                </Button>
                <Button variant="secondary" onClick={() => setExample("exactUsdc")}>
                  Onramp Exact 1 USDC
                </Button>
              </ExampleButtons>
            </Section>

            <Divider />

            <Section>
              <SectionHeader>
                <PeerText.Sub2>Query Parameters</PeerText.Sub2>
                <SectionRule />
              </SectionHeader>
              <FormGrid>
                <Input
                  label="referrer"
                  name="referrer"
                  value={formData.referrer}
                  onChange={handleInputChange("referrer")}
                  placeholder="Acme Wallet"
                />
                <Input
                  label="referrerLogo"
                  name="referrerLogo"
                  value={formData.referrerLogo}
                  onChange={handleInputChange("referrerLogo")}
                  placeholder="https://example.com/logo.svg"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                />
                <Input
                  label="callbackUrl"
                  name="callbackUrl"
                  value={formData.callbackUrl}
                  onChange={handleInputChange("callbackUrl")}
                  placeholder="https://example.com/callback"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                />
                <Input
                  label="inputCurrency"
                  name="inputCurrency"
                  value={formData.inputCurrency}
                  onChange={handleInputChange("inputCurrency")}
                  placeholder="USD, EUR, etc."
                />
                <Input
                  label="inputAmount"
                  name="inputAmount"
                  value={formData.inputAmount}
                  onChange={handleInputChange("inputAmount")}
                  placeholder="10.5"
                  inputMode="decimal"
                  pattern="^\\d*(\\.\\d{0,6})?$"
                />
                <Input
                  label="paymentPlatform"
                  name="paymentPlatform"
                  value={formData.paymentPlatform}
                  onChange={handleInputChange("paymentPlatform")}
                  placeholder="venmo, revolut, etc."
                />
                <Input
                  label="amountUsdc"
                  name="amountUsdc"
                  value={formData.amountUsdc}
                  onChange={handleInputChange("amountUsdc")}
                  placeholder="1000000 (6 decimals)"
                  inputMode="numeric"
                  pattern="^\\d+$"
                />
                <Input
                  label="toToken"
                  name="toToken"
                  value={formData.toToken}
                  onChange={handleInputChange("toToken")}
                  placeholder="8453:0x0000...0000"
                />
                <Input
                  label="recipientAddress"
                  name="recipientAddress"
                  value={formData.recipientAddress}
                  onChange={handleInputChange("recipientAddress")}
                  placeholder="0x1234...abcd"
                />
              </FormGrid>

              {error && (
                <ErrorMessage role="status" aria-live="polite">
                  {error}
                </ErrorMessage>
              )}

              <CTARow>
                <Button
                  onClick={handleOnramp}
                  disabled={extensionStatus === "checking" || isConnecting}
                >
                  {getButtonText()}
                </Button>
              </CTARow>
            </Section>
          </Panel>
        </ContentWrapper>
      </AppContainer>
    </ThemeProvider>
  );
};

// Styled Components
const AppContainer = styled.div`
  min-height: 100dvh;
  background-color: ${peer.black};
  display: flex;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 48px 20px 64px;

  @media (max-height: 800px) {
    padding: 32px 16px 48px;
  }
`;

const ContentWrapper = styled(ColumnCenter)`
  max-width: 1040px;
  width: 100%;
  gap: 32px;
  position: relative;
  z-index: 1;
`;

const HeaderSection = styled(ColumnCenter)`
  gap: 12px;
  margin-bottom: 4px;
  text-align: center;
`;

const LogoRow = styled(Row)`
  width: auto;
  gap: 12px;
  align-items: center;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  h1 {
    margin: 0;
    line-height: 0.95;
  }
`;

const Panel = styled(Column)`
  width: 100%;
  gap: 24px;
  padding: 28px;
  border-radius: ${radii.xl}px;
  border: 1px solid ${peer.borderDark};
  background: ${peer.richBlack};
  position: relative;

  @media (max-width: 640px) {
    padding: 20px;
  }
`;

const Section = styled(Column)`
  width: 100%;
  gap: 12px;
`;

const SectionHeader = styled(Row)`
  width: 100%;
  gap: 12px;
  align-items: center;
`;

const SectionRule = styled.div`
  flex: 1;
  height: 1px;
  background: ${peer.borderDark};
`;

const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid ${peer.borderDark};
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
  color: ${peer.error};
  font-size: ${fontSizes.bodySmall}px;
  font-family: ${fontFamilies.body};
  font-weight: ${fontWeights.medium};
  padding: 12px;
  background-color: ${peer.error}20;
  border-radius: ${radii.md}px;
  border: 1px solid ${peer.error}40;
`;

export default App;
