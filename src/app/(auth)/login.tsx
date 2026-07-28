import { Text } from '@atoms';
import { Container, TouchableOpacity } from '@components';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { app } from 'src/api/app';

export default function Login() {
  const router = useRouter();

  const { mutate: login, isPending } = app.sky.login.useMutation({
    onSuccess: () => router.navigate('/(app)/feed'),
    onError: (error) => console.error(error),
  });

  return (
    <Container>
      <Text>Login</Text>
      <TouchableOpacity
        padding="3"
        borderRadius="full"
        backgroundColor="card"
        width="100%"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap="m"
        onPress={() =>
          login({
            identifier: 'disgruntleddev.bsky.social',
            password: 'inalegwu2004',
          })
        }
      >
        <Text>Login</Text>
        {isPending && <ActivityIndicator size="small" />}
      </TouchableOpacity>
    </Container>
  );
}
