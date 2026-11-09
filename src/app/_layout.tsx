import { StatusBar } from '@atoms';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@shopify/restyle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Effect } from 'effect';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SkyRuntime } from '@/lib/runtime';
import { BlueskyService } from '@/lib/services/bluesky/service';
import { useGlobalState, useSessionStore } from '@/lib/state';
import { dark, light } from '@/lib/theme';

LogBox.ignoreAllLogs();

export default function Layout() {
  const activeTheme = useGlobalState((s) => s.theme);
  const [booted, setBooted] = useState(false);
  const [fontsLoaded] = useFonts({
    FontBlack: require('../assets/fonts/Onest-Black.ttf'),
    FontBold: require('../assets/fonts/Onest-Bold.ttf'),
    FontExtraBold: require('../assets/fonts/Onest-ExtraBold.ttf'),
    FontExtraLight: require('../assets/fonts/Onest-ExtraLight.ttf'),
    FontLight: require('../assets/fonts/Onest-Light.ttf'),
    FontMedium: require('../assets/fonts/Onest-Medium.ttf'),
    FontRegular: require('../assets/fonts/Onest-Regular.ttf'),
    FontSemiBold: require('../assets/fonts/Onest-SemiBold.ttf'),
    FontThin: require('../assets/fonts/Onest-Thin.ttf'),
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider theme={activeTheme === 'light' ? light : dark}>
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
              style={activeTheme === 'dark' ? 'light' : 'dark'}
            />
            <Stack />
          </QueryClientProvider>
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
