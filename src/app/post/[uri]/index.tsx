import app from '@api';
import { Container, PostThread } from '@components';
import { useTheme } from '@shopify/restyle';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import type { Theme } from '@/lib/theme';

export default function Page() {
  const color = useTheme<Theme>().colors;
  const { uri } = useLocalSearchParams<{ uri: string }>();

  const { data: thread, isLoading } = app.post.getPostThread.useQuery({
    variables: {
      uri,
    },
  });

  if (isLoading || !thread) {
    return (
      <Container alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color={color.accent} />
      </Container>
    );
  }

  return (
    <Container>
      <PostThread thread={thread} />
    </Container>
  );
}
