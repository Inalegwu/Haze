import { Box, Icon } from '@atoms';
import { Container, PostThread, TouchableOpacity } from '@components';
import { useTheme } from '@shopify/restyle';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { app } from 'src/api/app';
import type { Theme } from '@/lib/theme';

export default function Page() {
  const color = useTheme<Theme>().colors;
  const { uri } = useLocalSearchParams<{ uri: string }>();

  const { data: thread, isLoading } = app.sky.getPostThread.useQuery({
    variables: {
      uri,
    },
  });

  if (isLoading || !thread) {
    return (
      <Container alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color={color.primary} />
      </Container>
    );
  }

  return (
    <Container backgroundColor="background" flex={1}>
      <Box
        width="100%"
        paddingTop="xxxl"
        paddingHorizontal="m"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <TouchableOpacity hitSlop={20} onPress={() => router.back()}>
          <Icon name="ArrowLeft" size="6" />
        </TouchableOpacity>
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-end"
          gap="4"
        >
          <TouchableOpacity>
            <Icon name="Notification" size="6" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="MoreCircle" size="6" />
          </TouchableOpacity>
        </Box>
      </Box>
      <PostThread thread={thread} />
    </Container>
  );
}
