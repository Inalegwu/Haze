import { Box, Icon, Text } from '@atoms';
import { Container, TouchableOpacity } from '@components';
import { useRouter } from 'expo-router';
import SafeAreaView from 'src/components/safe-area-view';
import { useGlobalState } from '@/lib/state';

export default function Settings() {
  const router = useRouter();
  const theme = useGlobalState((state) => state.theme);
  const toggleTheme = useGlobalState((state) => state.toggleTheme);

  return (
    <Container>
      <SafeAreaView paddingHorizontal="m">
        <Box
          marginVertical="m"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
          gap="2"
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="ArrowLeft" size="5" />
          </TouchableOpacity>
          <Text fontSize={24} fontWeight="700">
            Settings
          </Text>
        </Box>
        <Box
          width="100%"
          alignItems="flex-start"
          justifyContent="flex-start"
          gap="4"
        >
          <Text fontWeight="500" fontSize={17}>
            Appearance
          </Text>
          <Box
            backgroundColor="card"
            borderWidth={0.6}
            borderColor="border"
            borderRadius="s"
            width="100%"
            padding="s"
          >
            <Box
              flexDirection="row"
              width="100%"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text>Theme</Text>
              <TouchableOpacity
                hitSlop={20}
                backgroundColor="background"
                borderWidth={0.6}
                borderColor="border"
                borderRadius="xs"
                padding="2"
                onPress={toggleTheme}
              >
                <Icon
                  name={
                    theme === 'light'
                      ? 'Moon'
                      : theme === 'dark'
                        ? 'Sun1'
                        : theme === 'system'
                          ? 'Windows'
                          : 'Airplane'
                  }
                  size="4"
                  variant="Bold"
                />
              </TouchableOpacity>
            </Box>
          </Box>
        </Box>
      </SafeAreaView>
    </Container>
  );
}
