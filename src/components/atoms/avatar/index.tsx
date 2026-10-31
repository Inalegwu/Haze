import { Avatar as BaseAvatar } from './avatar';

type Props = {
  src: string;
  fallback: string;
};

export default function Avatar(props: Props) {
  return (
    <BaseAvatar.Root>
      <BaseAvatar.Image src={props.src} />
      <BaseAvatar.Fallback delay={600}>{props.fallback}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}
