import { router } from 'react-query-kit';
import { SkyRuntime } from '@/lib/runtime';
import { BlueskyService } from '@/lib/services/bluesky/service';

export const timelineRouter = router('timeline', {
  myTimelines: router.query({
    fetcher: async () =>
      await SkyRuntime.runPromise(BlueskyService.use((s) => s.getSavedFeeds())),
  }),
  getFeedContent: router.infiniteQuery({
    fetcher: async (variables: { uri: string }, { pageParam }) =>
      await SkyRuntime.runPromise(
        BlueskyService.use((s) =>
          s.getFeed(variables.uri, { cursor: pageParam }),
        ),
      ),
    initialPageParam: '',
    getNextPageParam: (prev) => prev.cursor,
  }),
  getTimeline: router.infiniteQuery({
    fetcher: async (variables: { limit?: number }, { pageParam }) =>
      await SkyRuntime.runPromise(
        BlueskyService.use((s) =>
          s.getTimeline({ ...variables, cursor: pageParam }),
        ),
      ),
    initialPageParam: '',
    getNextPageParam: (prev) => prev.cursor,
  }),
});
