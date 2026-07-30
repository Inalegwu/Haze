import { Box, Icon, Text } from '@atoms';
import { Container, TouchableOpacity } from '@components';
import { router } from 'expo-router';
import SafeAreaView from 'src/components/safe-area-view';

export default function Settings() {
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
          <Text fontSize={24} fontFamily="SatoshiBlack">
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
            </Box>
          </Box>
        </Box>
      </SafeAreaView>
    </Container>
  );
}
