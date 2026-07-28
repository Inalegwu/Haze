import { Box, Text } from '@atoms';
import { Container } from '@components';
import { useTheme } from '@shopify/restyle';
import { ActivityIndicator } from 'react-native';
import { app } from 'src/api/app';
import { useSessionStore } from '@/lib/state';
import type { Theme } from '@/lib/theme';

export default function Profile() {
  const session = useSessionStore((s) => s.session);
  const theme = useTheme<Theme>();
  const { data, isLoading } = app.sky.profilePosts.useQuery({
    variables: {
      did: session!.did,
    },
  });

  if (isLoading) {
    return (
      <Container
        width="100%"
        flex={1}
        alignItems="center"
        justifyContent="center"
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </Container>
    );
  }

  return (
    <Container>
      {data?.posts.map((post) => (
        <Box
          key={post.cid}
          width="100%"
          borderBottomWidth={0.8}
          borderBottomColor="border"
          paddingHorizontal="s"
          paddingVertical="m"
        >
          <Text fontSize={14}>{post.text}</Text>
        </Box>
      ))}
    </Container>
  );
}
