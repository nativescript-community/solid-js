# NativeScript SolidJS

[Try on StackBlitz](https://stackblitz.com/edit/nativescript-dominative-solid?file=app/app.jsx)

---

## Installation

Via npm:

```shell
npm install @nativescript-community/solid-js dominative undom-ng solid-js @solidjs/universal @babel/preset-typescript babel-preset-solid
```

**Note:** `dominative`, `undom-ng`, `solid-js`, `@solidjs/universal` are peer dependencies, you have to install them manually. As the benefit for using peer dependencies, you'll be able to upgrade these dependencies directly from upstream, no need to wait for an update with `@nativescript-community/solid-js`

| `@nativescript-community/solid-js` | `solid-js`  |
| ---------------------------------- | ----------- |
| `2.x`                              | `2.x`       |
| `0.1.x`                            | `1.8`–`1.9` |

---

## Build setup

The JSX compiler has to emit calls against this renderer rather than the DOM one, so whichever bundler you use needs these compiler options:

```js
{
  generate: 'universal',
  hydratable: false,
  moduleName: '@nativescript-community/solid-js',
}
```

With webpack, `nativescript.webpack.js` in this package wires that up (plus the `@NativeClass` transform) — register it from your project's `webpack.config.js`. With Vite, pass them to `@solidjs/vite-plugin` as its `solid` option.

Either way, pin `solid-js`, `@solidjs/signals`, and `@solidjs/universal` to their browser bundles. Solid 2's exports map resolves the `node` condition to the SSR build, which renders once and never updates.

---

## Usage

```jsx
import { Application } from "@nativescript/core"
import { render } from "@nativescript-community/solid-js"
import { createSignal } from "solid-js"

document.body.actionBarHidden = false

const App = () => {
	const [count, setCount] = createSignal(0)
	const increment = () => {
		setCount(c => c + 1)
	}
	return <>
	<actionbar title="Hello, SolidJS!"></actionbar>
	<stacklayout>
		<label>You have taapped {count()} time(s)</label>
		<button class="-primary" on:tap={increment}>Tap me!</button>
	</stacklayout>
	</>
}

const create = () => {
	render(App, document.body)
	return document
}

Application.run({ create })

```

---

## Upgrading from Solid 1.x

Solid 2 is a rewrite; [its cheatsheet](https://github.com/solidjs/solid/blob/main/packages/solid/CHEATSHEET.md) and [migration guide](https://github.com/solidjs/solid/blob/main/documentation/solid-2.0/MIGRATION.md) cover the reactive changes (two-argument `createEffect`, draft-first store setters, deferred reads until flush). What changes for a NativeScript app specifically:

- `solid-js/store` merged into `solid-js`, and `solid-js/universal` moved to `@solidjs/universal` — install it alongside `solid-js`.
- Control flow re-exported from this package is now `For`, `Repeat`, `Show`, `Switch`, `Match`, `Loading`, `Reveal`, `Errored`. `Suspense` → `Loading`, `SuspenseList` → `Reveal`, `ErrorBoundary` → `Errored`, and `<Index>` → `<For keyed={false}>`.
- `onMount` is gone; use `onSettled`, which takes the teardown as its return value.
- `use:` directives are gone (this package no longer exports `use`). A directive is now a ref: `ref={myDirective(options)}`, and refs compose as arrays.
- `<For>` callback arguments follow the keying mode. The default is keyed by identity, giving `(item, indexAccessor)`; `keyed={false}` gives `(itemAccessor, index)`.
- Event handlers keep the `on:` / `oncapture:` prefixes described below. Solid 2's DOM renderer dropped them, but NativeScript event names are case sensitive and don't bubble, so they stay the binding for this renderer.
- `solid-refresh` has no Solid 2 release that matches this range, so the webpack config no longer registers it. NativeScript's own HMR still replaces modules.

---

## Caveats

### Event handling

Use `on:raw-EventName` and `oncapture:RawEvent-Name` to register event handlers instead of `on___`. It may be a little annoying, but NativeScript uses case sensitive event names and don't have native event bubbling, which means delegation couldn't function.

To enable capture and bubble phase of an event, please refer to this [doc](https://github.com/SudoMaker/DOMiNATIVE#tweakabledefineeventoptioneventname-string-option-eventoption)

## License

MIT
