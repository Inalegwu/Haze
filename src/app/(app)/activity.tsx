import { Box, Text } from '@atoms';
import { Container, FlatList } from '@components';
import { useTheme } from '@shopify/restyle';
import moment from 'moment';
import { ActivityIndicator, Image } from 'react-native';
import { app } from 'src/api/app';
import SafeAreaView from 'src/components/safe-area-view';
import type { Theme } from '@/lib/theme';

export default function Activity() {
  const color = useTheme<Theme>().colors;
  const { data: notifications, isLoading } = app.sky.notifications.useQuery();

  if (isLoading || !notifications) {
    return (
      <Container alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color={color.primary} />
      </Container>
    );
  }

  return (
    <SafeAreaView backgroundColor="background">
      <Box
        width="100%"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
        paddingHorizontal="m"
      >
        <Text fontFamily="SFProRoundedHeavy" fontSize={25}>
          Activity
        </Text>
      </Box>
      <FlatList
        data={notifications}
        backgroundColor="background"
        height="100%"
        renderItem={({ item: notification }) => (
          <Box
            width="100%"
            paddingVertical="m"
            paddingHorizontal="m"
            borderBottomWidth={0.8}
            borderBottomColor="border"
            key={notification.groupId}
          >
            <Box
              width="100%"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                gap="1"
              >
                <Text color="textMuted" fontSize={12}>
                  {notification.count} Notifications
                </Text>
                <Text color="textMuted" fontSize={12}>
                  {moment(notification.endTime).from(notification.startTime)}
                </Text>
              </Box>
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                {notification.items.slice(0, 4).map((not) => (
                  <Image
                    style={{ width: 14, height: 14, borderRadius: 9999 }}
                    src={not.author.avatar}
                    alt={not.author.displayName}
                    key={not.cid}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        )}
      />
    </SafeAreaView>
  );
}
