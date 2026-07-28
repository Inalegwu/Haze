import { Data } from 'effect';

export class BlueskyAuthError extends Data.TaggedError('BlueskyAuthError')<{
  cause: unknown;
}> {}

export class BlueskyRequestError extends Data.TaggedError(
  'BlueskyRequestError',
)<{
  cause: unknown;
  operation: string;
}> {}
