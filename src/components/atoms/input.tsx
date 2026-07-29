import {
  type BackgroundColorProps,
  type BorderProps,
  backgroundColor,
  border,
  type ColorProps,
  color,
  composeRestyleFunctions,
  type LayoutProps,
  layout,
  type PositionProps,
  type SpacingProps,
  spacing,
  useRestyle,
} from '@shopify/restyle';
import type React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import type { Theme } from '@/lib/theme';

type RestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  LayoutProps<Theme> &
  PositionProps<Theme> &
  ColorProps<Theme>;

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  spacing,
  border,
  backgroundColor,
  layout,
  color,
]);

type Props = RestyleProps & TextInputProps;

const Input: React.FC<Props> = ({ onChange, onChangeText, ...rest }) => {
  const props = useRestyle(restyleFunctions, rest);
  return (
    <TextInput {...props} onChange={onChange} onChangeText={onChangeText} />
  );
};

export default Input;
