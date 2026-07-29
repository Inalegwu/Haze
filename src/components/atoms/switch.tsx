import type { ReactNode } from 'react';

type Renderable = ReactNode | (() => ReactNode);

type SwitchChildren<TValue extends string | number | symbol> = {
  [K in TValue]?: Renderable;
} & {
  default?: Renderable;
};

type SwitchCase = {
  when: boolean;
  render: Renderable;
};

type SwitchByValueProps<TValue extends string | number | symbol> = {
  value: TValue;
  children: SwitchChildren<TValue>;
  cases?: never;
};

type SwitchByCaseProps = {
  cases: SwitchCase[];
  default?: Renderable;
  value?: never;
  children?: never;
};

type SwitchProps<TValue extends string | number | symbol> =
  | SwitchByValueProps<TValue>
  | SwitchByCaseProps;

function renderNode(node: Renderable | undefined): ReactNode {
  if (node === undefined) return null;
  return typeof node === 'function' ? (node as () => ReactNode)() : node;
}

/**
 * Renders one child conditionally, either by matching a `value` against
 * keyed children, or by evaluating an ordered list of boolean `cases`
 * (first truthy `when` wins — like a `switch (true)`).
 *
 * @example Value-based
 * <Switch value={state.index}>
 *   {{
 *     0: () => <div>Tab 1</div>,
 *     1: () => <div>Tab 2</div>,
 *     default: () => <div>Error</div>,
 *   }}
 * </Switch>
 *
 * @example Boolean-case-based
 * <Switch
 *   cases={[
 *     { when: user.isAdmin, render: () => <AdminPanel /> },
 *     { when: user.isGuest, render: () => <GuestBanner /> },
 *   ]}
 *   default={() => <RegularUser />}
 * />
 */
export default function Switch<
  TValue extends string | number | symbol = string,
>(props: SwitchProps<TValue>): ReactNode {
  if ('cases' in props && props.cases) {
    const match = props.cases.find((c) => c.when);
    return renderNode(match ? match.render : props.default);
  }

  const { value, children } = props as SwitchByValueProps<TValue>;
  const selected = children[value];
  return renderNode(selected !== undefined ? selected : children.default);
}
