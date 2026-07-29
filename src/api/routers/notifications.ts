import { router } from 'react-query-kit';
import { SkyRuntime } from '@/lib/runtime';
import { BlueskyService } from '@/lib/services/bluesky/service';

export const fetchNotifications = (params: { cursor?: string }) =>
  SkyRuntime.runPromise(BlueskyService.use((s) => s.listNotifications(params)));

export const notificationsRouter = router('notifications', {
  myNotifications: router.infiniteQuery({
    fetcher: async (_, { pageParam }) =>
      await fetchNotifications({ cursor: pageParam }),
    initialPageParam: '',
    getNextPageParam: (prev) => prev.cursor,
  }),
  unreadNotificationsCount: router.query({
    fetcher: async () =>
      SkyRuntime.runPromise(
        BlueskyService.use((s) => s.getUnreadNotificationCount()),
      ),
  }),
  markNotificationsAsRead: router.mutation({
    mutationFn: async () =>
      SkyRuntime.runPromise(
        BlueskyService.use((s) => s.markNotificationsAsRead()),
      ),
  }),
});
