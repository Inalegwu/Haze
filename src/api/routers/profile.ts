import { router } from 'react-query-kit';
import { SkyRuntime } from '@/lib/runtime';
import { BlueskyService } from '@/lib/services/bluesky/service';

export const profileRouter = router('profile', {
  myProfile: router.query({
    fetcher: async (variables: { did: string }) =>
      await SkyRuntime.runPromise(
        BlueskyService.use((s) => s.getProfile(variables.did)),
      ),
    staleTime: Number.POSITIVE_INFINITY,
  }),
  getProfile: router.query({
    fetcher: async (variables: { handle: string }) =>
      await SkyRuntime.runPromise(
        BlueskyService.use((s) => s.getProfile(variables.handle)),
      ),
  }),
  profilePosts: router.infiniteQuery({
    fetcher: async (variables: { actor: string }, { pageParam }) =>
      await SkyRuntime.runPromise(
        BlueskyService.use((s) =>
          s.getAuthorPosts(variables.actor, {
            cursor: pageParam,
          }),
        ),
      ),
    initialPageParam: '',
    getNextPageParam: (prev) => prev.cursor,
  }),
});
