import { router, Stack, useGlobalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useSessionStore } from '@/lib/state';

export default function Layout() {
  const searchParams = useGlobalSearchParams();
  const session = useSessionStore((s) => s.session);

  if (!session) {
    router.navigate('/login');
  }

  useEffect(() => {
    if (searchParams.handle === session?.handle) {
      router.navigate('/account/me');
    }
  }, [searchParams, session]);

  return <Stack />;
}
