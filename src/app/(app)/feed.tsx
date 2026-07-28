import { Box, Icon, Text } from '@atoms';
import { Container, ScrollView, TouchableOpacity } from '@components';
import { useTheme } from '@shopify/restyle';
import moment from 'moment';
import { ActivityIndicator, Image } from 'react-native';
import { app } from 'src/api/app';
import type { Theme } from '@/lib/theme';

export default function Feed() {
  const { data, isLoading } = app.sky.timeline.useQuery();

  const theme = useTheme<Theme>();

  if (isLoading) {
    return (
      <Container alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </Container>
    );
  }

  return (
    <Container>
      <ScrollView>
        {data?.posts.map((post) => (
          <Box
            key={post.cid}
            width="100%"
            borderBottomColor="border"
            alignItems="flex-start"
            justifyContent="space-between"
            paddingVertical="s"
            borderBottomWidth={0.3}
            flexDirection="row"
            gap="3"
            paddingHorizontal="s"
          >
            <Image
              src={post.author.avatar}
              alt={post.author.handle}
              style={{ width: 35, height: 35, borderRadius: 9999 }}
            />
            <Box
              width="100%"
              alignItems="flex-start"
              justifyContent="flex-start"
              flexDirection="column"
            >
              <Box
                width="88%"
                gap="6"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text fontSize={13} fontFamily="SFProRoundedBold">
                  {post.author.displayName}
                </Text>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  gap="2"
                >
                  <Text fontSize={10} color="textMuted">
                    {moment(post.createdAt).fromNow()}
                  </Text>
                  <TouchableOpacity>
                    <Icon name="More" variant="Linear" color="text" />
                  </TouchableOpacity>
                </Box>
              </Box>
              <Box width="89%">
                <Text numberOfLines={10} flexWrap="wrap" fontSize={13}>
                  {post.text}
                </Text>
              </Box>
            </Box>
          </Box>
        ))}
      </ScrollView>
    </Container>
  );
}
