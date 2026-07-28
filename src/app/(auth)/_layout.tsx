import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useSessionStore } from '@/lib/state';

export default function Layout() {
  const router = useRouter();
  const session = useSessionStore((store) => store.session);

  useEffect(() => {
    if (session) {
      router.navigate('/(app)/feed');
    }
  }, [router, session]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
