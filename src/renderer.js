import './dom.js'
import { createRenderer } from 'solid-js/universal'


export const {
	render,
	effect,
	memo,
	createComponent,
	createElement,
	createTextNode,
	insertNode,
	insert,
	spread,
	setProp,
	mergeProps
} = createRenderer({
	createElement(string) {
		return document.createElement(string)
	},
	createTextNode(value) {
		return document.createTextNode(value)
	},
	replaceText(textNode, value) {
		textNode.nodeValue = value
	},
	// eslint-disable-next-line max-params
	setProperty(node, name, value, prev) {
		if (name === 'style') return Object.assign(node.style, value)
		if (value === prev) return

		if (name === 'ref') return value(node)

		if (name.startsWith('on:')) {
			const eventName = name.slice(3)
			if (prev) node.removeEventListener(eventName, prev)
			if (value) node.addEventListener(eventName, value)
		} else if (name.startsWith('oncapture:')) {
			const eventName = name.slice(10)
			if (prev) node.removeEventListener(eventName, prev, true)
			if (value) node.addEventListener(eventName, value, true)
		} else {
			if (process.env.NODE_ENV !== 'production' && name.startsWith('on')) {
				console.warn(`[DOMiSOLID] Can not register '${name}' as an event handler.
		For event handlers, pleas use 'on:raw-eventName' or 'oncapture:rawEvent-name'.
		Event delegation isn't supported, also event names are case sensitive on NativeScript.
		Refer to https://www.solidjs.com/docs/latest/api#on___oncapture___ for details about 'on:___' and 'oncapture:___'.
		Refer to https://github.com/SudoMaker/dominative#tweaking to learn how to enable event bubbling and capturing.`)
			}
			node.setAttribute(name, value)
		}
	},
	insertNode(parent, node, anchor) {
		parent.insertBefore(node, anchor)
	},
	isTextNode(node) {
		return node.nodeType === 3
	},
	removeNode(parent, node) {
		parent.removeChild(node)
	},
	getParentNode(node) {
		return node.parentNode
	},
	getFirstChild(node) {
		return node.firstChild
	},
	getNextSibling(node) {
		return node.nextSibling
	}
});

// Forward Solid control flow
export {
	For,
	Show,
	Suspense,
	SuspenseList,
	Switch,
	Match,
	Index,
	ErrorBoundary
} from "solid-js"