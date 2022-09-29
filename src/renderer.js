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
	setProperty(node, name, value) {
		if (name.startsWith('on:')) node.addEventListener(name.slice(3), value)
		else if (name.startsWith('oncapture:')) node.addEventListener(name.slice(10), value, true)
		else {
			if (process.env.NODE_ENV !== 'production' && name.startsWith('on')) console.warn(`[DOMiSOLID] For event handlers, pleas use 'on:eventName' or 'oncapture:eventName'.`)
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