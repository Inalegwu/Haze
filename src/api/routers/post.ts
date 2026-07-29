import { router } from 'react-query-kit';
import { SkyRuntime } from '@/lib/runtime';
import { BlueskyService } from '@/lib/services/bluesky/service';

export const postRouter = router('post', {
  getPostThread: router.query({
    fetcher: async (variables: { uri: string }) =>
      SkyRuntime.runPromise(
        BlueskyService.use((s) => s.getPostThread(variables.uri, 10)),
      ),
  }),
});
