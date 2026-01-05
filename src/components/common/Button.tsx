import styled from 'styled-components';
import { colors } from '@theme/colors';

export const Button = styled.button<{ variant?: 'primary' | 'secondary'; disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border: none;
  transition: background-color 0.2s ease;

  ${({ variant, disabled }) => {
    if (disabled) {
      return `
        background-color: ${colors.buttonDisabled};
        color: ${colors.offWhite};
        opacity: 0.6;
      `;
    }
    if (variant === 'secondary') {
      return `
        background-color: ${colors.backgroundSecondary};
        color: ${colors.darkText};
        border: 1px solid ${colors.defaultBorderColor};

        &:hover {
          background-color: ${colors.selectorHover};
        }
      `;
    }
    return `
      background-color: ${colors.buttonDefault};
      color: ${colors.white};

      &:hover {
        background-color: ${colors.buttonHover};
      }
    `;
  }}
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
