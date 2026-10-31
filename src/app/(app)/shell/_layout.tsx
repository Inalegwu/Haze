import { Box, Icon, TouchableOpacity } from '@atoms';
import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import React from 'react';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="feed" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="notifications" />
      <Tabs.Screen name="chat" />
    </Tabs>
  );
}

function TabBar({ state, navigation }: BottomTabBarProps) {
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
        paddingVertical="xl"
        paddingHorizontal="l"
      >
        {state.routes.map((route, idx) => (
          <React.Fragment key={route.key}>
            <TouchableOpacity
              alignItems="center"
              justifyContent="center"
              hitSlop={20}
              padding="m"
              onPress={() => navigation.navigate(route.name)}
            >
              <Icon
                name={
                  route.name === 'feed'
                    ? 'Home'
                    : route.name === 'chat'
                      ? 'Message2'
                      : route.name === 'notifications'
                        ? 'Notification'
                        : route.name === 'search'
                          ? 'SearchNormal'
                          : 'Menu'
                }
                size="6"
                variant={state.index === idx ? 'Bold' : 'Linear'}
                color={state.index === idx ? 'text' : 'textMuted'}
              />
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}
