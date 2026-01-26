import styled, { css } from "styled-components";
import {
  gradients,
  peer,
  radii,
  fontFamilies,
  fontWeights,
  fontSizes,
  letterSpacing,
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
  padding: 12px 20px;
  min-height: 44px;
  border-radius: ${radii.md}px;
  font-family: ${fontFamilies.body};
  font-size: ${fontSizes.button}px;
  font-weight: ${fontWeights.semibold};
  letter-spacing: ${letterSpacing.button};
  text-transform: uppercase;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  border: none;
  transition: ${transitions.background};
  overflow: hidden;

  ${({ variant = "primary" }) => {
    if (variant === "secondary") {
      return css`
        background: ${peer.white};
        color: ${peer.black};
        border: 1px solid transparent;

        &:hover:not([disabled]) {
          background: ${peer.lightGrey};
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
        }
      `;
    }

    return css`
      background: ${gradients.ignite};
      color: ${peer.black};
      border: none;

      &::before {
        content: "";
        position: absolute;
        inset: 0;
        background: ${gradients.igniteHover};
        opacity: 0;
        transition: opacity 0.25s ease-out;
        border-radius: inherit;
        pointer-events: none;
      }

      &:hover:not([disabled])::before {
        opacity: 1;
      }

      &:active:not([disabled]) {
        transform: scale(0.98);
      }
    `;
  }}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.6;
      pointer-events: none;
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
