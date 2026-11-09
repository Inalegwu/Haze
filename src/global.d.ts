declare global {
  type Timeline = {
    name: string;
    key: string;
  };

  type GlobalState = {
    theme: 'dark' | 'light' | 'system';
    pinnedTimelines: Set<Timeline>;
    toggleTheme: () => void;
    pinTimeline: (timeline: Timeline) => void;
    unpinTimeline: (key: string) => void;
  };
}

export {};
