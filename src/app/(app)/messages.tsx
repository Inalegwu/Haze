import app from '@api';
import { Box, Text } from '@atoms';
import { Container } from '@components';
import { useTheme } from '@shopify/restyle';
import { ActivityIndicator } from 'react-native';
import SafeAreaView from 'src/components/safe-area-view';
import type { Theme } from '@/lib/theme';

export default function Messages() {
  const colors = useTheme<Theme>().colors;
  const { data: conversations, isLoading } =
    app.chat.getConversations.useQuery();

  if (isLoading) {
    return (
      <Container
        width="100%"
        flex={1}
        alignItems="center"
        justifyContent="center"
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </Container>
    );
  }

  return (
    <SafeAreaView flex={1} backgroundColor="background" paddingHorizontal="m">
      <Box
        width="100%"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Text fontSize={25}>Messages</Text>
      </Box>
      <Container flex={1} alignItems="center" justifyContent="center">
        <Text>{JSON.stringify({ conversations })}</Text>
        {conversations?.length === 0 && (
          <Text fontSize={20}>No conversations yet</Text>
        )}
      </Container>
    </SafeAreaView>
  );
}
