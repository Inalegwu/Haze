import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { dark, light, type Theme } from './theme';
import { validateTheme } from './valia/validate';

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

export type ThemeEntry = {
  id: string;
  name: string;
  theme: Theme;
  isBuiltIn: boolean;
};

const BUILT_IN_THEMES: ThemeEntry[] = [
  { id: 'light', name: 'Default Light', theme: light, isBuiltIn: true },
  { id: 'dark', name: 'Default Dark', theme: dark, isBuiltIn: true },
];

type ThemeStore = {
  customThemes: ThemeEntry[];
  activeThemeId: string;
  addCustomTheme: (
    name: string,
    candidate: unknown,
  ) => { success: true } | { success: false; errors: string[] };
  removeCustomTheme: (id: string) => void;
  setActiveTheme: (id: string) => void;
  getAllThemes: () => ThemeEntry[];
  getActiveTheme: () => Theme;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      customThemes: [],
      activeThemeId: 'dark',

      addCustomTheme: (name, candidate) => {
        const result = validateTheme(candidate);
        if (!result.valid) return { success: false, errors: result.errors };

        const id = `custom:${Date.now()}`;
        set((state) => ({
          customThemes: [
            ...state.customThemes,
            { id, name, theme: result.theme, isBuiltIn: false },
          ],
        }));
        return { success: true };
      },

      removeCustomTheme: (id) =>
        set((state) => ({
          customThemes: state.customThemes.filter((t) => t.id !== id),
          activeThemeId:
            state.activeThemeId === id ? 'light' : state.activeThemeId,
        })),

      setActiveTheme: (id) => set({ activeThemeId: id }),

      getAllThemes: () => [...BUILT_IN_THEMES, ...get().customThemes],

      getActiveTheme: () => {
        const all = [...BUILT_IN_THEMES, ...get().customThemes];
        return all.find((t) => t.id === get().activeThemeId)?.theme ?? light;
      },
    }),
    {
      name: 'bsky-theme-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        customThemes: state.customThemes,
        activeThemeId: state.activeThemeId,
      }),
    },
  ),
);
