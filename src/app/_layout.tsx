import { StatusBar } from '@components';
import { ThemeProvider } from '@shopify/restyle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Effect } from 'effect';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
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
    SatoshiMedium: require('../assets/fonts/Satoshi-Medium.otf'),
    SatoshiRegular: require('../assets/fonts/Satoshi-Regular.otf'),
    SatoshiLight: require('../assets/fonts/Satoshi-Light.otf'),
    SatoshiBold: require('../assets/fonts/Satoshi-Bold.otf'),
    SatoshiBlack: require('../assets/fonts/Satoshi-Black.otf'),
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
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: {
              queries: {
                staleTime: 30 * 30,
              },
            },
          })
        }
      >
        <StatusBar
          backgroundColor="background"
          style={colorTheme === 'light' ? 'dark' : 'light'}
        />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
          <Stack.Screen name="compose" options={{ presentation: 'modal' }} />
        </Stack>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
