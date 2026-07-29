import { Box, Icon, Text } from '@atoms';
import type { PostManager } from '@skymarshal/sdk';
import { router } from 'expo-router';
import { Fragment } from 'react';
import { Pressable, ScrollView } from 'react-native';
import Image from './image';
import { PostEmbed } from './post-embed';

// Derived structurally so it always matches what PostManager.getPostThread
// actually returns — skymarshal exports a same-named but differently-shaped
// `ThreadPost` from its root that does NOT match this.
type ThreadPost = Awaited<ReturnType<PostManager['getPostThread']>>;

const AVATAR_SIZE = { compact: 36, large: 48 } as const;

function flattenAncestors(post: ThreadPost): ThreadPost[] {
  const chain: ThreadPost[] = [];
  let current = post.parent;
  while (current) {
    chain.unshift(current);
    current = current.parent;
  }
  return chain;
}

function goToPost(uri: string) {
  router.push(`/post/${encodeURIComponent(uri)}`);
}

function ThreadRow({
  post,
  size = 'compact',
  showLineAbove,
  showLineBelow,
}: {
  post: ThreadPost;
  size?: 'compact' | 'large';
  showLineAbove?: boolean;
  showLineBelow?: boolean;
}) {
  const avatarSize = AVATAR_SIZE[size];

  return (
    <Pressable onPress={() => goToPost(post.uri)}>
      <Box flexDirection="row" paddingHorizontal="m">
        <Box width={avatarSize} alignItems="center">
          {showLineAbove && (
            <Box width={2} height={8} backgroundColor="border" />
          )}
          <Image
            source={{ uri: post.author.avatar }}
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            }}
          />
          {showLineBelow && (
            <Box width={2} flex={1} backgroundColor="border" minHeight={12} />
          )}
        </Box>
        <Box flex={1} paddingLeft="s" paddingBottom="m">
          <Box flexDirection="row" alignItems="center">
            <Text fontWeight="700">
              {post.author.displayName ?? post.author.handle}
            </Text>
            {/* <Text color="textMuted" marginLeft="xs">
              @{post.author.handle}
            </Text> */}
          </Box>
          <Text fontSize={13.5}>{post.text}</Text>
          {post.embed != null && (
            <Box marginTop="s">
              <PostEmbed embed={post.embed} />
            </Box>
          )}
        </Box>
      </Box>
    </Pressable>
  );
}

function FocalPost({ post }: { post: ThreadPost; hasReplies: boolean }) {
  return (
    <Box paddingHorizontal="m" paddingVertical="l">
      <Box width="100%" gap="3" flexDirection="row" alignItems="center">
        <Image
          source={{ uri: post.author.avatar }}
          style={{ width: 38, height: 38, borderRadius: 24 }}
        />
        <Text fontWeight="700">
          {post.author.displayName ?? post.author.handle}
        </Text>
      </Box>
      <Text marginTop="s" fontSize={13.5}>
        {post.text}
      </Text>
      {post.embed !== null && (
        <Box marginTop="s">
          <PostEmbed embed={post.embed} />
        </Box>
      )}
      <Box
        borderTopColor="border"
        borderBottomColor="border"
        borderTopWidth={0.6}
        borderBottomWidth={0.6}
        paddingVertical="2"
        flexDirection="row"
        marginTop="s"
        gap="m"
      >
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
      {/* {hasReplies && (
        <Box width={2} height={16} marginLeft="5" backgroundColor="border" />
      )} */}
    </Box>
  );
}

function ReplyBranch({
  replies,
  depth = 0,
}: {
  replies: ThreadPost[];
  depth?: number;
}) {
  return (
    <>
      {replies.map((reply) => {
        const hasNested = !!reply.replies?.length;
        return (
          <Box key={reply.uri} marginLeft="5">
            <ThreadRow post={reply} size="compact" showLineBelow={hasNested} />
            {hasNested && (
              <ReplyBranch replies={reply.replies!} depth={depth + 1} />
            )}
          </Box>
        );
      })}
    </>
  );
}

type Props = {
  thread: ThreadPost;
};

export default function PostThread({ thread }: Props) {
  const ancestors = flattenAncestors(thread);
  const hasReplies = !!thread.replies?.length;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {ancestors.map((ancestor, i) => (
        <Fragment key={ancestor.uri}>
          <ThreadRow
            post={ancestor}
            size="compact"
            showLineAbove={i > 0}
            showLineBelow
          />
        </Fragment>
      ))}
      <FocalPost post={thread} hasReplies={hasReplies} />
      {hasReplies && <ReplyBranch replies={thread.replies!} />}
    </ScrollView>
  );
}
