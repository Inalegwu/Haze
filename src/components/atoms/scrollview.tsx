import {
  type BackgroundColorProps,
  backgroundColor,
  composeRestyleFunctions,
  type LayoutProps,
  layout,
  type SpacingProps,
  spacing,
  useRestyle,
} from '@shopify/restyle';
import type React from 'react';
import {
  ScrollView as NativeScrollView,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { Theme } from '@/lib/theme';

type RestyleProps = SpacingProps<Theme> &
  BackgroundColorProps<Theme> &
  LayoutProps<Theme>;

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  spacing,
  backgroundColor,
  layout,
]);

type Props = RestyleProps &
  ScrollViewProps & {
    children: React.ReactNode;
    contentContainerStyle?: StyleProp<ViewStyle>;
  };

export default function ScrollView({
  children,
  contentContainerStyle,
  ...rest
}: Props) {
  const props = useRestyle(restyleFunctions, rest);
  return (
    <NativeScrollView contentContainerStyle={contentContainerStyle} {...props}>
      {children}
    </NativeScrollView>
  );
}
