import app from '@api';
import { Box, Text } from '@atoms';
import { Image, TouchableOpacity } from '@components';
import { useRouter } from 'expo-router';
import Drawer, {
  type DrawerContentComponentProps,
  type DrawerHeaderProps,
} from 'expo-router/drawer';
import { useEffect } from 'react';
import { useSessionStore } from '@/lib/state';

export default function Layout() {
  const router = useRouter();
  const session = useSessionStore((store) => store.session);

  useEffect(() => {
    if (!session) {
      router.navigate('/(auth)/');
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
        <Image source={{ uri: profile.avatar }} />
      </TouchableOpacity>
      <Box flex={1} />
    </Box>
  );
}

function DrawerContent({ navigation }: DrawerContentComponentProps) {
  return (
    <Box width="100%" flex={1}>
      <Text>{JSON.stringify(navigation)}</Text>
    </Box>
  );
}
