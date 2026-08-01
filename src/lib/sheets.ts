import { router } from 'expo-router';

export type SheetParams =
  | {
      sheet: 'compose';
      replyToUri?: string;
      replyToCid?: string;
      replyToHandle?: string;
      quoteUri?: string;
      quoteCid?: string;
      quoteHandle?: string;
      quoteText?: string;
    }
  | {
      sheet: 'post-actions';
      postUri: string;
      postCid: string;
      isOwnPost: boolean;
    };

export function openSheet(params: SheetParams) {
  const encoded = Object.fromEntries(
    Object.entries(params).map(([k, v]) => [
      k,
      typeof v === 'boolean' ? String(v) : v,
    ]),
  );
  router.setParams(encoded as Record<string, string>);
}

export function closeSheet() {
  router.setParams({
    sheet: undefined,
    replyToUri: undefined,
    replyToCid: undefined,
    replyToHandle: undefined,
    quoteUri: undefined,
    quoteCid: undefined,
    quoteHandle: undefined,
    quoteText: undefined,
    postUri: undefined,
    postCid: undefined,
    isOwnPost: undefined,
  });
}
