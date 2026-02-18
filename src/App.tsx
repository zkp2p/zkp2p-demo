import React, { useState, useReducer, useCallback, useEffect } from "react";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import theme from "@theme/index";
import { peer, radii, fontSizes, fontFamilies, fontWeights } from "@theme/colors";
import { PeerText } from "@theme/text";
import { Column, ColumnCenter } from "@components/layouts/Column";
import Row from "@components/layouts/Row";
import { Input } from "@components/common/Input";
import { Button, ButtonRow } from "@components/common/Button";
import { peerExtensionSdk } from "@zkp2p/sdk";
import type { PeerConnectionStatus, PeerExtensionOnrampParams } from "@zkp2p/sdk";
import { GradientText, Logo } from "@zkp2p/brand/components";

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

// ─── Connection state reducer ───────────────────────────────────────────────

interface ConnectionState {
  extensionStatus: "checking" | "installed" | "not_installed";
  isConnecting: boolean;
  connectionStatus: PeerConnectionStatus | "";
  error: string | null;
}

type ConnectionAction =
  | { type: "extension_installed" }
  | { type: "extension_not_installed" }
  | { type: "connection_status"; status: PeerConnectionStatus | "" }
  | { type: "connecting" }
  | { type: "connected" }
  | { type: "error"; message: string }
  | { type: "clear_error" };

const initialConnectionState: ConnectionState = {
  extensionStatus: "checking",
  isConnecting: false,
  connectionStatus: "",
  error: null,
};

const connectionReducer = (state: ConnectionState, action: ConnectionAction): ConnectionState => {
  switch (action.type) {
    case "extension_installed":
      return { ...state, extensionStatus: "installed" };
    case "extension_not_installed":
      return { ...state, extensionStatus: "not_installed" };
    case "connection_status":
      return { ...state, connectionStatus: action.status };
    case "connecting":
      return { ...state, isConnecting: true, error: null };
    case "connected":
      return { ...state, isConnecting: false };
    case "error":
      return { ...state, isConnecting: false, error: action.message };
    case "clear_error":
      return { ...state, error: null };
  }
};

// ─── Sub-components ─────────────────────────────────────────────────────────

const Header: React.FC = () => (
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
);

const ExamplePresets: React.FC<{ onSelect: (key: string) => void }> = ({ onSelect }) => (
  <Section>
    <SectionHeader>
      <PeerText.Sub2>Examples</PeerText.Sub2>
      <SectionRule />
    </SectionHeader>
    <ExampleButtons>
      <Button variant="secondary" onClick={() => onSelect("baseEth")}>
        Onramp to Base ETH
      </Button>
      <Button variant="secondary" onClick={() => onSelect("solana")}>
        Onramp 10 USD to Solana
      </Button>
      <Button variant="secondary" onClick={() => onSelect("mainnetEth")}>
        Onramp 10 EUR via Revolut
      </Button>
      <Button variant="secondary" onClick={() => onSelect("avalancheUsdc")}>
        Onramp 10 USD to Avalanche USDC
      </Button>
      <Button variant="secondary" onClick={() => onSelect("hyperliquidUsdc")}>
        Onramp 1000 USDC to Hyperliquid
      </Button>
      <Button variant="secondary" onClick={() => onSelect("exactUsdc")}>
        Onramp Exact 1 USDC
      </Button>
    </ExampleButtons>
  </Section>
);

interface QueryFormProps {
  formData: FormData;
  onInputChange: (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  buttonText: string;
  buttonDisabled: boolean;
  onSubmit: () => void;
}

const QueryForm: React.FC<QueryFormProps> = ({
  formData,
  onInputChange,
  error,
  buttonText,
  buttonDisabled,
  onSubmit,
}) => (
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
        onChange={onInputChange("referrer")}
        placeholder="Acme Wallet"
      />
      <Input
        label="referrerLogo"
        name="referrerLogo"
        value={formData.referrerLogo}
        onChange={onInputChange("referrerLogo")}
        placeholder="https://example.com/logo.svg"
        type="url"
        inputMode="url"
        autoComplete="url"
      />
      <Input
        label="callbackUrl"
        name="callbackUrl"
        value={formData.callbackUrl}
        onChange={onInputChange("callbackUrl")}
        placeholder="https://example.com/callback"
        type="url"
        inputMode="url"
        autoComplete="url"
      />
      <Input
        label="inputCurrency"
        name="inputCurrency"
        value={formData.inputCurrency}
        onChange={onInputChange("inputCurrency")}
        placeholder="USD, EUR, etc."
      />
      <Input
        label="inputAmount"
        name="inputAmount"
        value={formData.inputAmount}
        onChange={onInputChange("inputAmount")}
        placeholder="10.5"
        inputMode="decimal"
        pattern="^\\d*(\\.\\d{0,6})?$"
      />
      <Input
        label="paymentPlatform"
        name="paymentPlatform"
        value={formData.paymentPlatform}
        onChange={onInputChange("paymentPlatform")}
        placeholder="venmo, revolut, etc."
      />
      <Input
        label="amountUsdc"
        name="amountUsdc"
        value={formData.amountUsdc}
        onChange={onInputChange("amountUsdc")}
        placeholder="1000000 (6 decimals)"
        inputMode="numeric"
        pattern="^\\d+$"
      />
      <Input
        label="toToken"
        name="toToken"
        value={formData.toToken}
        onChange={onInputChange("toToken")}
        placeholder="8453:0x0000...0000"
      />
      <Input
        label="recipientAddress"
        name="recipientAddress"
        value={formData.recipientAddress}
        onChange={onInputChange("recipientAddress")}
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
        onClick={onSubmit}
        disabled={buttonDisabled}
      >
        {buttonText}
      </Button>
    </CTARow>
  </Section>
);

// ─── Main App ───────────────────────────────────────────────────────────────

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

