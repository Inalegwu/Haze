import { Container, Post, ScrollView } from '@components';
import { useTheme } from '@shopify/restyle';
import { ActivityIndicator } from 'react-native';
import { app } from 'src/api/app';
import type { Theme } from '@/lib/theme';

export default function Feed() {
  const { data, isLoading } = app.sky.timeline.useQuery();

  const theme = useTheme<Theme>();

  if (isLoading) {
    return (
      <Container alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </Container>
    );
  }

  return (
    <Container>
      <ScrollView>
        {data?.posts.map((post) => (
          <Post post={post} key={post.cid} />
        ))}
      </ScrollView>
    </Container>
  );
}
