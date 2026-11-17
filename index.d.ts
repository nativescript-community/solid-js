export type AnyNode = any;

/** Mount a Solid tree into a NativeScript host element. Returns a disposer. */
export function render(code: () => any, element: AnyNode): () => void;

/** Create a reactive effect. The compute phase tracks; the apply phase does not. */
export function effect<T>(
  fn: (prev?: T) => T,
  effect: (value: T, prev?: T) => void
): void;

/** Create a memoized computation. */
export function memo<T>(fn: () => T, equal?: boolean): () => T;

/** Create a component instance. */
export function createComponent<P>(Comp: (props: P) => any, props: P): any;

/** Create an element node by tag name, applying any compile-time static props. */
export function createElement(
  tagName: string,
  staticProps?: Record<string, any>
): AnyNode;

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
  skipChildren?: boolean
): AnyNode;

/** Set a single prop on a node. */
export function setProp(node: AnyNode, name: string, value: any, prev?: any): void;

/** Merge props objects similarly to Solid's merge. */
export function mergeProps<T extends object, U extends object>(
  ...sources: Array<Partial<T> | Partial<U> | undefined>
): T & U;

/** Apply a ref (or array of refs) to a node immediately. */
export function applyRef(
  r: ((element: AnyNode) => void) | ((element: AnyNode) => void)[],
  element: AnyNode
): void;

/** Resolve a ref accessor untracked and apply it to a node. */
export function ref(
  fn: () => ((element: AnyNode) => void) | ((element: AnyNode) => void)[],
  element: AnyNode
): void;

export { For, Repeat, Show, Switch, Match, Loading, Reveal, Errored } from 'solid-js';
