import app from '@api';
import { Avatar, Box, Icon, Text, TouchableOpacity } from '@atoms';
import type { Profile } from '@skymarshal/sdk';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import Drawer, {
  type DrawerContentComponentProps,
  type DrawerHeaderProps,
} from 'expo-router/drawer';
import { useEffect } from 'react';
import { useGlobalState, useSessionStore } from '@/lib/state';
import { formatNumber, getInitials } from '@/lib/utils';

export default function Layout() {
  const router = useRouter();
  const session = useSessionStore((store) => store.session);

  useEffect(() => {
    if (!session) {
      router.navigate('/(auth)/login');
    }
  }, [router, session]);

  return (
    <Drawer
      initialRouteName="feed"
      screenOptions={{
        headerShown: true,
        header: (props) => <Header {...props} />,
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="shell" />
    </Drawer>
  );
}

function Header({ navigation }: DrawerHeaderProps) {
  const session = useSessionStore((s) => s.session);

  const { data: profile } = app.profile.getProfile.useQuery({
    variables: {
      actor: session!.did,
    },
  });

  if (!profile)
    throw new Error(`Error fetching profile with handle ${session!.handle}`);

  return (
    <Box width="100%" alignItems="center" justifyContent="space-between">
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Avatar
          src={profile.avatar ?? ''}
          fallback={getInitials(profile.displayName ?? 'Unknown Initials')}
        />
      </TouchableOpacity>
      <Box flex={1} />
      <TouchableOpacity>
        <Icon name="Setting3" />
      </TouchableOpacity>
    </Box>
  );
}

function DrawerContent({ navigation, state }: DrawerContentComponentProps) {
  const qc = useQueryClient();
  const theme = useGlobalState((s) => s.theme);
  const toggleTheme = useGlobalState((s) => s.toggleTheme);

  const profile = qc.getQueryData(['profile.getProfile']) as Profile;

  return (
    <Box width="100%" flexDirection="column" flex={1}>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Avatar
            src={profile.avatar ?? ''}
            fallback={getInitials(profile.displayName ?? 'Unknown Initials')}
          />
          <Box flexDirection="column" alignItems="flex-start">
            <Text>{profile.displayName}</Text>
            <Text fontSize={12} color="textMuted">
              @{profile.handle}
            </Text>
          </Box>
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
            >
              <Text>{formatNumber(profile.followsCount)}</Text>
              <Text>Following</Text>
            </Box>
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
            >
              <Text>{formatNumber(profile.followersCount)}</Text>
              <Text>Follower{profile.followersCount > 1 ? 's' : ''}</Text>
            </Box>
          </Box>
        </Box>
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-start"
        >
          <TouchableOpacity onPress={toggleTheme}>
            <Icon
              name={
                theme === 'light'
                  ? 'Moon'
                  : theme === 'dark'
                    ? 'Sun'
                    : theme === 'system'
                      ? 'Devices'
                      : 'Sun'
              }
            />
          </TouchableOpacity>
        </Box>
      </Box>
      <Box width="100%" flex={1}>
        {state.routes.map((route) => (
          <TouchableOpacity
            onPress={() => navigation.navigate(route.name)}
            key={route.key}
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            width="100%"
          >
            <Text>{route.name}</Text>
          </TouchableOpacity>
        ))}
      </Box>
    </Box>
  );
}
