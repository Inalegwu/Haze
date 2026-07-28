import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import TabBar from 'src/components/tab-bar';
import { useSessionStore } from '@/lib/state';

export default function Layout() {
  const router = useRouter();
  const session = useSessionStore((store) => store.session);

  useEffect(() => {
    if (!session) {
      router.navigate('/');
    }
  }, [router, session]);

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    />
  );
}
