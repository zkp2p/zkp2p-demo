/**
 * Peer Typography System
 *
 * Typography components built on @zkp2p/brand tokens.
 *
 * Font Families:
 * - PP Valve: Headlines (ALWAYS UPPERCASE)
 * - Inter: Body text, UI labels, buttons
 *
 * See @zkp2p/brand for full token definitions.
 */

import { Text, TextProps as TextPropsOriginal } from "rebass";
import styled, { css } from "styled-components";
import {
  colors,
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
} from "@zkp2p/brand";

const TextWrapper = styled(Text).withConfig({
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: keyof string }>`
  color: ${({ color, theme }) => (theme as any)[color]};
  text-wrap: pretty;
`;

const HeadingTextWrapper = styled(TextWrapper)`
  font-family: ${fontFamilies.headline};
  text-transform: uppercase;
  text-wrap: balance;
`;

type TextProps = Omit<TextPropsOriginal, "css">;

/*
 * Peer Typography System
 *
 * Type Scale (Desktop) - from @zkp2p/brand:
 * H1: 96px, H2: 64px, H3: 48px, H4: 44px, H5: 32px
 * Body1: 24px (bodyLarge), Body2: 20px (body), Body3: 16px (bodySmall)
 * Sub1: 18px, Sub2: 14px (uppercase, 10% letter-spacing, line-height 2)
 * Button: 14px (uppercase, 10% letter-spacing)
 */

// PP Valve headline styles (ALWAYS UPPERCASE)
const headlineStyles = css`
  font-family: ${fontFamilies.headline};
  text-transform: uppercase;
  line-height: ${lineHeights.tight};
  text-wrap: balance;
`;

// Inter body styles
const bodyStyles = css`
  font-family: ${fontFamilies.body};
  line-height: ${lineHeights.body};
  text-wrap: pretty;
`;

// Styled wrapper for Peer typography
const PeerTextWrapper = styled(Text).withConfig({
  shouldForwardProp: (prop) => !["$variant"].includes(prop as string),
})<{ $variant?: "headline" | "body" }>`
  color: ${colors.white};
  ${({ $variant }) => ($variant === "headline" ? headlineStyles : bodyStyles)}
`;

// Peer Typography Components
export const PeerText = {
  // Headlines (PP Valve - UPPERCASE)
  H1(props: TextProps) {
    return (
      <PeerTextWrapper
        $variant="headline"
        fontWeight={fontWeights.semibold}
        fontSize={["48px", "64px", `${fontSizes.h1}px`]}
        letterSpacing={letterSpacing.headline}
        {...props}
      />
    );
  },
  H2(props: TextProps) {
    return (
      <PeerTextWrapper
        $variant="headline"
        fontWeight={fontWeights.semibold}
        fontSize={["40px", "64px", `${fontSizes.h2}px`]}
        letterSpacing={letterSpacing.headline}
        {...props}
      />
    );
  },
  H3(props: TextProps) {
    return (
      <PeerTextWrapper
        $variant="headline"
        fontWeight={fontWeights.semibold}
        fontSize={["36px", "48px", `${fontSizes.h3}px`]}
        letterSpacing={letterSpacing.headline}
        {...props}
      />
    );
  },
  H4(props: TextProps) {
    return (
      <PeerTextWrapper
        $variant="headline"
        fontWeight={fontWeights.semibold}
        fontSize={["32px", "40px", `${fontSizes.h4}px`]}
        letterSpacing={letterSpacing.headline}
        {...props}
      />
    );
  },
  H5(props: TextProps) {
    return (
      <PeerTextWrapper
        $variant="headline"
        fontWeight={fontWeights.semibold}
        fontSize={["26px", "28px", `${fontSizes.h5}px`]}
        letterSpacing={letterSpacing.headline}
        {...props}
      />
    );
  },

  // Body text (Inter)
  Body1(props: TextProps) {
    return (
      <PeerTextWrapper
        $variant="body"
        fontWeight={fontWeights.medium}
        fontSize={`${fontSizes.bodyLarge}px`}
        color={colors.white}
        {...props}
      />
    );
  },
  Body2(props: TextProps) {
    return (
      <PeerTextWrapper
        $variant="body"
        fontWeight={fontWeights.medium}
        fontSize={`${fontSizes.body}px`}
        color={colors.white}
        {...props}
      />
    );
  },
  Body3(props: TextProps) {
    return (
      <PeerTextWrapper
        $variant="body"
        fontWeight={fontWeights.medium}
        fontSize={`${fontSizes.bodySmall}px`}
        color={colors.white}
        {...props}
      />
    );
  },
  BodySecondary(props: TextProps) {
    return (
      <PeerTextWrapper
        $variant="body"
        fontWeight={fontWeights.medium}
        fontSize={`${fontSizes.body}px`}
        color={colors.grey}
        {...props}
      />
    );
  },

  // Subheadings (Inter - UPPERCASE, line-height 2, 10% tracking)
  Sub1(props: TextProps) {
    return (
      <PeerTextWrapper
        $variant="body"
        fontWeight={fontWeights.semibold}
        fontSize={`${fontSizes.sub1}px`}
        letterSpacing={letterSpacing.wide}
        lineHeight={2}
        color={colors.grey}
        style={{ textTransform: "uppercase" }}
        {...props}
      />
    );
  },
  Sub2(props: TextProps) {
    return (
      <PeerTextWrapper
        $variant="body"
        fontWeight={fontWeights.semibold}
        fontSize={`${fontSizes.sub2}px`}
        letterSpacing={letterSpacing.wide}
        lineHeight={2}
        color={colors.grey}
        style={{ textTransform: "uppercase" }}
        {...props}
      />
    );
  },

  // Button text (Inter SemiBold, uppercase)
  Button(props: TextProps) {
    return (
      <PeerTextWrapper
        $variant="body"
        fontWeight={fontWeights.semibold}
        fontSize={`${fontSizes.button}px`}
        letterSpacing={letterSpacing.button}
        lineHeight="1"
        style={{ textTransform: "uppercase" }}
        {...props}
      />
    );
  },

  // Caption (Inter)
  Caption(props: TextProps) {
    return (
      <PeerTextWrapper
        $variant="body"
        fontWeight={fontWeights.medium}
        fontSize={`${fontSizes.caption}px`}
        color={colors.grey}
        {...props}
      />
    );
  },
};

/*
 * Legacy ThemedText Components
 *
 * For backwards compatibility with existing components.
 * Prefer PeerText.* for new code.
 *
 * All font sizes now use @zkp2p/brand tokens.
 */
export const ThemedText = {
  BodyPrimary(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.medium}
        fontSize={fontSizes.body}
        color="textPrimary"
        {...props}
      />
    );
  },
  BodySecondary(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.medium}
        fontSize={fontSizes.body}
        color="textSecondary"
        {...props}
      />
    );
  },
  BodySmall(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.medium}
        fontSize={fontSizes.bodySmall}
        color="textPrimary"
        {...props}
      />
    );
  },
  Caption(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.medium}
        fontSize={fontSizes.caption}
        color="textPrimary"
        {...props}
      />
    );
  },
  TitleAccent(props: TextProps) {
    return (
      <HeadingTextWrapper
        fontWeight={fontWeights.semibold}
        fontSize={fontSizes.bodyLarge}
        lineHeight={lineHeights.body}
        color="textAccent"
        {...props}
      />
    );
  },
  HeadlineSmall(props: TextProps) {
    return (
      <HeadingTextWrapper
        fontWeight={fontWeights.semibold}
        fontSize={fontSizes.bodyLarge}
        lineHeight={lineHeights.body}
        color="textPrimary"
        {...props}
      />
    );
  },
  HeadlineMedium(props: TextProps) {
    return (
      <HeadingTextWrapper
        fontWeight={fontWeights.semibold}
        fontSize={fontSizes.h6}
        color="textPrimary"
        {...props}
      />
    );
  },
  HeadlineLarge(props: TextProps) {
    return (
      <HeadingTextWrapper
        fontWeight={fontWeights.semibold}
        fontSize={fontSizes.h5}
        lineHeight={lineHeights.headline}
        color="textPrimary"
        {...props}
      />
    );
  },
  LargeHeader(props: TextProps) {
    return (
      <HeadingTextWrapper
        fontWeight={fontWeights.medium}
        fontSize={fontSizes.h5}
        color="textPrimary"
        {...props}
      />
    );
  },
  Hero(props: TextProps) {
    return (
      <HeadingTextWrapper
        fontWeight={fontWeights.semibold}
        fontSize={fontSizes.h2}
        color="textPrimary"
        {...props}
      />
    );
  },
  LabelSmall(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.semibold}
        fontSize={fontSizes.body}
        color="textSecondary"
        {...props}
      />
    );
  },
  Link(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.semibold}
        fontSize={fontSizes.bodySmall}
        color="accentAction"
        {...props}
      />
    );
  },
  MediumHeader(props: TextProps) {
    return (
      <HeadingTextWrapper
        fontWeight={fontWeights.medium}
        fontSize={fontSizes.bodyLarge}
        color="textPrimary"
        {...props}
      />
    );
  },
  SubHeaderLarge(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.medium}
        fontSize={fontSizes.bodyLarge}
        color="textPrimary"
        {...props}
      />
    );
  },
  SubHeader(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.medium}
        fontSize={fontSizes.body}
        color="textPrimary"
        lineHeight={lineHeights.relaxed}
        {...props}
      />
    );
  },
  SubHeaderSmall(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.medium}
        fontSize={fontSizes.bodySmall}
        color="textSecondary"
        {...props}
      />
    );
  },
  ModalHeadline(props: TextProps) {
    return (
      <HeadingTextWrapper
        fontWeight={fontWeights.semibold}
        fontSize={fontSizes.bodyLarge}
        lineHeight={lineHeights.body}
        color="textPrimary"
        {...props}
      />
    );
  },
  UtilityBadge(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.semibold}
        fontSize={fontSizes.badge}
        lineHeight={lineHeights.body}
        {...props}
      />
    );
  },
  DeprecatedMain(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.medium}
        color="textSecondary"
        {...props}
      />
    );
  },
  DeprecatedLink(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.medium}
        color="accentAction"
        {...props}
      />
    );
  },
  DeprecatedLabel(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.semibold}
        color="textPrimary"
        {...props}
      />
    );
  },
  DeprecatedBlack(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.medium}
        color="textPrimary"
        {...props}
      />
    );
  },
  DeprecatedWhite(props: TextProps) {
    return (
      <TextWrapper fontWeight={fontWeights.medium} color="white" {...props} />
    );
  },
  DeprecatedBody(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.medium}
        fontSize={fontSizes.body}
        color="textPrimary"
        {...props}
      />
    );
  },
  DeprecatedLargeHeader(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.semibold}
        fontSize={fontSizes.h6}
        {...props}
      />
    );
  },
  DeprecatedMediumHeader(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.medium}
        fontSize={fontSizes.bodyLarge}
        {...props}
      />
    );
  },
  DeprecatedSubHeader(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.medium}
        fontSize={fontSizes.bodySmall}
        {...props}
      />
    );
  },
  DeprecatedSmall(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.medium}
        fontSize={fontSizes.caption}
        {...props}
      />
    );
  },
  DeprecatedBlue(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.medium}
        color="accentAction"
        {...props}
      />
    );
  },
  DeprecatedRed(props: TextProps) {
    return (
      <TextWrapper fontWeight={fontWeights.medium} color="error" {...props} />
    );
  },
  DeprecatedYellow(props: TextProps) {
    return (
      <TextWrapper fontWeight={fontWeights.medium} color="warning" {...props} />
    );
  },
  DeprecatedSmallText(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={fontWeights.medium}
        fontSize={fontSizes.bodySmall}
        color="textSecondary"
        {...props}
      />
    );
  },
};
