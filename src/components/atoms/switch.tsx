import type { ReactNode } from 'react';

type SwitchChildren<TValue extends string | number | symbol> = {
  [K in TValue]?: ReactNode | (() => ReactNode);
} & {
  default?: ReactNode | (() => ReactNode);
};

type SwitchProps<TValue extends string | number | symbol> = {
  value: TValue;
  children: SwitchChildren<TValue>;
};

/**
 * Renders one child conditionally based on the `value` prop.
 *
 * @example
 * <Switch value={state.index}>
 *   {{
 *     0: () => <div>Tab 1</div>,
 *     1: () => <div>Tab 2</div>,
 *     default: () => <div>Error</div>,
 *   }}
 * </Switch>
 */
export default function Switch<TValue extends string | number | symbol>({
  value,
  children,
}: SwitchProps<TValue>): ReactNode {
  const selected = children[value];
  if (selected !== undefined) {
    return <>{typeof selected === 'function' ? selected() : selected}</>;
  }
  if (children.default !== undefined) {
    const def = children.default;
    return <>{typeof def === 'function' ? def() : def}</>;
  }
  return null;
}
