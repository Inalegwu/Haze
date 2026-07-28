import { Box, Text } from '@atoms';
import { Container, TouchableOpacity } from '@components';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useSessionStore } from '@/lib/state';

export default function Page() {
  const router = useRouter();

  const session = useSessionStore((s) => s.session);

  useEffect(() => {
    if (session) {
      router.replace('/feed');
    }
  }, [router, session]);

  return (
    <Container gap="l" padding="m" alignItems="center" justifyContent="center">
      <Box
        width="100%"
        alignItems="flex-start"
        justifyContent="flex-end"
        flex={1}
        paddingVertical="ml"
      >
        <Text fontSize={30} fontFamily="SFProRoundedBold">
          Welcome to Haze
        </Text>
      </Box>
      <TouchableOpacity
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        backgroundColor="text"
        width="100%"
        borderRadius="full"
        padding="s"
        onPress={() => router.navigate('/login')}
      >
        <Text fontFamily="SFProRoundedBold" color="background">
          Get Started
        </Text>
      </TouchableOpacity>
    </Container>
  );
}
