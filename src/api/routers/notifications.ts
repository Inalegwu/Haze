import { Effect } from 'effect';
import { router } from 'react-query-kit';
import { SkyRuntime } from '@/lib/runtime';
import { BlueskyService } from '@/lib/services/bluesky/service';
import { groupNotificationsByCreatedAt } from '@/lib/utils';

export const notificationsRouter = router('notifications', {
  myNotifications: router.infiniteQuery({
    fetcher: async (_, { pageParam }) =>
      await SkyRuntime.runPromise(
        BlueskyService.use((s) =>
          s.listNotifications({ cursor: pageParam }).pipe(
            Effect.flatMap((r) =>
              Effect.succeed({
                notifications: groupNotificationsByCreatedAt(r.notifications),
                cursor: r.cursor,
              }),
            ),
          ),
        ),
      ),
    initialPageParam: '',
    getNextPageParam: (prev) => prev.cursor,
  }),
});
