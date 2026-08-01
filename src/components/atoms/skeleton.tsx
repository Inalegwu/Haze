import { Box } from '@atoms';
import type { BoxProps } from '@shopify/restyle';
import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import type { Theme } from '@/lib/theme';

const AnimatedBox = Animated.createAnimatedComponent(Box);

type Props = BoxProps<Theme>;

export function Skeleton(props: Props) {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1, // repeat indefinitely
      true, // reverse each cycle, so it pulses rather than snapping back
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <AnimatedBox
      backgroundColor="border"
      borderRadius="s"
      style={animatedStyle}
      {...props}
    />
  );
}