  const [conn, dispatch] = useReducer(connectionReducer, initialConnectionState);

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
          dispatch({ type: "extension_installed" });
          return;
        }
      } catch {
        if (!isActive) return;
      }

      if (attempts >= maxAttempts) {
        dispatch({ type: "extension_not_installed" });
        return;
      }

      timer = setTimeout(checkExtension, 500);
    };

    timer = setTimeout(checkExtension, 500);
    return () => {
      isActive = false;
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Poll connection status while the extension is available
  useEffect(() => {
    if (conn.extensionStatus !== "installed") {
      dispatch({ type: "connection_status", status: "" });
      return;
    }

    let isActive = true;
    const pollConnectionStatus = async () => {
      try {
        const status = await peerExtensionSdk.checkConnectionStatus();
        if (isActive) {
          dispatch({ type: "connection_status", status: status ?? "" });
        }
      } catch {
        if (isActive) {
          dispatch({ type: "connection_status", status: "" });
        }
      }
    };

    pollConnectionStatus();
    const interval = setInterval(pollConnectionStatus, 1500);
    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [conn.extensionStatus]);

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
      dispatch({ type: "connection_status", status: status ?? "" });
      if (isConnectedStatus(status ?? "")) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return false;
  }, []);

  const handleOnramp = useCallback(async () => {
    dispatch({ type: "clear_error" });

    if (!peerExtensionSdk.isAvailable()) {
      peerExtensionSdk.openInstallPage();
      return;
    }

    dispatch({ type: "connecting" });

    try {
      let status: PeerConnectionStatus | "" = "";
      try {
        status = await peerExtensionSdk.checkConnectionStatus();
        dispatch({ type: "connection_status", status: status ?? "" });
      } catch {
        dispatch({ type: "connection_status", status: "" });
      }
      const isPending = status === "pending";
      const alreadyConnected = isConnectedStatus(status ?? "");

      if (!alreadyConnected && !isPending) {
        const approved = await peerExtensionSdk.requestConnection();
        if (!approved) {
          dispatch({ type: "error", message: "Connection was rejected. Please approve the request." });
          return;
        }
      }

      const connected = alreadyConnected || (await waitForConnection());
      if (!connected) {
        dispatch({ type: "error", message: "Connection is still pending. Please approve the extension request and try again." });
        return;
      }

      const params = buildOnrampParams();
      peerExtensionSdk.onramp(params);
    } catch (err) {
      dispatch({ type: "error", message: err instanceof Error ? err.message : "Failed to connect to PeerAuth" });
    } finally {
      dispatch({ type: "connected" });
    }
  }, [buildOnrampParams, waitForConnection]);

  const getButtonText = () => {
    if (conn.extensionStatus === "checking") return "Checking extension";
    if (conn.extensionStatus === "not_installed") return "Install PeerAuth Extension";
    if (conn.isConnecting) return "Connecting";
    if (conn.connectionStatus === "pending") return "Awaiting Approval";
    if (isConnectedStatus(conn.connectionStatus)) return "Onramp with Peer";
    return "Connect & Onramp";
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <ContentWrapper>
          <Header />

          <Panel>
            <ExamplePresets onSelect={setExample} />

            <Divider />

            <QueryForm
              formData={formData}
              onInputChange={handleInputChange}
              error={conn.error}
              buttonText={getButtonText()}
              buttonDisabled={conn.extensionStatus === "checking" || conn.isConnecting}
              onSubmit={handleOnramp}
            />
          </Panel>
        </ContentWrapper>
      </AppContainer>
    </ThemeProvider>
  );
};

// ─── Styled Components ──────────────────────────────────────────────────────

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
