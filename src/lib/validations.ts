// src/lib/validators/at-identifier.ts
import { z } from 'zod';

// https://atproto.com/specs/handle — official reference regex
const HANDLE_REGEX =
  /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

// https://atproto.com/specs/did — official reference regex (syntax only, not method support)
const DID_REGEX = /^did:[a-z]+:[a-zA-Z0-9._:%-]*[a-zA-Z0-9._-]$/;

export const atHandleSchema = z
  .string()
  .max(253, 'Handle must be 253 characters or fewer')
  .regex(
    HANDLE_REGEX,
    'Not a valid handle (expected something like alice.bsky.social)',
  );

export const atDidSchema = z
  .string()
  .regex(DID_REGEX, 'Not a valid DID (expected something like did:plc:...)');

// An "at-identifier" per the AT Proto lexicon is either a handle or a DID
export const atIdentifierSchema = z
  .string()
  .trim()
  .refine((value) => HANDLE_REGEX.test(value) || DID_REGEX.test(value), {
    message:
      'Must be a valid Bluesky handle (e.g. alice.bsky.social) or DID (e.g. did:plc:ewvi7nxzyoun6zhxrhs64oiz)',
  });

export const LoginSchema = z.object({
  identifier: atIdentifierSchema,
  password: z.string(),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export type AtIdentifier = z.infer<typeof atIdentifierSchema>;
