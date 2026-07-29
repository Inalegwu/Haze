import app from '@api';
import { Box, Icon, Text } from '@atoms';
import { Container, FlatList, Link, TouchableOpacity } from '@components';
import { useTheme } from '@shopify/restyle';
import { useRouter } from 'expo-router';
import {
  Drawer,
  type DrawerContentComponentProps,
  type DrawerHeaderProps,
} from 'expo-router/drawer';
import { ActivityIndicator } from 'react-native';
import SafeAreaView from 'src/components/safe-area-view';
import type { Theme } from '@/lib/theme';

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        header: (props) => <Header {...props} />,
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    />
  );
}

function DrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const theme = useTheme<Theme>();
  const { data: timelines, isLoading } = app.timeline.myTimelines.useQuery();

  if (isLoading || !timelines) {
    return (
      <Container alignItems="center" justifyContent="center">
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </Container>
    );
  }

  const feeds = timelines.filter((t) => t.type === 'feed') || [];

  return (
    <Box
      width="100%"
      height="100%"
      paddingBottom="m"
      backgroundColor="background"
    >
      <SafeAreaView width="100%" height="100%" padding="m">
        <Box
          width="100%"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-end"
          paddingBottom="l"
        >
          <TouchableOpacity
            hitSlop={20}
            onPress={() => props.navigation.closeDrawer()}
          >
            <Icon size="5" name="SidebarLeft" />
          </TouchableOpacity>
        </Box>
        <FlatList
          data={feeds}
          showsVerticalScrollIndicator={false}
          backgroundColor="card"
          borderWidth={0.5}
          borderColor="border"
          borderRadius="m"
          ListHeaderComponent={() => (
            <Box
              width="100%"
              paddingHorizontal="m"
              paddingVertical="s"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              borderBottomWidth={0.6}
              borderBottomColor="border"
            >
              <Text color="textMuted" fontSize={13} fontFamily="SatoshiBold">
                Feeds
              </Text>
            </Box>
          )}
          renderItem={({ item: feed, index: idx }) => (
            <TouchableOpacity
              onPress={() => router.push(`/feed/${feed.uri}`)}
              borderBottomColor="border"
              borderBottomWidth={idx !== feeds.length - 1 ? 0.6 : 0}
              paddingHorizontal="s"
              paddingVertical="s"
              key={feed.id}
            >
              <Text color="text" fontSize={13}>
                {feed.displayName}
              </Text>
            </TouchableOpacity>
          )}
        />
        {/* <ScrollView
          contentContainerStyle={{ gap: 5 }}
          showsVerticalScrollIndicator={false}
        >
          {feeds.length > 0 && (
            <Box gap="2">
              <Text fontSize={16}> Feeds </Text>
              <Box
                borderRadius="m"
                backgroundColor="card"
                borderWidth={0.6}
                borderColor="border"
              >
                {feeds.map(
                  (feed, idx) =>
                    feed.displayName && (
                      <Box
                        borderBottomColor="border"
                        borderBottomWidth={idx !== feeds.length - 1 ? 0.6 : 0}
                        paddingHorizontal="s"
                        paddingVertical="s"
                        key={feed.id}
                      >
                        <Text color="textMuted" fontSize={13}>
                          {feed.displayName}
                        </Text>
                      </Box>
                    ),
                )}
              </Box>
            </Box>
          )}
          {lists.length > 0 && (
            <Box gap="2">
              <Text fontWeight="600" fontSize={16}>
                {' '}
                Lists{' '}
              </Text>
              <Box
                borderRadius="m"
                backgroundColor="card"
                borderWidth={0.6}
                borderColor="border"
              >
                {lists.map((list, idx) => (
                  <Box
                    borderBottomColor="border"
                    borderBottomWidth={idx !== lists.length - 1 ? 0.6 : 0}
                    paddingHorizontal="s"
                    paddingVertical="s"
                    key={list.id}
                  >
                    <Text color="textMuted" fontSize={13}>
                      {String.capitalize(getFeedName(list.value) || '')}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </ScrollView> */}
      </SafeAreaView>
    </Box>
  );
}

function Header(props: DrawerHeaderProps) {
  return (
    <Box
      width="100%"
      alignItems="flex-end"
      flexDirection="row"
      backgroundColor="background"
      paddingTop="l"
    >
      <Box
        flexDirection="row"
        alignItems="flex-end"
        justifyContent="space-between"
        width="100%"
        paddingHorizontal="2"
      >
        <TouchableOpacity
          hitSlop={20}
          padding="m"
          onPress={() => props.navigation.toggleDrawer()}
        >
          <Icon name="SidebarRight" size="5" />
        </TouchableOpacity>
        {/* TODO: app icon */}
        <Link padding="m" href="/search">
          <Icon name="SearchNormal1" size="5" />
        </Link>
      </Box>
    </Box>
  );
}
