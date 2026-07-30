import app from '@api';
import { Box } from '@atoms';
import { Container, FlatList, Post } from '@components';
import { useTheme } from '@shopify/restyle';
import { useCallback } from 'react';
import { ActivityIndicator, RefreshControl } from 'react-native';
import type { Theme } from '@/lib/theme';

export default function Feed() {
  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = app.timeline.getTimeline.useInfiniteQuery();

  const theme = useTheme<Theme>();

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

  if (isLoading || !data) {
    return (
      <Container alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </Container>
    );
  }

  return (
    <FlatList
      backgroundColor="background"
      data={data?.pages.flatMap((page) => page.posts)}
      keyExtractor={(item) => item.cid}
      renderItem={({ item }) => <Post post={item} />}
      onEndReached={onEndReached}
      onEndReachedThreshold={2}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <Box
            width="100%"
            padding="m"
            alignItems="center"
            justifyContent="center"
          >
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </Box>
        ) : null
      }
      ListEmptyComponent={
        !isLoading ? (
          <Box padding="m">
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </Box>
        ) : null
      }
    />
  );
}
