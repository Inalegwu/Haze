import {
  type BorderProps,
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
import { Image as ExpoImage, type ImageProps } from 'expo-image';
import type { Theme } from '@/lib/theme';

type RestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  LayoutProps<Theme> &
  PositionProps<Theme> &
  SpacingShorthandProps<Theme> &
  ShadowProps<Theme>;

const restyleFunction = composeRestyleFunctions<Theme, RestyleProps>([
  spacing,
  layout,
  shadow,
  border,
  position,
]);

type Props = RestyleProps & ImageProps;

export default function Image({ source, ...rest }: Props) {
  const props = useRestyle(restyleFunction, rest);
  return <ExpoImage source={source} {...props} />;
}
