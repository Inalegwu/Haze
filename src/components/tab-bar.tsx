import { Box, Icon } from '@atoms';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import TouchableOpacity from './touchable-opacity';

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <Box
      width="100%"
      alignItems="center"
      justifyContent="space-between"
      flexDirection="row"
      gap="3"
      backgroundColor="background"
      height={60}
    >
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        paddingVertical="xxl"
        paddingHorizontal="l"
      >
        {state.routes.map((route, idx) => (
          <TouchableOpacity
            alignItems="center"
            justifyContent="center"
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
          >
            <Icon
              name={
                route.name === 'feed'
                  ? 'Home'
                  : route.name === 'search'
                    ? 'SearchNormal1'
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
        ))}
      </Box>
    </Box>
  );
}
