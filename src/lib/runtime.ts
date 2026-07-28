import { ManagedRuntime } from 'effect';
import { BlueskyService } from './services/bluesky/service';

export const SkyRuntime = ManagedRuntime.make(BlueskyService.Default);
