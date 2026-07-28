import {
  AuthManager,
  type CreatePostInput,
  FeedsManager,
  NotificationManager,
  PostManager,
  ProfileManager,
} from '@skymarshal/sdk';
import { Effect } from 'effect';
import { asyncStorageAdapter } from '@/lib/proto/session';
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
          wrap('getTimeline', () => feeds.getTimeline(opts)),

        getFeed: (
          feedUri: string,
          opts?: { limit?: number; cursor?: string },
        ) => wrap('getFeed', () => feeds.getFeed(feedUri, opts)),

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

        listNotifications: (
          opts?: Parameters<NotificationManager['listNotifications']>[0],
        ) =>
          wrap('listNotifications', () =>
            notifications.listNotifications(opts),
          ),

        getUnreadNotificationCount: () =>
          wrap('getUnreadCount', () => notifications.getUnreadCount()),
      };
    }),
  },
) {}
