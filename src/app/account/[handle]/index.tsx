import { Text } from '@atoms';
import { Container } from '@components';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  const params = useLocalSearchParams<{ handle: string }>();

  const handle = params.handle;

  <Container alignItems="center" justifyContent="center">
    <Text>Account</Text>
    <Text>{handle}</Text>
  </Container>;
}
