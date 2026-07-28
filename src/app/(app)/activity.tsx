import { Box, Text } from '@atoms';
import { ScrollView } from '@components';
import { app } from 'src/api/app';
import SafeAreaView from 'src/components/safe-area-view';

export default function Activity() {
  const { data: notifications } = app.sky.notifications.useQuery();

  return (
    <SafeAreaView paddingHorizontal="m">
      <Box
        width="100%"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Text fontFamily="SFProRoundedHeavy" fontSize={25}>
          Activity
        </Text>
      </Box>
      <ScrollView width="100%" showsVerticalScrollIndicator={false}>
        <Text>{JSON.stringify(notifications)}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
