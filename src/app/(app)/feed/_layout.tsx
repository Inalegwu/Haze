import { Box, Icon, Text } from '@atoms';
import { Link, ScrollView, TouchableOpacity } from '@components';
import { useTheme } from '@shopify/restyle';
import { String } from 'effect';
import {
  Drawer,
  type DrawerContentComponentProps,
  type DrawerHeaderProps,
} from 'expo-router/drawer';
import { ActivityIndicator } from 'react-native';
import { app } from 'src/api/app';
import SafeAreaView from 'src/components/safe-area-view';
import type { Theme } from '@/lib/theme';
import { getFeedName } from '@/lib/utils';

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
  const theme = useTheme<Theme>();
  const { data: timelines, isLoading } = app.sky.myTimelines.useQuery();

  if (isLoading || !timelines) {
    return (
      <Box alignItems="center" justifyContent="center">
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </Box>
    );
  }

  const feeds = timelines.filter((t) => t.type === 'feed') || [];
  const lists = timelines?.filter((t) => t.type === 'list') || [];

  return (
    <Box width="100%" height="100%" backgroundColor="background">
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
        <ScrollView
          contentContainerStyle={{ gap: 5 }}
          showsVerticalScrollIndicator={false}
        >
          {feeds.length > 0 && (
            <Box gap="2">
              <Text fontFamily="SFProRoundedBold" fontSize={16}>
                {' '}
                Feeds{' '}
              </Text>
              <Box
                borderRadius="m"
                backgroundColor="card"
                borderWidth={0.6}
                borderColor="border"
              >
                {feeds.map((feed, idx) => (
                  <Box
                    borderBottomColor="border"
                    borderBottomWidth={idx !== feeds.length - 1 ? 0.6 : 0}
                    paddingHorizontal="s"
                    paddingVertical="s"
                    key={feed.id}
                  >
                    <Text color="textMuted" fontSize={13}>
                      {String.capitalize(getFeedName(feed.value) || '')}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          {lists.length > 0 && (
            <Box gap="2">
              <Text fontFamily="SFProRoundedBold" fontSize={16}>
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
        </ScrollView>
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
