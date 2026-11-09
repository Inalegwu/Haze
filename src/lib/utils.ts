import * as String from 'effect/String';
// TODO: consider changing this to date-fns
import moment from 'moment';
import { cache } from 'react';
import { PixelRatio, Platform } from 'react-native';
import { ANDROID_SCALE_LIMIT, SCALE } from './constants';

export const getInitials = cache((phrase: string) => {
  const split = phrase.split(' ');

  return `${split[0]?.[0]}${split[1]?.[0]}`;
});

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

export const mapFeedItem = (post: unknown) => {
  console.log(post);
  return post;
};
