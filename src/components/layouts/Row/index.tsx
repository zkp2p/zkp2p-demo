import { Box } from 'rebass/styled-components';
import styled from 'styled-components';

const Row = styled(Box)<{
  width?: string
  align?: string
  justify?: string
  padding?: string
  border?: string
  borderRadius?: string
  gap?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  display: flex;
  align-items: ${({ align }) => align ?? 'center'};
  justify-content: ${({ justify }) => justify ?? 'flex-start'};
  padding: ${({ padding }) => padding ?? '0'};
  border: ${({ border }) => border ?? 'none'};
  border-radius: ${({ borderRadius }) => borderRadius ?? '0'};
  gap: ${({ gap }) => gap ?? '0'};
`;

export const RowBetween = styled(Row)`
  justify-content: space-between;
`;

export const RowCenter = styled(Row)`
  justify-content: center;
`;

export const RowFixed = styled(Row)<{ gap?: string; justify?: string }>`
  width: fit-content;
  margin: ${({ gap }) => (gap ? `-${gap}` : '0')};
`;

export default Row;
