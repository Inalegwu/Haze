import { Box } from '@atoms';
import { Container, FlatList, Post } from '@components';
import { useTheme } from '@shopify/restyle';
import { ActivityIndicator, RefreshControl } from 'react-native';
import { app } from 'src/api/app';
import { useSessionStore } from '@/lib/state';
import type { Theme } from '@/lib/theme';
import { useCallback } from 'react';

export default function Profile() {
  const session = useSessionStore((s) => s.session);
  const theme = useTheme<Theme>();
  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = app.sky.profilePosts.useInfiniteQuery({
    variables: {
      did: session!.did,
    },
  });

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

  if (isLoading || !data) {
    return (
      <Container
        width="100%"
        flex={1}
        alignItems="center"
        justifyContent="center"
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </Container>
    );
  }

  return (
    <FlatList
      data={data?.pages.flatMap((page) => page.posts)}
      keyExtractor={(item) => item.cid}
      renderItem={({ item }) => <Post post={item} />}
      onEndReached={onEndReached}
      onEndReachedThreshold={2}
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
