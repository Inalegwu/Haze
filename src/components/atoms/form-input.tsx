import { Box, Icon, Input, Switch, Text } from '@atoms';
import { useState } from 'react';
import {
  type Control,
  Controller,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import TouchableOpacity from './touchable-opacity';

type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'file-picker';
  disabled?: boolean;
};

export default function FormInput<T extends FieldValues>({
  control,
  label,
  name,
  type = 'text',
  placeholder,
  disabled,
}: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Box flexDirection="column" alignItems="flex-start" width="100%">
          <Box
            width="100%"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text variant="formLabel">{label}</Text>
            {fieldState?.error && (
              <Text variant="formError">{fieldState.error.message}</Text>
            )}
          </Box>
          <Switch value={type}>
            {{
              text: () => (
                <TextInput
                  field={field}
                  disabled={disabled}
                  placeholder={placeholder}
                />
              ),
              password: () => (
                <PasswordInput
                  field={field}
                  disabled={disabled}
                  placeholder={placeholder}
                />
              ),
              default: () => null,
            }}
          </Switch>
        </Box>
      )}
    />
  );
}

type InputProps<T extends FieldValues> = Omit<
  FormInputProps<T>,
  'type' | 'control' | 'label' | 'name'
> & {
  field: ControllerRenderProps<T, Path<T>>;
};

function TextInput<T extends FieldValues>({
  field,
  placeholder,
}: InputProps<T>) {
  return (
    <Input
      placeholder={placeholder}
      value={field.value}
      onChangeText={field.onChange}
      onBlur={field.onBlur}
    />
  );
}

function PasswordInput<T extends FieldValues>({
  field,
  disabled,
  placeholder,
}: InputProps<T>) {
  const [isVisible, setVisible] = useState(false);

  return (
    <Box flexDirection="row" alignItems="center">
      <Input
        onChange={field.onChange}
        onBlur={field.onBlur}
        placeholder={placeholder}
      />
      <TouchableOpacity
        disabled={disabled}
        onPress={() => setVisible((v) => !v)}
      >
        <Icon name={isVisible ? 'EyeSlash' : 'Eye'} variant="Bold" />
      </TouchableOpacity>
    </Box>
  );
}
