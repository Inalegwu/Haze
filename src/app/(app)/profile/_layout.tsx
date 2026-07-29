import app from '@api';
import { Box, Icon, Text } from '@atoms';
import { Container, FlatList, TouchableOpacity } from '@components';
import { useTheme } from '@shopify/restyle';
import { router, Slot } from 'expo-router';
import { ActivityIndicator, Image, Linking, StyleSheet } from 'react-native';
import { useSessionStore } from '@/lib/state';
import type { Theme } from '@/lib/theme';
import { extractUrls } from '@/lib/utils';

export default function ProfileLayout() {
  const session = useSessionStore((s) => s.session);
  const theme = useTheme<Theme>();
  const { data: profile, isLoading } = app.profile.myProfile.useQuery({
    variables: {
      did: session?.did!,
    },
  });
  const { mutate: logout } = app.auth.logout.useMutation({
    onSuccess: () => {
      useSessionStore.getState().clearSession();
      router.replace('/(auth)/login');
    },
  });

  if (isLoading || !profile) {
    return (
      <Container alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </Container>
    );
  }

  const urls = extractUrls(profile.description || '');

  return (
    // TODO: animated header
    <Container>
      <Box
        width="100%"
        height={230}
        borderBottomColor="border"
        borderBottomWidth={0.8}
      >
        <Image src={profile.banner} style={StyleSheet.absoluteFill} />
        <Box
          width="100%"
          height="100%"
          flexDirection="column"
          paddingHorizontal="m"
          paddingVertical="xxl"
          style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
        >
          <Box
            width="100%"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-end"
            gap="5"
          >
            <TouchableOpacity onPress={() => logout()}>
              <Icon
                name="LogoutCurve"
                variant="Bold"
                size="5"
                color="textAlt"
              />
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={20}
              onPress={() => router.navigate('/settings')}
            >
              <Icon name="Setting5" color="textAlt" size="5" variant="Bold" />
            </TouchableOpacity>
          </Box>
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            paddingVertical="m"
          >
            <Box height="100%" alignItems="flex-start" justifyContent="center">
              <Box gap="-1">
                <Text fontSize={25} fontFamily="SatoshiBlack" color="textAlt">
                  {profile.displayName}
                </Text>
              </Box>
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
                    {profile.followersCount}
                  </Text>
                  <Text fontSize={10} color="textMuted">
                    Followers
                  </Text>
                </Box>
                <Box alignItems="flex-start" justifyContent="center">
                  <Text fontSize={14} color="textAlt">
                    {profile.postsCount}
                  </Text>
                  <Text fontSize={10} color="textMuted">
                    Posts
                  </Text>
                </Box>
              </Box>
            </Box>
            <Image
              src={profile.avatar}
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
    </Container>
  );
}
