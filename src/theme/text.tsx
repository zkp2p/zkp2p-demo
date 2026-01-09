/**
 * Preset styles of the Rebass Text component
 */

import { Text, TextProps as TextPropsOriginal } from 'rebass'
import styled from 'styled-components'

const TextWrapper = styled(Text).withConfig({
  shouldForwardProp: (prop) => prop !== 'color',
})<{ color: keyof string }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

type TextProps = Omit<TextPropsOriginal, 'css'>

export const ThemedText = {
  BodyPrimary(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color="textPrimary" {...props} />
  },
  BodySecondary(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color="textSecondary" {...props} />
  },
  BodySmall(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} color="textPrimary" {...props} />
  },
  Caption(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={12} color="textPrimary" {...props} />
  },
  HeadlineSmall(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={20} lineHeight="28px" color="textPrimary" {...props} />
  },
  HeadlineMedium(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} color="textPrimary" {...props} />
  },
  HeadlineLarge(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={36} lineHeight="44px" color="textPrimary" {...props} />
  },
  LargeHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={36} color="textPrimary" {...props} />
  },
  Hero(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={48} color="textPrimary" {...props} />
  },
  LabelSmall(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={16} color="textSecondary" {...props} />
  },
  SubHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={16} color="textPrimary" lineHeight="24px" {...props} />
  },
}
