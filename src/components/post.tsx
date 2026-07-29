import { Box, Icon, Text } from '@atoms';
import type { FeedPost } from '@skymarshal/sdk';
import { router } from 'expo-router';
import moment from 'moment';
import type { ReplyParentPost } from '@/lib/utils';
import Image from './image';
import { PostEmbed } from './post-embed';
import TouchableOpacity from './touchable-opacity';

type Props = {
  post: FeedPost & { replyParent?: ReplyParentPost };
};

export default function Post({ post }: Props) {
  return (
    <Box width="100%">
      {post.replyParent && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            router.push(`/post/${encodeURIComponent(post.replyParent!.uri)}`)
          }
          flexDirection="row"
          alignItems="flex-start"
          gap="3"
          paddingHorizontal="s"
          paddingTop="s"
        >
          <Box alignItems="center" width={35}>
            <Image
              source={{ uri: post.replyParent.author.avatar }}
              alt={post.replyParent.author.handle}
              style={{ width: 20, height: 20, borderRadius: 9999 }}
            />
            <Box
              width={2}
              flexGrow={1}
              backgroundColor="border"
              marginTop="2"
            />
          </Box>
          <Box flex={1} paddingBottom="2">
            <Text fontSize={11} color="textMuted">
              Replying to @{post.replyParent.author.handle}
            </Text>
            <Text fontSize={12.5} color="textMuted">
              {post.replyParent.text}
            </Text>
          </Box>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        activeOpacity={1}
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
            width="100%"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text
              fontFamily="SatoshiBold"
              numberOfLines={1}
              fontSize={13}
              fontWeight="600"
            >
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
              <Text color="textMuted" fontSize={12}>
                {post.likeCount}
              </Text>
            </Box>
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              gap="2"
            >
              <Icon name="Message2" />
              <Text color="textMuted" fontSize={12}>
                {post.replyCount}
              </Text>
            </Box>
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              gap="2"
            >
              <Icon name="Refresh" />
              <Text color="textMuted" fontSize={12}>
                {post.repostCount}
              </Text>
            </Box>
          </Box>
        </Box>
      </TouchableOpacity>
    </Box>
  );
}
