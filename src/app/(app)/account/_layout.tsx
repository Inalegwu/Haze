import app from '@api';
import { Box, Icon, Text } from '@atoms';
import { Container, FlatList, Image, TouchableOpacity } from '@components';
import { useTheme } from '@shopify/restyle';
import { router, Slot, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
} from 'react-native';
import type { Theme } from '@/lib/theme';
import { extractUrls, formatNumber } from '@/lib/utils';

export default function Account() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const theme = useTheme<Theme>();
  const { data: profile, isLoading } = app.profile.getProfile.useQuery({
    variables: {
      actor: handle,
    },
  });

  if (isLoading || !profile) {
    return (
      <Container alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </Container>
    );
  }

  const urls = extractUrls(profile.description || '');

  return (
    // TODO: animated header
    <ScrollView>
      <Box
        height={270}
        width="100%"
        borderBottomColor="border"
        borderBottomWidth={0.8}
      >
        <Image
          source={{ uri: profile.banner }}
          style={StyleSheet.absoluteFill}
        />
        <Box
          width="100%"
          height="100%"
          flexDirection="column"
          paddingHorizontal="m"
          paddingVertical="xxl"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <Box
            width="100%"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            paddingBottom="m"
          >
            <TouchableOpacity onPress={() => router.back()} hitSlop={20}>
              <Icon name="ArrowLeft2" color="textAlt" size="5" />
            </TouchableOpacity>
          </Box>
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            paddingVertical="m"
          >
            <Box
              width="80%"
              height="100%"
              alignItems="flex-start"
              justifyContent="center"
            >
              <Text fontSize={23} fontFamily="SatoshiBlack" color="textAlt">
                {profile.displayName}
              </Text>
              <Box width="80%" marginVertical="s">
                <Text numberOfLines={2} fontSize={11} color="textAlt">
                  {profile.description}
                </Text>
              </Box>
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-start"
                gap="xl"
              >
                <Box alignItems="flex-start" justifyContent="center">
                  <Text fontSize={14} color="textAlt">
                    {formatNumber(profile.followersCount)}
                  </Text>
                  <Text fontSize={10} color="textMuted">
                    Followers
                  </Text>
                </Box>
                <Box alignItems="flex-start" justifyContent="center">
                  <Text fontSize={14} color="textAlt">
                    {formatNumber(profile.postsCount)}
                  </Text>
                  <Text fontSize={10} color="textMuted">
                    Posts
                  </Text>
                </Box>
              </Box>
            </Box>
            <Image
              source={{ uri: profile.avatar }}
              width={75}
              height={75}
              style={{ borderRadius: 9999 }}
            />
          </Box>
        </Box>
      </Box>
      <Box
        width="100%"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
        gap="1"
        paddingVertical="s"
        paddingHorizontal="s"
        borderBottomColor="border"
        borderBottomWidth={0.5}
      >
        <Box
          borderRightColor="border"
          borderRightWidth={0.8}
          height="100%"
          paddingHorizontal="1"
        >
          <Text fontSize={12} color="textMuted">
            @{profile.handle}
          </Text>
        </Box>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 4 }}
          data={urls.map((v) => ({ url: v }))}
          renderItem={({ item }) => (
            <TouchableOpacity
              backgroundColor="card"
              paddingHorizontal="m"
              borderRadius="s"
              onPress={() => Linking.openURL(item.url)}
            >
              <Text fontSize={11} color="accent">
                {item.url}
              </Text>
            </TouchableOpacity>
          )}
        />
        {/* <ScrollView
          showsHorizontalScrollIndicator={false}
          height="100%"
          horizontal
          contentContainerStyle={{ gap: 5 }}
        >
          {urls.map((url, idx) => (
            <Box
              backgroundColor="card"
              paddingHorizontal="m"
              borderRadius="s"
              key={idx}
            >
              <Text fontSize={11} color="accent">
                {url}
              </Text>
            </Box>
          ))}
        </ScrollView> */}
      </Box>
      <Slot />
    </ScrollView>
  );
}
