import { Effect } from 'effect';
import { router } from 'react-query-kit';
import { SkyRuntime } from '@/lib/runtime';
import { BlueskyService } from '@/lib/services/bluesky/service';
import { useSessionStore } from '@/lib/state';

export const authRouter = router('auth', {
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
  logout: router.mutation({
    mutationFn: async () =>
      await SkyRuntime.runPromise(BlueskyService.use((s) => s.logout())),
  }),
});
