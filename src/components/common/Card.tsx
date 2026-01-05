import styled from 'styled-components';
import { colors } from '@theme/colors';

const StyledCard = styled.div<{ cursor?: string }>`
  display: flex;
  background-color: ${colors.container};
  flex-direction: column;
  justify-content: space-between;
  text-decoration: none;
  color: ${colors.darkText};
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${colors.defaultBorderColor};
  cursor: ${({ cursor }) => cursor || 'normal'};
`;

const CardTitle = styled.div`
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
  color: ${colors.darkText};
  margin-bottom: 8px;
`;

const CardDescription = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  line-height: 24px;
  color: ${colors.textSecondary};
`;

interface CardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const Card = ({ title, description, children }: CardProps) => {
  return (
    <StyledCard>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
      {children}
    </StyledCard>
  );
};

export default Card;
