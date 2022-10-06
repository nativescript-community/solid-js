# DOMiNATIVE-Solid

### **Custom render and patches for SolidJS to work with [DOMiNATIVE](https://github.com/SudoMaker/DOMiNATIVE) on [NativeScript](https://nativescript.org/)**

[Playground](https://stackblitz.com/edit/nativescript-dominative-solid?file=app/app.jsx)

---

## Installation

Via npm:

```shell
npm install @dominative/solid dominative undom-ng solid-js
```

**Note:** `dominative`, `undom-ng`, `solid-js` are peer dependencies, you have to install them manually.

---

## Usage

```jsx
import { Application } from "@nativescript/core"
import { render } from "@dominative/solid"
import { createSignal } from "solid-js"

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
	render(App, document.documentElement)
	return document
}

Application.run({ create })

```

---

## Caveats

### Event handling

Use `on:raw-EventName` and `oncapture:RawEvent-Name` to register event handlers instead of `on___`. It may be a little annoying, but NativeScript uses case sensitive event names and don't have native event bubbling, which means delegation couldn't function.

To enable capture and bubble phase of an event, please refer to this [doc](https://github.com/SudoMaker/DOMiNATIVE#tweakabledefineeventoptioneventname-string-option-eventoption)

### Manually aliasing `solid-js`

You have to manually aliasing `solid-js` to the browser version in `webpack.config.js`, otherwise it will use the server version.

For example:

```js
// Please keep this order of setting aliases
config.resolve.alias
	.set("solid-js/universal", path.resolve(__dirname, `node_modules/solid-js/universal/dist/${env.production ? 'universal' : 'dev'}.js`))
	.set("solid-js", path.resolve(__dirname, `node_modules/solid-js/dist/${env.production ? 'solid' : 'dev'}.js`))
```

## License

MIT