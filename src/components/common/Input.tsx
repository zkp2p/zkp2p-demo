import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { colors } from '@theme/colors';

interface InputProps {
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
}: InputProps) => {
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
            spellCheck="false"
            autoComplete="off"
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
  border-radius: 16px;
  border: 1px solid ${colors.defaultBorderColor};
  background-color: ${colors.inputDefaultColor};

  &:focus-within {
    border-color: ${colors.inputPlaceholderColor};
    border-width: 1px;
  }
`;

const LabelAndInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
`;

const Label = styled.label`
  display: flex;
  font-size: 14px;
  font-weight: 550;
  color: #CED4DA;
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
  color: ${colors.darkText};
  background-color: ${colors.inputDefaultColor};
  font-size: 18px;

  &:focus {
    box-shadow: none;
    outline: none;
  }

  &::placeholder {
    color: ${colors.inputPlaceholderColor};
  }

  ${({ readOnly }) =>
    readOnly &&
    `
      pointer-events: none;
    `}
`;
