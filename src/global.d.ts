import type { Notification } from '@skymarshal/sdk';

declare global {
  type GlobalState = {
    theme: 'dark' | 'light' | 'system';
    toggleTheme: () => void;
  };

  type GroupedNotification = {
    groupId: string;
    startTime: string;
    endTime: string;
    count: number;
    items: Notification[];
    createdAtRange: {
      start: string;
      end: string;
    };
  };

  type NotificationWithDate = Notification & {
    _createdAt: Date | null;
    _originalRecord: unknown;
  };

  type NormalizedImage = {
    thumb: string;
    fullsize: string;
    alt: string;
    aspectRatio?: {
      width: number;
      height: number;
    };
  };
}
