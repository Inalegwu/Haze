import app from '@api';
import { Box, Text } from '@atoms';
import { Container, FlatList, Post } from '@components';
import { useTheme } from '@shopify/restyle';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import type { Theme } from '@/lib/theme';

export default function Feed() {
  const color = useTheme<Theme>().colors;
  const { uri } = useLocalSearchParams<{ uri: string }>();

  const { data, isLoading } = app.timeline.getFeedContent.useInfiniteQuery({
    variables: {
      uri,
    },
  });

  if (isLoading) {
    return (
      <Container alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color={color.primary} />
      </Container>
    );
  }

  return (
    <FlatList
      ListHeaderComponent={() => (
        <Box width="100%" paddingHorizontal="m">
          <Text>Feed</Text>
        </Box>
      )}
      data={data?.pages.flatMap((page) => page.posts)}
      renderItem={({ item }) => <Post post={item} />}
    />
  );
}
