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
} from "@theme/colors";

export const Button = styled.button<{
  variant?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  min-height: ${buttonSizes.md}px;
  border-radius: ${radii.md}px;
  font-family: ${fontFamilies.body};
  font-size: ${fontSizes.button}px;
  font-weight: ${fontWeights.semibold};
  letter-spacing: ${letterSpacing.button};
  text-transform: uppercase;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  border: none;
  transition: transform 0.15s ease, filter 0.15s ease;

  ${({ variant = "primary" }) => {
    if (variant === "secondary") {
      return css`
        background: ${peer.white};
        color: ${peer.black};

        &:hover:not([disabled]) {
          background: ${peer.lightGrey};
        }

        &:active:not([disabled]) {
          transform: scale(0.98);
        }
      `;
    }

    if (variant === "tertiary") {
      return css`
        background: ${peer.richBlack};
        color: ${peer.textPrimary};
        border: 1px solid ${peer.borderDark};

        &:hover:not([disabled]) {
          background: ${peer.black};
          border-color: ${peer.textSecondary};
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
        filter: brightness(1.1);
      }

      &:active:not([disabled]) {
        transform: scale(0.98);
        filter: brightness(0.95);
      }
    `;
  }}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
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
