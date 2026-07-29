import { Effect } from 'effect';
import { router } from 'react-query-kit';
import { SkyRuntime } from '@/lib/runtime';
import { BlueskyService } from '@/lib/services/bluesky/service';
import { useSessionStore } from '@/lib/state';
import { groupNotificationsByCreatedAt } from '@/lib/utils';

function fetchTimelinePage(variables: { limit?: number }, cursor?: string) {
  return SkyRuntime.runPromise(
    BlueskyService.use((s) => s.getTimeline({ ...variables, cursor })).pipe(
      Effect.tap((re) => Effect.log({ cursor: re.cursor })),
    ),
  );
}

export const skyRouter = router('sky', {
  login: router.mutation({
    mutationFn: (params: { identifier: string; password: string }) =>
      SkyRuntime.runPromise(
        Effect.gen(function* () {
          const bsky = yield* BlueskyService;
          yield* bsky.login(params.identifier, params.password);

          return {
            handle: yield* bsky.currentHandle(),
            did: yield* bsky.currentDid(),
          };
        }),
      ),
    onSuccess: ({ handle, did }) =>
      handle && did && useSessionStore.getState().setSession({ handle, did }),
  }),
  timeline: router.infiniteQuery({
    fetcher: async (variables: { limit?: number }, { pageParam }) =>
      fetchTimelinePage(variables, pageParam),
    initialPageParam: '',
    getNextPageParam: (prev) => prev.cursor,
  }),
  profile: router.query({
    fetcher: async (variables: { did: string }) =>
      await SkyRuntime.runPromise(
        Effect.gen(function* () {
          const bsky = yield* BlueskyService;
          return yield* bsky.getProfile(variables.did);
        }),
      ),
    staleTime: 60 * 60 * 24,
  }),
  profilePosts: router.infiniteQuery({
    fetcher: async (variables: { did: string }, { pageParam }) =>
      await SkyRuntime.runPromise(
        Effect.gen(function* () {
          const bsky = yield* BlueskyService;
          return yield* bsky.getAuthorPosts(variables.did, {
            cursor: pageParam,
          });
        }),
      ),
    initialPageParam: '',
    getNextPageParam: (prev) => prev.cursor,
  }),
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
  notifications: router.query({
    fetcher: async () =>
      await SkyRuntime.runPromise(
        BlueskyService.use((s) =>
          s
            .listNotifications()
            .pipe(
              Effect.flatMap((r) =>
                Effect.succeed(groupNotificationsByCreatedAt(r.notifications)),
              ),
            ),
        ),
      ),
  }),
  getConversations: router.query({
    fetcher: async () =>
      SkyRuntime.runPromise(BlueskyService.use((s) => s.getConversations())),
  }),
  getPostThread: router.query({
    fetcher: async (variables: { uri: string }) =>
      SkyRuntime.runPromise(
        BlueskyService.use((s) => s.getPostThread(variables.uri, 10)),
      ),
  }),
});
