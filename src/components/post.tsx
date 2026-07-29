import { Box, Icon, Text } from '@atoms';
import type { FeedPost } from '@skymarshal/sdk';
import { router } from 'expo-router';
import moment from 'moment';
import Image from './image';
import { PostEmbed } from './post-embed';
import TouchableOpacity from './touchable-opacity';

type Props = {
  post: FeedPost;
};

export default function Post({ post }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/post/${encodeURIComponent(post.uri)}`)}
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
        source={{ uri: post.author.avatar }}
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
        <Box width="89%" gap="3" paddingBottom="2">
          <Text numberOfLines={10} fontSize={13.7} flexWrap="wrap">
            {post.text}
          </Text>
          <PostEmbed embed={post.embed} />
        </Box>
        <Box width="100%" flexDirection="row" gap="m">
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap="2"
          >
            <Icon name="Heart" />
            <Text color="textMuted">{post.likeCount}</Text>
          </Box>
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap="2"
          >
            <Icon name="Message2" />
            <Text color="textMuted">{post.replyCount}</Text>
          </Box>
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap="2"
          >
            <Icon name="Refresh" />
            <Text color="textMuted">{post.repostCount}</Text>
          </Box>
        </Box>
      </Box>
    </TouchableOpacity>
  );
}
