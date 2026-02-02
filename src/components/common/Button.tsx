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
  transition: ${transitions.background}, transform 0.15s ease, border-color 0.2s ease,
    color 0.2s ease;

  ${({ variant = "primary" }) => {
    if (variant === "secondary") {
      return css`
        background: transparent;
        color: ${peer.white};
        border: 1px solid ${peer.white};

        &:hover:not([disabled]) {
          border-color: ${peer.lightGrey};
          color: ${peer.lightGrey};
        }

        &:active:not([disabled]) {
          transform: scale(0.98);
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
      }

      &:active:not([disabled]) {
        transform: scale(0.98);
        background: ${gradients.ignite};
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
