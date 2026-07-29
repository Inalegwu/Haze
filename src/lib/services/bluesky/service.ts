import {
  AuthManager,
  ChatManager,
  type CreatePostInput,
  FeedsManager,
  NotificationManager,
  PostManager,
  ProfileManager,
} from '@skymarshal/sdk';
import { Effect } from 'effect';
import { asyncStorageAdapter } from '@/lib/proto/session';
import { mapFeedItem } from '@/lib/utils';
import { BlueskyAuthError, BlueskyRequestError } from './errors';

const wrap = <A>(operation: string, run: () => Promise<A>) =>
  Effect.tryPromise({
    try: run,
    catch: (cause) => new BlueskyRequestError({ cause, operation }),
  });

export class BlueskyService extends Effect.Service<BlueskyService>()(
  'app/BlueskyService',
  {
    effect: Effect.sync(() => {
      const auth = new AuthManager({
        storage: asyncStorageAdapter,
        sessionKey: 'bsky-session',
      });
      const feeds = new FeedsManager(auth.agent);
      const posts = new PostManager(auth.agent);
      const profiles = new ProfileManager(auth.agent);
      const notifications = new NotificationManager(auth.agent);
      const chat = new ChatManager(auth.agent);

      return {
        login: (identifier: string, password: string) =>
          Effect.tryPromise({
            try: () => auth.login(identifier, password),
            catch: (cause) => new BlueskyAuthError({ cause }),
          }),

        resumeSession: () =>
          Effect.tryPromise({
            try: () => auth.resumeSession(),
            catch: (cause) => new BlueskyAuthError({ cause }),
          }),

        logout: () => wrap('logout', () => auth.logout()),

        isAuthenticated: () => Effect.sync(() => auth.isAuthenticated()),
        currentHandle: () => Effect.sync(() => auth.handle),
        currentDid: () => Effect.sync(() => auth.did),

        getTimeline: (opts?: { limit?: number; cursor?: string }) =>
          wrap('getTimeline', async () => {
            const res = await auth.agent.getTimeline(opts);

            return {
              posts: res.data.feed.map(mapFeedItem),
              cursor: res.data.cursor,
            };
          }),

        getFeed: (
          feedUri: string,
          opts?: { limit?: number; cursor?: string },
        ) =>
          wrap('getFeed', async () => {
            const res = await auth.agent.app.bsky.feed.getFeed({
              feed: feedUri,
              ...opts,
            });
            return {
              posts: res.data.feed.map(mapFeedItem),
              cursor: res.data.cursor,
            };
          }),
        getSavedFeeds: () =>
          wrap('getSavedFeeds', async () => {
            const saved = await feeds.getSavedFeeds();

            const feedUris = saved
              .filter((s) => s.type === 'feed')
              .map((s) => s.value);
            const generators =
              feedUris.length > 0
                ? await feeds.getFeedGenerators(feedUris)
                : [];
            const generatorsByUri = new Map(generators.map((g) => [g.uri, g]));

            return saved.map((entry) => ({
              ...entry,
              ...(entry.type === 'feed'
                ? generatorsByUri.get(entry.value)
                : undefined),
            }));
          }),

        getFeedGenerators: (uris: string[]) =>
          wrap('getFeedGenerators', () => feeds.getFeedGenerators(uris)),

        createPost: (input: CreatePostInput) =>
          wrap('createPost', () => posts.createPost(input)),

        likePost: (uri: string, cid: string) =>
          wrap('likePost', () => posts.likePost(uri, cid)),

        unlikePost: (likeUri: string) =>
          wrap('unlikePost', () => posts.unlikePost(likeUri)),

        repost: (uri: string, cid: string) =>
          wrap('repost', () => posts.repost(uri, cid)),

        getPostThread: (uri: string, depth?: number) =>
          wrap('getPostThread', () => posts.getPostThread(uri, depth)),

        getProfile: (actor: string) =>
          wrap('getProfile', () => profiles.getProfile(actor)),

        getAuthorPosts: (
          actor: string,
          opts?: { limit?: number; cursor?: string },
        ) =>
          wrap('getAuthoPosts', async () => {
            //  posts.getAuthorPosts(actor, opts);
            const res = await auth.agent.getAuthorFeed({
              actor,
              ...opts,
            });
            return {
              posts: res.data.feed.map(mapFeedItem),
              cursor: res.data.cursor,
            };
          }),

        listNotifications: (
          opts?: Parameters<NotificationManager['listNotifications']>[0],
        ) =>
          wrap('listNotifications', () =>
            notifications.listNotifications(opts),
          ),

        getUnreadNotificationCount: () =>
          wrap('getUnreadCount', () => notifications.getUnreadCount()),

        markNotificationsAsRead: () =>
          wrap('markAllRead', () => notifications.markAllRead()),

        getConversations: () =>
          wrap('getConversations', () => chat.listConvos()),
      };
    }),
  },
) {}
