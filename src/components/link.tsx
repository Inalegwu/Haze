import {
  type BackgroundColorProps,
  type BorderProps,
  backgroundColor,
  border,
  composeRestyleFunctions,
  type LayoutProps,
  layout,
  type PositionProps,
  position,
  type ShadowProps,
  type SpacingProps,
  type SpacingShorthandProps,
  shadow,
  spacing,
  useRestyle,
} from '@shopify/restyle';
import { type LinkProps, Link as RouterLink } from 'expo-router';
import type { Theme } from '@/lib/theme';

type RestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  LayoutProps<Theme> &
  BackgroundColorProps<Theme> &
  PositionProps<Theme> &
  SpacingShorthandProps<Theme> &
  ShadowProps<Theme>;

const restyleFunction = composeRestyleFunctions<Theme, RestyleProps>([
  spacing,
  layout,
  backgroundColor,
  shadow,
  border,
  position,
]);

type Props = RestyleProps & LinkProps;

export default function Link({ children, href, ...rest }: Props) {
  const props = useRestyle(restyleFunction, rest);

  return (
    <RouterLink href={href} {...props}>
      {children}
    </RouterLink>
  );
}
