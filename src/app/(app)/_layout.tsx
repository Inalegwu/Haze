import { Box, Icon, Text } from '@atoms';
import { Link, TouchableOpacity } from '@components';
import { String } from 'effect';
import { Tabs, useRouter } from 'expo-router';
import type { BottomTabHeaderProps } from 'expo-router/build/react-navigation/bottom-tabs';
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
    >
      <Tabs.Screen
        name="feed"
        options={{
          headerShown: true,
          header: (props) => <FeedHeader {...props} />,
        }}
      />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="activity" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

function FeedHeader(props: BottomTabHeaderProps) {
  return (
    <Box
      width="100%"
      alignItems="center"
      flexDirection="row"
      backgroundColor="background"
      height={70}
    >
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        paddingHorizontal="m"
        paddingVertical="l"
      >
        <TouchableOpacity>
          <Icon name="HamburgerMenu" size="l" />
        </TouchableOpacity>
        <Text>{String.capitalize(props.route.name)}</Text>
        <Link href="/search">
          <Icon name="SearchNormal1" />
        </Link>
      </Box>
    </Box>
  );
}
