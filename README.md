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

### Patching `package.json` of `solid-js`

You have to patch the `exports` key in the `package.json` form `node_modules/solid-js`. It is recommended to use [patch-package](https://www.npmjs.com/package/patch-package) for patching.

For example:

```patch
diff --git a/node_modules/solid-js/package.json b/node_modules/solid-js/package.json
index b4c3656..47e362f 100644
--- a/node_modules/solid-js/package.json
+++ b/node_modules/solid-js/package.json
@@ -44,48 +44,6 @@
   ],
   "exports": {
     ".": {
-      "browser": {
-        "development": {
-          "import": {
-            "types": "./types/index.d.ts",
-            "default": "./dist/dev.js"
-          },
-          "require": "./dist/dev.cjs"
-        },
-        "import": {
-          "types": "./types/index.d.ts",
-          "default": "./dist/solid.js"
-        },
-        "require": "./dist/solid.cjs"
-      },
-      "deno": {
-        "import": {
-          "types": "./types/index.d.ts",
-          "default": "./dist/server.js"
-        },
-        "require": "./dist/server.cjs"
-      },
-      "worker": {
-        "import": {
-          "types": "./types/index.d.ts",
-          "default": "./dist/server.js"
-        },
-        "require": "./dist/server.cjs"
-      },
-      "node": {
-        "import": {
-          "types": "./types/index.d.ts",
-          "default": "./dist/server.js"
-        },
-        "require": "./dist/server.cjs"
-      },
-      "development": {
-        "import": {
-          "types": "./types/index.d.ts",
-          "default": "./dist/dev.js"
-        },
-        "require": "./dist/dev.cjs"
-      },
       "import": {
         "types": "./types/index.d.ts",
         "default": "./dist/solid.js"
```

## License

MIT