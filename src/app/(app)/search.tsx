import { Box, Text } from '@atoms';
import { Container } from '@components';
import SafeAreaView from 'src/components/safe-area-view';

export default function Search() {
  return (
    <Container paddingHorizontal="m">
      <SafeAreaView>
        <Box
          paddingHorizontal="s"
          paddingVertical="m"
          backgroundColor="card"
          borderRadius="m"
          width="100%"
          marginVertical="m"
        >
          <Text fontSize={11} color="textMuted">
            Find People
          </Text>
        </Box>
      </SafeAreaView>
    </Container>
  );
}
