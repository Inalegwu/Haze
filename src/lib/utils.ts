import { type AppBskyEmbedExternal, AppBskyEmbedGallery } from '@atproto/api';
import type { Notification } from '@skymarshal/sdk';
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

function extractCreatedAt(notification: Notification): Date | null {
  // Handle different possible record structures
  if (notification.record && typeof notification.record === 'object') {
    const record = notification.record as Record<string, unknown>;

    // Check if record has createdAt directly
    if ('createdAt' in record && typeof record.createdAt === 'string') {
      const date = new Date(record.createdAt);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    // Check if record has value property (common in some Bluesky structures)
    if (
      'value' in record &&
      typeof record.value === 'object' &&
      record.value !== null
    ) {
      const value = record.value as Record<string, unknown>;
      if ('createdAt' in value && typeof value.createdAt === 'string') {
        const date = new Date(value.createdAt);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }
  }

  // If record is a string, try to parse it
  if (typeof notification.record === 'string') {
    try {
      const parsed = JSON.parse(notification.record);
      if (parsed.createdAt && typeof parsed.createdAt === 'string') {
        const date = new Date(parsed.createdAt);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    } catch (e) {
      // Try to extract createdAt from string using regex
      const match = notification.record.match(/"createdAt":"([^"]+)"/);
      if (match) {
        const date = new Date(match[1] ?? 0);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }
  }

  return null;
}

export function groupNotificationsByCreatedAt(
  notifications: Notification[],
  bufferHours: number = 5,
): GroupedNotification[] {
  if (!notifications || notifications.length === 0) {
    return [];
  }

  // Parse and extract createdAt from each notification
  const itemsWithDates: NotificationWithDate[] = notifications.map(
    (notification) => ({
      ...notification,
      _createdAt: extractCreatedAt(notification),
      _originalRecord: notification.record,
    }),
  );

  // Filter out items without valid dates
  const validItems = itemsWithDates.filter(
    (item): item is NotificationWithDate & { _createdAt: Date } =>
      item._createdAt !== null && !isNaN(item._createdAt.getTime()),
  );

  if (validItems.length === 0) {
    return [];
  }

  // Sort by createdAt
  validItems.sort((a, b) => a._createdAt.getTime() - b._createdAt.getTime());

  const groups: GroupedNotification[] = [];
  let currentGroup: {
    startTime: Date;
    endTime: Date;
    items: Notification[];
    createdAtRange: {
      start: string;
      end: string;
    };
  } | null = null;
  let groupStartTime: number | null = null;

  for (const item of validItems) {
    const itemTime = item._createdAt.getTime();

    if (!currentGroup) {
      // Start first group
      currentGroup = {
        startTime: item._createdAt,
        endTime: new Date(itemTime + bufferHours * 60 * 60 * 1000),
        items: [item],
        createdAtRange: {
          start: item._createdAt.toISOString(),
          end: new Date(itemTime + bufferHours * 60 * 60 * 1000).toISOString(),
        },
      };
      groupStartTime = itemTime;
    } else {
      // Check if current item falls within the buffer window
      const groupEndTime = groupStartTime! + bufferHours * 60 * 60 * 1000;

      if (itemTime <= groupEndTime) {
        // Add to current group
        currentGroup.items.push(item);
        // Update end time if this item extends the range
        if (itemTime > currentGroup.endTime.getTime()) {
          currentGroup.endTime = item._createdAt;
          currentGroup.createdAtRange.end = item._createdAt.toISOString();
        }
      } else {
        // Start new group
        groups.push({
          groupId: `group_${currentGroup.startTime.getTime()}`,
          startTime: currentGroup.startTime.toISOString(),
          endTime: currentGroup.endTime.toISOString(),
          count: currentGroup.items.length,
          items: currentGroup.items,
          createdAtRange: currentGroup.createdAtRange,
        });

        // Find the new group start
        const groupItems: Notification[] = [item];
        const newGroupStart = itemTime;

        // Check if there are subsequent items that should be in the new group
        let j = validItems.indexOf(item) + 1;
        while (j < validItems.length) {
          const nextItemTime = validItems[j]?._createdAt.getTime() ?? 0;
          if (nextItemTime - newGroupStart <= bufferHours * 60 * 60 * 1000) {
            // @ts-expect-error
            groupItems.push(validItems[j]);
            j++;
          } else {
            break;
          }
        }

        currentGroup = {
          startTime: new Date(newGroupStart),
          endTime: new Date(newGroupStart + bufferHours * 60 * 60 * 1000),
          items: groupItems,
          createdAtRange: {
            start: new Date(newGroupStart).toISOString(),
            end: new Date(
              newGroupStart + bufferHours * 60 * 60 * 1000,
            ).toISOString(),
          },
        };
        groupStartTime = newGroupStart;
      }
    }
  }

  // Add the last group
  if (currentGroup) {
    groups.push({
      groupId: `group_${currentGroup.startTime.getTime()}`,
      startTime: currentGroup.startTime.toISOString(),
      endTime: currentGroup.endTime.toISOString(),
      count: currentGroup.items.length,
      items: currentGroup.items,
      createdAtRange: currentGroup.createdAtRange,
    });
  }

  return groups;
}

// Alternative: A simpler version that groups by a time window
export function groupNotificationsByTimeWindow(
  notifications: Notification[],
  bufferHours: number = 5,
): GroupedNotification[] {
  if (!notifications || notifications.length === 0) {
    return [];
  }

  // Parse dates
  const itemsWithDates = notifications
    .map((notification) => {
      const createdAt = extractCreatedAt(notification);
      return { notification, createdAt };
    })
    .filter(
      (item): item is { notification: Notification; createdAt: Date } =>
        item.createdAt !== null && !isNaN(item.createdAt.getTime()),
    )
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  if (itemsWithDates.length === 0) {
    return [];
  }

  const groups: GroupedNotification[] = [];
  let currentGroupItems: Notification[] = [];
  let groupStartTime: Date | null = null;
  let groupEndTime: Date | null = null;

  for (const { notification, createdAt } of itemsWithDates) {
    if (!groupStartTime) {
      // Start new group
      groupStartTime = createdAt;
      groupEndTime = new Date(
        createdAt.getTime() + bufferHours * 60 * 60 * 1000,
      );
      currentGroupItems = [notification];
    } else if (createdAt.getTime() <= groupEndTime!.getTime()) {
      // Within buffer window - add to current group
      currentGroupItems.push(notification);
      // Extend end time if this notification is later
      if (createdAt.getTime() > groupEndTime!.getTime()) {
        groupEndTime = new Date(
          createdAt.getTime() + bufferHours * 60 * 60 * 1000,
        );
      }
    } else {
      // Outside buffer window - save group and start new one
      groups.push({
        groupId: `group_${groupStartTime.getTime()}`,
        startTime: groupStartTime.toISOString(),
        endTime: groupEndTime!.toISOString(),
        count: currentGroupItems.length,
        items: currentGroupItems,
        createdAtRange: {
          start: groupStartTime.toISOString(),
          end: groupEndTime!.toISOString(),
        },
      });

      // Start new group
      groupStartTime = createdAt;
      groupEndTime = new Date(
        createdAt.getTime() + bufferHours * 60 * 60 * 1000,
      );
      currentGroupItems = [notification];
    }
  }

  // Add the last group
  if (groupStartTime && currentGroupItems.length > 0) {
    groups.push({
      groupId: `group_${groupStartTime.getTime()}`,
      startTime: groupStartTime.toISOString(),
      endTime: groupEndTime!.toISOString(),
      count: currentGroupItems.length,
      items: currentGroupItems,
      createdAtRange: {
        start: groupStartTime.toISOString(),
        end: groupEndTime!.toISOString(),
      },
    });
  }

  return groups;
}

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
