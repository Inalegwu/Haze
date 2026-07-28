import { Box } from '@atoms';
import type { BoxProps } from '@shopify/restyle';
import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import type { Theme } from '@/lib/theme';

type Props = BoxProps<Theme> & {
  children: ReactNode;
  style?: ViewStyle;
};

export default function Container(props: Props) {
  return (
    <Box backgroundColor="background" flex={1} {...props}>
      {props.children}
    </Box>
  );
}
