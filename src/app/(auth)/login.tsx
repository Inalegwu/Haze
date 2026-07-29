import app from '@api';
import { Box, Input, Text } from '@atoms';
import { Container, TouchableOpacity } from '@components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '@shopify/restyle';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { useSessionStore } from '@/lib/state';
import type { Theme } from '@/lib/theme';
import { type LoginFormData, LoginSchema } from '@/lib/validations';

export default function Login() {
  const router = useRouter();
  const color = useTheme<Theme>().colors;

  const { mutate: _login, isPending } = app.auth.login.useMutation({
    onSuccess: (data) => {
      router.navigate('/(app)/feed');
      useSessionStore.getState().setSession({
        handle: data.handle!,
        did: data.did!,
      });
    },
    onError: (error) => console.error(error),
  });

  const { control } = useForm<LoginFormData>({
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
        <Controller
          control={control}
          name="identifier"
          render={({
            field: { onBlur, onChange, value },
            fieldState: { error },
          }) => (
            <Box width="100%" alignItems="flex-start">
              <Input
                placeholder="Identifier"
                backgroundColor="card"
                borderColor="border"
                borderWidth={0.8}
                borderRadius="m"
                width="100%"
                onBlur={onBlur}
                onChangeText={onChange}
                paddingHorizontal="m"
                value={value}
              />
              {error && <Text fontSize={11}>{error.message}</Text>}
            </Box>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({
            field: { onBlur, onChange, value },
            fieldState: { error },
          }) => (
            <Box width="100%" alignItems="flex-start">
              <Input
                placeholder="Password"
                backgroundColor="card"
                borderColor="border"
                borderWidth={0.8}
                borderRadius="m"
                width="100%"
                onBlur={onBlur}
                onChangeText={onChange}
                paddingHorizontal="m"
                value={value}
              />
              {error && <Text fontSize={11}>{error.message}</Text>}
            </Box>
          )}
        />
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
          onPress={() =>
            _login({
              identifier: 'disgruntleddev.bsky.social',
              password: 'inalegwu2004',
            })
          }
          disabled={isPending}
        >
          <Text>Login</Text>
          {isPending && (
            <ActivityIndicator size="small" color={color.primary} />
          )}
        </TouchableOpacity>
      </Container>
    </KeyboardAvoidingView>
  );
}
