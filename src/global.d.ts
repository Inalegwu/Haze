declare global {
  export type GlobalState = {
    theme: 'dark' | 'light' | 'system';
    toggleTheme: () => void;
  };
}

export {};
