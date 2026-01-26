import type { ReactNode } from "react";
import styled from "styled-components";
import { peer, radii } from "@theme/colors";

const StyledCard = styled.div<{ cursor?: string }>`
  display: flex;
  background-color: ${peer.richBlack};
  flex-direction: column;
  justify-content: space-between;
  text-decoration: none;
  color: ${peer.textPrimary};
  padding: 24px;
  border-radius: ${radii.lg}px;
  border: 1px solid ${peer.borderDark};
  cursor: ${({ cursor }) => cursor || "normal"};
`;

const CardTitle = styled.div`
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
  color: ${peer.textPrimary};
  margin-bottom: 8px;
`;

const CardDescription = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  line-height: 24px;
  color: ${peer.textSecondary};
`;

interface CardProps {
  title: string;
  description: string;
  children?: ReactNode;
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
