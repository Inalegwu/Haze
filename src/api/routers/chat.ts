import { router } from 'react-query-kit';
import { SkyRuntime } from '@/lib/runtime';
import { BlueskyService } from '@/lib/services/bluesky/service';

export const chatRouter = router('chat', {
  getConversations: router.query({
    fetcher: async () =>
      SkyRuntime.runPromise(BlueskyService.use((s) => s.getConversations())),
  }),
});
