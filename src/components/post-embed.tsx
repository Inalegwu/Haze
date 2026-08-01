import { Box, Text } from '@atoms';
import { useTheme } from '@shopify/restyle';
import { Linking, Pressable, useWindowDimensions } from 'react-native';
import type { Theme } from '@/lib/theme';
import { extractExternal, extractImages } from '@/lib/utils';
import Image from './image';
import ScrollView from './scrollview';
import TouchableOpacity from './touchable-opacity';

type Props = {
  embed: unknown;
  onImagePress?: (index: number, images: NormalizedImage[]) => void;
};

export function PostEmbed({ embed, onImagePress }: Props) {
  const images = extractImages(embed);

  if (images.length > 0) {
    return <PostImageGrid images={images} onPress={onImagePress} />;
  }

  const external = extractExternal(embed);

  if (external) {
    <PostExternalCard external={external} />;
  }

  return null;
}

const MAX_SINGLE_IMAGE_HEIGHT = 500;
const MIN_ASPECT_RATIO = 0.6; // clamp very tall portrait images
const MAX_ASPECT_RATIO = 2.4; // clamp very wide panoramic images

function PostImageGrid({
  images,
  onPress,
}: {
  images: NormalizedImage[];
  onPress?: (index: number, images: NormalizedImage[]) => void;
}) {
  const theme = useTheme<Theme>();
  const { width } = useWindowDimensions();
  const containerWidth = width - 32;
  const gap = 4;

  if (images.length === 1) {
    const rawRatio = images[0]?.aspectRatio
      ? images[0].aspectRatio.width / images[0].aspectRatio.height
      : 1.5;
    const clampedRatio = Math.min(
      Math.max(rawRatio, MIN_ASPECT_RATIO),
      MAX_ASPECT_RATIO,
    );
    const height = Math.min(
      containerWidth / clampedRatio,
      MAX_SINGLE_IMAGE_HEIGHT,
    );

    return (
      <Pressable onPress={() => onPress?.(0, images)}>
        <Image
          source={{ uri: images[0]?.thumb }}
          accessibilityLabel={images[0]?.alt}
          borderRadius="m"
          contentFit="cover"
          style={{
            height,
            width: containerWidth,
            borderColor: theme.colors.border,
            borderWidth: 1,
          }}
        />
      </Pressable>
    );
  }

  const tileSize = (containerWidth - gap) / 2;

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 5 }}
      horizontal
      flexDirection="row"
      style={{ gap }}
    >
      {images.slice(0, 4).map((img, i) => (
        <Pressable key={img.thumb} onPress={() => onPress?.(i, images)}>
          <Image
            source={{ uri: img.thumb }}
            accessibilityLabel={img.alt}
            borderRadius="m"
            style={{
              width: images.length === 3 && i === 0 ? containerWidth : tileSize,
              height: tileSize,
              borderColor: theme.colors.border,
              borderWidth: 1,
            }}
            contentFit="cover"
          />
        </Pressable>
      ))}
    </ScrollView>
  );
}

function PostExternalCard({
  external,
}: {
  external: { uri: string; title: string; description: string; thumb?: string };
}) {
  const hostname = (() => {
    try {
      return new URL(external.uri).hostname.replace(/^www\./, '');
    } catch {
      return external.uri;
    }
  })();

  return (
    <TouchableOpacity onPress={() => Linking.openURL(external.uri)}>
      <Box
        borderWidth={0.8}
        borderColor="border"
        borderRadius="m"
        overflow="hidden"
      >
        {external.thumb && (
          <Image
            source={{ uri: external.thumb }}
            style={{ width: '100%' }}
            contentFit="cover"
          />
        )}
        <Box padding="s">
          <Text fontWeight="700" numberOfLines={2}>
            {external.title || hostname}
          </Text>
          {external.description ? (
            <Text color="textMuted" numberOfLines={2} marginTop="xs">
              {external.description}
            </Text>
          ) : null}
          <Text color="textMuted" marginTop="xs">
            {hostname}
          </Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );
}
