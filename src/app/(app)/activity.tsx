import app from '@api';
import { Box, Text } from '@atoms';
import { Container, FlatList, TouchableOpacity } from '@components';
import { useTheme } from '@shopify/restyle';
import { router } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, Image } from 'react-native';
import type { fetchNotifications } from 'src/api/routers/notifications';
import SafeAreaView from 'src/components/safe-area-view';
import type { Theme } from '@/lib/theme';

type NotificationPage = Awaited<ReturnType<typeof fetchNotifications>>;

type NotificationItem = NotificationPage['notifications'][number];

const REASON_LABEL: Record<NotificationItem['reason'], string> = {
  like: 'liked your post',
  repost: 'reposted your post',
  follow: 'followed you',
  mention: 'mentioned you',
  reply: 'replied to your post',
  quote: 'quoted your post',
};

function extractRecordText(notification: NotificationItem): string | null {
  if (['reply', 'mention', 'quote'].includes(notification.reason)) {
    return (notification.record as { text?: string } | undefined)?.text ?? null;
  }
  return null;
}

export default function Activity() {
  const color = useTheme<Theme>().colors;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = app.notifications.myNotifications.useInfiniteQuery();

  const { mutate: markAsRead } =
    app.notifications.markNotificationsAsRead.useMutation();

  const notifications = data?.pages.flatMap((page) => page.notifications);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    markAsRead();
  }, [markAsRead]);

  if (isLoading) {
    return (
      <Container alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color={color.primary} />
      </Container>
    );
  }

  return (
    <SafeAreaView gap="3" backgroundColor="background">
      <Box
        width="100%"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
        paddingHorizontal="m"
      >
        <Text fontFamily="SatoshiBlack" fontSize={25}>
          Activity
        </Text>
      </Box>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={notifications}
        keyExtractor={(n) => n.uri}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshing={isRefetching}
        onRefresh={refetch}
        renderItem={({ item: notification }) => (
          <NotificationRow notification={notification} />
        )}
      />
    </SafeAreaView>
  );
}

function NotificationRow({ notification }: { notification: NotificationItem }) {
  const previewText = extractRecordText(notification);

  const onPress = () => {
    if (notification.reason === 'follow') {
      router.push(`/profile/${notification.author.handle}`);
      // console.log('implement viewing single profiles');
    } else if (
      notification.reason === 'like' ||
      notification.reason === 'repost'
    ) {
      if (notification.reasonSubject)
        router.push(`/post/${encodeURIComponent(notification.reasonSubject)}`);
    } else {
      router.push(`/post/${encodeURIComponent(notification.uri)}`);
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        flexDirection="row"
        padding="m"
        backgroundColor={notification.isRead ? 'background' : 'accent'}
      >
        <Image
          source={{ uri: notification.author.avatar }}
          style={{ width: 36, height: 36, borderRadius: 18 }}
        />
        <Box flex={1} paddingLeft="s">
          <Text>
            <Text fontSize={12} fontFamily="SatoshiBold">
              {notification.author.displayName ?? notification.author.handle}
            </Text>
            {REASON_LABEL[notification.reason]}
          </Text>
          {previewText && (
            <Text color="textMuted" numberOfLines={2} marginTop="xs">
              {previewText}
            </Text>
          )}
        </Box>
      </Box>
    </TouchableOpacity>
  );
}
