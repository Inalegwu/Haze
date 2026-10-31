import type { ImageProps } from 'expo-image';
import * as React from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import Box from '../box';
import Image from '../image';
import Text from '../text';

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

type AvatarContextValue = {
  imageLoadingStatus: ImageLoadingStatus;
};

const AvatarContext = React.createContext<AvatarContextValue | null>(null);

function useAvatarContext() {
  const ctx = React.use(AvatarContext);

  if (!ctx) throw new Error('Avatar parts must be used in Avatar.Root');

  return ctx;
}

type AvatarRootProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AvatarRoot({ children, style }: AvatarRootProps) {
  const [imageLoadingStatus] = React.useState<ImageLoadingStatus>('idle');

  const ctxValue = React.useMemo(
    () => ({ imageLoadingStatus }),
    [imageLoadingStatus],
  );

  return (
    <AvatarContext.Provider value={ctxValue}>
      <Box
        style={style}
        alignItems="center"
        backgroundColor="textMuted"
        borderRadius="full"
        justifyContent="center"
        overflow="hidden"
      >
        {children}
      </Box>
    </AvatarContext.Provider>
  );
}

type AvatarImageProps = Omit<ImageProps, 'source'> & {
  src: string;
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
  style?: StyleProp<ImageProps['style']>;
};

export function AvatarImage({
  src,
  onLoadingStatusChange,
  style,
  ...rest
}: AvatarImageProps) {
  const { imageLoadingStatus } = useAvatarContext();
  const [status, setStatus] = React.useState<ImageLoadingStatus>(
    // was default to 'idle' before
    src ? 'loading' : imageLoadingStatus,
  );
  const updateStatus = React.useCallback(
    (status: ImageLoadingStatus) => {
      setStatus(status);
      onLoadingStatusChange?.(status);
    },
    [onLoadingStatusChange],
  );

  React.useEffect(() => {
    if (!src) {
      updateStatus('idle');
      return;
    }
    updateStatus('loading');
  }, [src, updateStatus]);

  if (status !== 'loaded') return null;

  return (
    <Image
      width="100%"
      height="100%"
      source={{ uri: src }}
      onLoad={() => updateStatus('loaded')}
      onError={() => updateStatus('error')}
      style={style}
      {...rest}
    />
  );
}

type AvatarFallbackProps = {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function AvatarFallback({
  children,
  delay = 0,
  style,
  textStyle,
}: AvatarFallbackProps) {
  const { imageLoadingStatus } = useAvatarContext();

  const [delayPassed, setDelayPassed] = React.useState(delay === 0);

  React.useEffect(() => {
    if (delay <= 0) {
      setDelayPassed(true);
    }

    const timeout = setTimeout(() => setDelayPassed(true), delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay]);

  const shouldRender =
    imageLoadingStatus !== 'loaded' && (delay === 0 || delayPassed);

  if (!shouldRender) return null;

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100%"
      style={style}
    >
      {typeof children === 'string' ? (
        <>
          <Text
            color="textMuted"
            fontSize={12}
            fontWeight={600}
            style={textStyle}
          >
            {children}
          </Text>
        </>
      ) : (
        <>{children}</>
      )}
    </Box>
  );
}

export const Avatar = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
} as const;
