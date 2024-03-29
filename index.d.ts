import { Style, ViewBase } from "@nativescript/core";
import {
  Document,
  DOMEvent,
  HTMLElementTagNameMap,
  Node,
  NSComponentsMap,
  NSCustomComponentsMap,
  PseudoElementsMap,
} from "dominative";
import { JSX as SolidJSX } from "solid-js";

/**
 * This is the app entry point. Provide a top-level component function and 
 * an element to mount to. It is recommended this element be empty: while render 
 * will just append children, the returned dispose function will remove all children.
 * For example:
 ```tsx
 import { render } from "@nativescript-community/solid-js";
 import { document } from "dominative";
 render(() => <App />, document.body);
 ```
 * The root node can be any NativeScript node. By default `document.body` is a `Frame` element. However
 * you can do something like below to render something different as root element.
 ```tsx
 document.body.appendChild(document.createElement("ContentView"));
 render(() => <App />, document.body.firstElementChild);
 ```
 * Read more about the render function here:
 * @link https://www.solidjs.com/docs/latest#render
 */
export function render(app: () => JSX.Element, root: Node): void;

export type Filter<
  Set,
  Needle extends string
> = Set extends `${Needle}${infer _X}` ? never : Set;

export type MapNativeViewEvents<T, C> = {
  [K in T as `on:${K}`]: (event: DOMEvent<C>) => void;
};

export type MapPseudoElementEvents<T> = {
  [K in T as `on:${K}`]: (event: {
    view?: ViewBase;
    index?: number;
    item?: any;
    data?: any;
  }) => void;
};

type NSComponentEventsMap = {
  [K in keyof NSComponentsMap]: MapNativeViewEvents<
    HTMLElementTagNameMap[K]["eventNames"],
    HTMLElementTagNameMap[K]
  >;
} & {
  [K in keyof NSCustomComponentsMap]: MapNativeViewEvents<
    NSCustomComponentsMap[K]["eventNames"],
    NSCustomComponentsMap[K]
  >;
} & {
  ItemTemplate: MapPseudoElementEvents<"createView" | "itemLoading">;
} & {
  [K in keyof Omit<PseudoElementsMap, "ItemTemplate">]: {};
};

export type IgnoredKeys =
  | "cssType"
  | "requestLayout"
  | "layoutNativeView"
  | "goBack"
  | "replacePage"
  | "firstElementChild"
  | "lastElementChild"
  | "children"
  | "childNodes"
  | "append"
  | "insertBefore"
  | "replaceChild"
  | "appendChild"
  | "textContent"
  | "removeChild"
  | "childElementCount"
  | "innerHTML"
  | "outerHTML"
  | "insertBefore"
  | "setAttribute"
  | "getAttribute"
  | "removeAttribute"
  | "removeAttributeNS"
  | "setAttributeNS"
  | "namespaceURI"
  | "dispatchEvent"
  | "getAttributeNS"
  | "localName"
  | "nodeName"
  | "tagName"
  | "attributes"
  | "hasChildNodes"
  | "firstChild"
  | "lastChild"
  | "replaceWith"
  | "cloneNode"
  | "remove"
  | "parentNode"
  | "height"
  | "width"
  | "appendData";

export type PickedNSComponentKeys<T> = Omit<
  T,
  Filter<
    keyof T,
    | "_"
    | "set"
    | "get"
    | "has"
    | "change"
    | "each"
    | "can"
    | "create"
    | "send"
    | "perform"
    | "go"
    | "on"
  >
>;
type OverrideProperties = {
  style: Partial<
    | Style
    | {
        color: string;
        width: number | string;
        height: number | string;
        backgroundColor: string;
        borderTopColor: string;
        borderRightColor: string;
        borderBottomColor: string;
        borderLeftColor: string;
        boxShadow: string;
        textShadow: string;
      }
  >;
  height: string | number;
  width: string | number;
  class: string;
};

export type DefineNSComponent<T, E> = Partial<
  Omit<
    T,
    IgnoredKeys | keyof OverrideProperties | keyof PickedNSComponentKeys<T>
  > &
    E
>;

declare global {
  var document: Document;
}

declare global {
  namespace JSX {
    function mapElementTag<K extends keyof NSDefaultComponents>(
      tag: K
    ): NSDefaultComponents[K];

    function createElement<
      Element extends NSDefaultComponents,
      Key extends keyof NSDefaultComponents
    >(element: Key | undefined | null, attrs: Element[Key]): Element[Key];

    function createElement<
      Element extends NSDefaultComponents,
      Key extends keyof NSDefaultComponents,
      T
    >(
      element: Key | undefined | null,
      attrsEnhancers: T,
      attrs: Element[Key] & T
    ): Element[Key];

    type Element = SolidJSX.Element;
    interface ArrayElement extends Array<Element> {}
    interface FunctionElement {
      (): Element;
    }
    interface ElementClass {
      // empty, libs can define requirements downstream
    }
    interface ElementAttributesProperty {
      // empty, libs can define requirements downstream
    }
    interface ElementChildrenAttribute {
      children: {};
    }

    interface IntrinsicAttributes {
      ref?: unknown | ((e: unknown) => void);
    }

    type Accessor<T> = () => T;
    interface Directives {}
    interface DirectiveFunctions {
      [x: string]: (el: Element, accessor: Accessor<any>) => void;
    }
    interface ExplicitProperties {}
    interface ExplicitAttributes {}
    interface CustomEvents {}
    interface CustomCaptureEvents {}

    type JSXElementAttributes<K> = SolidJSX.CustomAttributes<
      NSComponentsMap[K]
    > &
      Partial<
        DefineNSComponent<HTMLElementTagNameMap[K], NSComponentEventsMap[K]> &
          OverrideProperties & {
            children: Element;
          }
      >;

    type NSDefaultComponents = {
      [K in keyof HTMLElementTagNameMap as `${Lowercase<K>}`]: JSXElementAttributes<K>;
    };
    interface IntrinsicElements extends NSDefaultComponents {}
  }
}
