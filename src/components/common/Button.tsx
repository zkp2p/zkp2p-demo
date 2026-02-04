import styled, { css } from "styled-components";
import {
  gradients,
  peer,
  radii,
  fontFamilies,
  fontWeights,
  fontSizes,
  letterSpacing,
  buttonSizes,
  transitions,
} from "@theme/colors";

export const Button = styled.button<{
  variant?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  min-height: ${buttonSizes.md}px;
  border-radius: ${radii.md}px;
  font-family: ${fontFamilies.body};
  font-size: ${fontSizes.button}px;
  font-weight: ${fontWeights.semibold};
  letter-spacing: ${letterSpacing.button};
  text-transform: uppercase;
  line-height: 1;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  border: none;
  touch-action: manipulation;
  transition: ${transitions.background}, transform 0.15s ease, border-color 0.2s ease,
    color 0.2s ease;

  &:focus-visible {
    outline: 2px solid ${peer.igniteYellow};
    outline-offset: 2px;
  }

  ${({ variant = "primary" }) => {
    if (variant === "secondary") {
      return css`
        background: ${peer.white};
        color: ${peer.black};
        border: 1px solid ${peer.white};

        &:hover:not([disabled]) {
          background: ${peer.lightGrey};
          border-color: ${peer.lightGrey};
          color: ${peer.black};
        }

        &:active:not([disabled]) {
          transform: scale(0.98);
          background: ${peer.white};
          color: ${peer.black};
        }
      `;
    }

    if (variant === "tertiary") {
      return css`
        background: transparent;
        color: ${peer.textSecondary};

        &:hover:not([disabled]) {
          color: ${peer.textPrimary};
        }

        &:active:not([disabled]) {
          transform: scale(0.98);
        }
      `;
    }

    // Primary variant - IGNITE gradient
    return css`
      background: ${gradients.ignite};
      color: ${peer.black};

      &:hover:not([disabled]) {
        background: ${gradients.igniteHover};
        color: ${peer.black};
      }

      &:active:not([disabled]) {
        transform: scale(0.98);
        background: ${gradients.ignite};
        color: ${peer.black};
      }
    `;
  }}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:active:not([disabled]) {
      transform: none;
    }
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
