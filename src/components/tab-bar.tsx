import { Box, Icon } from '@atoms';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import React from 'react';
import TouchableOpacity from './touchable-opacity';

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  console.log({ routes: state.routes });
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
        {state.routes
          .filter(
            (r) =>
              !['search', 'settings', 'post/[uri]/index', 'compose'].includes(
                r.name,
              ),
          )
          .map((route, idx) => (
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
                      : route.name === 'messages'
                        ? 'Send2'
                        : route.name === 'activity'
                          ? 'Heart'
                          : route.name === 'profile'
                            ? 'Profile'
                            : 'Menu'
                  }
                  size="6"
                  variant="Linear"
                  color={state.index === idx ? 'text' : 'textMuted'}
                />
              </TouchableOpacity>
              {idx === 1 && (
                <TouchableOpacity
                  alignItems="center"
                  justifyContent="center"
                  hitSlop={20}
                  padding="m"
                  onPress={() => navigation.navigate('compose')}
                >
                  <Icon name="MessageAdd1" size="6" />
                </TouchableOpacity>
              )}
            </React.Fragment>
          ))}
      </Box>
    </Box>
  );
}
