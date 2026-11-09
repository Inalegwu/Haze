import AsyncStorage from '@react-native-async-storage/async-storage';
import Array from 'effect/Array';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SessionMeta = { handle: string; did: string } | null;

type SessionStore = {
  session: SessionMeta;
  setSession: (session: SessionMeta) => void;
  clearSession: () => void;
};

export const useGlobalState = create<GlobalState>()(
  persist(
    (set) => ({
      theme: 'light',
      pinnedTimelines: new Set([
        { name: 'For You', key: 'for-you' },
        { name: 'Following', key: 'following' },
      ]),
      toggleTheme: () =>
        set((prev) => ({
          ...prev,
          theme: prev.theme === 'dark' ? 'light' : 'dark',
        })),
      pinTimeline: (timeline) =>
        set((prev) => ({
          ...prev,
          pinnedTimelines: new Set([...prev.pinnedTimelines, timeline]),
        })),
      unpinTimeline: (key) =>
        set((prev) => {
          if (key === 'for-you' || key === 'following') return prev;

          const _ = Array.fromIterable(prev.pinnedTimelines.values());
          const newSaved = new Set([..._.filter((v) => v.key !== key)]);
          // const newSaved=new Set([...prev.pinnedTimelines.values.filter(v=>!v.key===key)])

          return { ...prev, pinnedTimelines: newSaved };
        }),
    }),
    {
      name: 'global-state',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    {
      name: 'bsky-session-meta',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
