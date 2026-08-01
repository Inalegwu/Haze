import { type AppBskyEmbedExternal, AppBskyEmbedGallery } from '@atproto/api';
import * as String from 'effect/String';
import { PixelRatio, Platform } from 'react-native';
import { ANDROID_SCALE_LIMIT, SCALE } from './constants';

export const normalize = (size: number) =>
  Platform.OS === 'ios'
    ? Math.round(PixelRatio.roundToNearestPixel(size * SCALE))
    : Math.round(PixelRatio.roundToNearestPixel(size * SCALE)) -
      ANDROID_SCALE_LIMIT;

export const capitalize = (word: string) => String.capitalize(word);

export const extractUrls = (text: string): string[] => {
  const urlRegex = /https?:\/\/[^\s<>"']+/g;
  const matches = text.match(urlRegex);
  return matches ? matches.map((url) => url.replace(/[.,;:!?)]$/, '')) : [];
};

export const getFeedName = (uri: string) => {
  const split = uri.split('/');

  return split[split.length - 1]?.split('-').join(' ');
};

function isImageEmbed(embed: unknown) {
  return (embed as { $type: string })?.$type === 'app.bsky.embed.images#view';
}

function isGalleryEmbed(embed: unknown) {
  return (embed as { $type: string })?.$type === 'app.bsky.embed.gallery#view';
}

export function isExternalEmbed(embed: unknown) {
  return (embed as { $type: string })?.$type === 'app.bsky.embed.external#view';
}

function isRecordWithMediaEmbed(embed: unknown) {
  return (
    (embed as { $type: string })?.$type ===
    'app.bsky.embed.recordWithMedia#view'
  );
}

export function extractImages(embed: unknown) {
  if (isImageEmbed(embed)) {
    // @ts-expect-error
    return embed.images.map((img) => ({
      thumb: img.thumb,
      fullsize: img.fullsize,
      alt: img.alt,
      aspectRatio: img.aspectRatio,
    }));
  }

  if (isGalleryEmbed(embed)) {
    return (
      // @ts-expect-error
      embed.items
        // @ts-expect-error
        .filter((item) => AppBskyEmbedGallery.isViewImage(item))
        // @ts-expect-error
        .map((item) => ({
          thumb: item.thumb,
          alt: item.alt,
          fullsize: item.fullsize,
          aspectRatio: item.aspectRatio,
        }))
    );
  }

  if (isRecordWithMediaEmbed(embed)) {
    // @ts-expect-error
    return extractImages(embed.media);
  }

  return [];
}

export type ExternalEmbed = AppBskyEmbedExternal.ViewExternal;

export function extractExternal(embed: unknown): ExternalEmbed | null {
  // @ts-expect-error
  if (isExternalEmbed(embed)) return embed.external;
  // @ts-expect-error
  if (isRecordWithMediaEmbed(embed)) return extractExternal(embed.media);
  return null;
}

// src/services/bluesky/BlueskyService.ts
import { AppBskyFeedDefs } from '@atproto/api';
import moment from 'moment';

export type ReplyParentPost = {
  uri: string;
  cid: string;
  text: string;
  author: {
    did: string;
    handle: string;
    displayName?: string;
    avatar?: string;
  };
};

export function extractReplyParent(
  item: AppBskyFeedDefs.FeedViewPost,
): ReplyParentPost | undefined {
  const parent = item.reply?.parent;
  // parent can also be NotFoundPost or BlockedPost — narrow to the real thing
  if (!parent || !AppBskyFeedDefs.isPostView(parent)) return undefined;

  return {
    uri: parent.uri,
    cid: parent.cid,
    text: (parent.record as { text?: string })?.text ?? '',
    author: {
      did: parent.author.did,
      handle: parent.author.handle,
      displayName: parent.author.displayName,
      avatar: parent.author.avatar,
    },
  };
}

export function mapFeedItem(item: AppBskyFeedDefs.FeedViewPost) {
  const post = item.post;
  return {
    uri: post.uri,
    cid: post.cid,
    text: (post.record as { text?: string })?.text ?? '',
    createdAt:
      (post.record as { createdAt?: string })?.createdAt ?? post.indexedAt,
    author: {
      did: post.author.did,
      handle: post.author.handle,
      displayName: post.author.displayName,
      avatar: post.author.avatar,
    },
    embed: post.embed,
    replyCount: post.replyCount ?? 0,
    repostCount: post.repostCount ?? 0,
    likeCount: post.likeCount ?? 0,
    indexedAt: post.indexedAt,
    reason:
      item.reason?.$type === 'app.bsky.feed.defs#reasonRepost'
        ? {
            type: 'repost' as const,
            by: {
              // @ts-expect-error
              did: item.reason.by.did,
              // @ts-expect-error
              handle: item.reason.by.handle,
              // @ts-expect-error
              displayName: item.reason.by.displayName,
            },
            // @ts-expect-error
            indexedAt: item.reason.indexedAt,
          }
        : undefined,
    replyParent: extractReplyParent(item),
  };
}

export const formatDate = (createdAt: string) => {
  const date = moment(createdAt);
  const now = moment();

  if (now.diff(date, 'hours') < 24) {
    return date.fromNow(true);
  }

  return date.year() === now.year()
    ? date.format('MMM D')
    : date.format('YYYY');
};

export function formatNumber(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs < 1000) return `${sign}${abs}`;

  const units: [number, string][] = [
    [1_000_000_000, 'b'],
    [1_000_000, 'm'],
    [1_000, 'k'],
  ];

  for (const [threshold, suffix] of units) {
    if (abs >= threshold) {
      const scaled = Math.floor((abs / threshold) * 10) / 10; // truncate to 1 decimal, don't round
      const formatted =
        scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1);
      return `${sign}${formatted}${suffix}`;
    }
  }

  return `${sign}${abs}`;
}
