import Image from '../image';
import Box from './box';
import Text from './text';

type Props = {
  uri?: string;
  fallback: string;
  alt?: string;
};

export default function Avatar({ uri, fallback }: Props) {
  <Box borderRadius="full" alignItems="center" justifyContent="center">
    <Image
      source={{ uri }}
      width={20}
      height={20}
      style={{ objectFit: 'cover' }}
    />
    <Text>{fallback}</Text>
  </Box>;
}
