import app from '@api';
import { Box, FlatList, ScrollView, Text, TouchableOpacity } from '@atoms';
import { Container, Post, PostSkeleton } from '@components';
import { useTheme } from '@shopify/restyle';
import { Array } from 'effect';
import { useCallback } from 'react';
import { ActivityIndicator, RefreshControl } from 'react-native';
import { useGlobalState } from '@/lib/state';
import type { Theme } from '@/lib/theme';

export function TabbedTimelineView() {
  const savedPins = useGlobalState((s) => s.pinnedTimelines);
  const unpin = useGlobalState((s) => s.unpinTimeline);

  const pinnedTimelines = Array.fromIterable(savedPins);

  return (
    <Container>
      <Text>Tabbed view</Text>
      <ScrollView horizontal width="100%">
        {pinnedTimelines.map((timeline) => (
          <TouchableOpacity
            key={timeline.key}
            onLongPress={() => unpin(timeline.key)}
          >
            <Text>{timeline.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text>{JSON.stringify(pinnedTimelines)}</Text>
    </Container>
  );
}

// TODO: this is a tab view that lists the users subscribed feeds
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
    return Array.from({ length: 6 }).map((_, i) => <PostSkeleton key={i} />);
  }

  return (
    <FlatList
      backgroundColor="background"
      data={data?.pages.flatMap((page) => page.posts)}
      keyExtractor={(item) => item.cid}
      renderItem={({ item }) => <Post post={item} />}
      onEndReached={onEndReached}
      onEndReachedThreshold={20}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </>
        ) : null
      }
      ListEmptyComponent={
        !isLoading ? (
          <Box padding="m">
            <ActivityIndicator size="large" color={theme.colors.accent} />
          </Box>
        ) : null
      }
    />
  );
}
