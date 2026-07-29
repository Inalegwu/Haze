import AsyncStorage from '@react-native-async-storage/async-storage';
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
      theme: 'dark',
      toggleTheme: () =>
        set((prev) => ({
          ...prev,
          theme: prev.theme === 'dark' ? 'light' : 'dark',
        })),
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
