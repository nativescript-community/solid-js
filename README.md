# NativeScript SolidJS

### **Custom render and patches for SolidJS to work with [DOMiNATIVE](https://github.com/SudoMaker/DOMiNATIVE) on [NativeScript](https://nativescript.org/)**

[Playground](https://stackblitz.com/edit/nativescript-dominative-solid?file=app/app.jsx)

---

## Installation

Via npm:

```shell
npm install @nativescript-commuinty/solid-js dominative undom-ng solid-js
```

**Note:** `dominative`, `undom-ng`, `solid-js` are peer dependencies, you have to install them manually. As the benefit for using peer dependencies, you'll be able to upgrade these dependencies directly from upstream, no need to wait for an update with `@nativescript-commuinty/solid-js`

---

## Usage

```jsx
import { Application } from "@nativescript/core"
import { render } from "@nativescript-commuinty/solid-js"
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
	render(App, document.body)
	return document
}

Application.run({ create })

```

---

## Caveats

### Event handling

Use `on:raw-EventName` and `oncapture:RawEvent-Name` to register event handlers instead of `on___`. It may be a little annoying, but NativeScript uses case sensitive event names and don't have native event bubbling, which means delegation couldn't function.

To enable capture and bubble phase of an event, please refer to this [doc](https://github.com/SudoMaker/DOMiNATIVE#tweakabledefineeventoptioneventname-string-option-eventoption)

## License

MIT
