import { StatusBar } from '@components';
import { ThemeProvider } from '@shopify/restyle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Effect } from 'effect';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { SkyRuntime } from '@/lib/runtime';
import { BlueskyService } from '@/lib/services/bluesky/service';
import { useGlobalState, useSessionStore } from '@/lib/state';
import { dark, light } from '@/lib/theme';

LogBox.ignoreAllLogs();

export default function Layout() {
  const colorTheme = useGlobalState((state) => state.theme);
  const [booted, setBooted] = useState(false);
  const [fontsLoaded] = useFonts({
    // SFProRoundedBlack: require('../assets/fonts/SF-Pro-Rounded-Black.otf'),
    // SFProRoundedBold: require('../assets/fonts/SF-Pro-Rounded-Bold.otf'),
    // SFProRoundedHeavy: require('../assets/fonts/SF-Pro-Rounded-Heavy.otf'),
    // SFProRoundedLight: require('../assets/fonts/SF-Pro-Rounded-Light.otf'),
    // SFProRoundedMedium: require('../assets/fonts/SF-Pro-Rounded-Medium.otf'),
    // SFProRoundedRegular: require('../assets/fonts/SF-Pro-Rounded-Regular.otf'),
    // SFProRoundedSemiBold: require('../assets/fonts/SF-Pro-Rounded-Semibold.otf'),
    // SFProRoundedThin: require('../assets/fonts/SF-Pro-Rounded-Thin.otf'),
    // SFProRoundedUltraLight: require('../assets/fonts/SF-Pro-Rounded-Ultralight.otf'),
    Satoshi: require('../assets/fonts/Satoshi-Variable.ttf'),
  });

  useEffect(() => {
    SkyRuntime.runPromise(
      Effect.gen(function* () {
        const bsky = yield* BlueskyService;

        const restored = yield* bsky.resumeSession();
        if (restored) {
          useSessionStore.getState().setSession({
            handle: (yield* bsky.currentHandle())!,
            did: (yield* bsky.currentDid())!,
          });
        }
      }),
    ).finally(() => setBooted(true));
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  if (!booted) return null;

  return (
    <ThemeProvider theme={colorTheme === 'dark' ? dark : light}>
      <QueryClientProvider client={new QueryClient({})}>
        <StatusBar
          backgroundColor="background"
          style={colorTheme === 'light' ? 'dark' : 'light'}
        />
        <Slot />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
