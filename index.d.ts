export type AnyNode = any;

/** Mount a Solid tree into a NativeScript host element. Returns a disposer. */
export function render(code: () => any, element: AnyNode): () => void;

/** Create a reactive effect. */
export function effect<T>(fn: (prev?: T) => T, init?: T): void;

/** Create a memoized computation. */
export function memo<T>(fn: () => T, equal?: boolean): () => T;

/** Create a component instance. */
export function createComponent<P>(Comp: (props: P) => any, props: P): any;

/** Create an element node by tag name. */
export function createElement(tagName: string): AnyNode;

/** Create a text node. */
export function createTextNode(value: string): AnyNode;

/** Insert a raw node into a parent before an optional anchor. */
export function insertNode(parent: AnyNode, node: AnyNode, anchor?: AnyNode | null): void;

/** Insert reactive content into a parent before an optional marker. */
export function insert(
  parent: AnyNode,
  accessor: any,
  marker?: AnyNode | null,
  initial?: any
): AnyNode;

/** Spread props onto a node. */
export function spread(
  node: AnyNode,
  props: Record<string, any>,
  isSVG?: boolean,
  skipChildren?: boolean
): AnyNode;

/** Set a single prop on a node. */
export function setProp(node: AnyNode, name: string, value: any, prev?: any): void;

/** Merge props objects similarly to Solid's mergeProps. */
export function mergeProps<T extends object, U extends object>(
  ...sources: Array<Partial<T> | Partial<U> | undefined>
): T & U;

/** Optional helper to call a function if provided, returning its result. */
export function use<TArgs, TReturn>(
  fn: ((args: TArgs) => TReturn) | undefined,
  args: TArgs
): TReturn | undefined;
