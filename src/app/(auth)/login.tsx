import app from '@api';
import { Text } from '@atoms';
import { Container, FormInput, TouchableOpacity } from '@components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '@shopify/restyle';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { useSessionStore } from '@/lib/state';
import type { Theme } from '@/lib/theme';
import { type LoginFormData, LoginSchema } from '@/lib/validations';

export default function Login() {
  const router = useRouter();
  const color = useTheme<Theme>().colors;

  const { mutate, isPending } = app.auth.login.useMutation({
    onSuccess: (data) => {
      useSessionStore.getState().setSession({
        handle: data.handle!,
        did: data.did!,
      });
      router.navigate('/(app)/feed');
    },
    onError: (error) => console.error(error),
  });

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
    mode: 'onChange',
  });

  return (
    <KeyboardAvoidingView style={{ width: '100%', flex: 1 }}>
      <Container
        paddingHorizontal="m"
        alignItems="flex-start"
        justifyContent="center"
        gap="3"
      >
        <Text fontFamily="SatoshiBlack" fontSize={30}>
          Login
        </Text>
        <FormInput
          control={control}
          name="identifier"
          label="ATProto Identifier"
        />
        <FormInput control={control} name="password" label="Password" />
        <TouchableOpacity
          padding="3"
          borderRadius="full"
          width="100%"
          backgroundColor="card"
          borderColor="border"
          borderWidth={0.8}
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap="m"
          activeOpacity={0.8}
          onPress={handleSubmit((data) => mutate(data))}
          disabled={isPending}
        >
          <Text>Login</Text>
          {isPending && <ActivityIndicator size="small" color={color.accent} />}
        </TouchableOpacity>
      </Container>
    </KeyboardAvoidingView>
  );
}
