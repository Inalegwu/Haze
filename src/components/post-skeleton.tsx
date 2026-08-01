import { Box, Skeleton } from '@atoms';

export function PostSkeleton() {
  return (
    <Box
      width="100%"
      borderBottomColor="border"
      alignItems="flex-start"
      justifyContent="space-between"
      paddingVertical="s"
      borderBottomWidth={0.3}
      flexDirection="row"
      gap="3"
      paddingHorizontal="s"
      backgroundColor="background"
    >
      <Skeleton width={35} height={35} borderRadius="full" />
      <Box flex={1} gap="6">
        <Box flexDirection="row" alignItems="center" gap="2">
          <Skeleton width={100} height={12} />
          <Skeleton width={40} height={10} />
        </Box>
        <Box gap="3" paddingTop="2">
          <Skeleton width="95%" height={13} />
          <Skeleton width="80%" height={13} />
        </Box>
        <Box flexDirection="row" gap="m" paddingTop="2">
          <Skeleton width={30} height={12} />
          <Skeleton width={30} height={12} />
          <Skeleton width={30} height={12} />
        </Box>
      </Box>
    </Box>
  );
}
