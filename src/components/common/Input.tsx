import React, { ChangeEvent, type InputHTMLAttributes } from "react";
import styled from "styled-components";
import { fontSizes, fontWeights } from "@zkp2p/brand";
import { peer, radii, fontFamilies, lineHeights, letterSpacing } from "@theme/colors";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "name" | "type"> {
  label: string;
  name: string;
  value?: string;
  type?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  readOnly = false,
  autoComplete,
  spellCheck,
  ...inputProps
}: InputProps) => {
  const resolvedAutoComplete = autoComplete ?? "off";
  return (
    <Container>
      <LabelAndInputContainer>
        <Label htmlFor={name}>{label}</Label>
        <InputWrapper>
          <StyledInput
            type={type}
            name={name}
            id={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            spellCheck={spellCheck ?? false}
            autoComplete={resolvedAutoComplete}
            {...inputProps}
          />
        </InputWrapper>
      </LabelAndInputContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  border-radius: ${radii.md}px;
  border: 1px solid ${peer.borderDark};
  background-color: ${peer.black};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

`;

const LabelAndInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
`;

const Label = styled.label`
  display: flex;
  font-size: ${fontSizes.button}px;
  font-weight: ${fontWeights.semibold};
  letter-spacing: ${letterSpacing.wide};
  text-transform: uppercase;
  color: ${peer.textSecondary};
`;

const InputWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin-top: 8px;
`;

const StyledInput = styled.input<{ readOnly?: boolean }>`
  width: 100%;
  flex-grow: 1;
  border: 0;
  padding: 0;
  color: ${peer.textPrimary};
  background-color: transparent;
  font-size: ${fontSizes.bodyLarge}px;
  font-family: ${fontFamilies.body};
  font-weight: ${fontWeights.medium};
  line-height: ${lineHeights.body};
  font-variant-numeric: tabular-nums;

  &:focus {
    box-shadow: none;
    outline: none;
  }

  &::placeholder {
    color: ${peer.textPlaceholder};
  }

  ${({ readOnly }) =>
    readOnly &&
    `
      pointer-events: none;
      opacity: 0.7;
    `}
`;
