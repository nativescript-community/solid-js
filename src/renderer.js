import './dom.js'
import { createRenderer } from '@solidjs/universal'

// eslint-disable-next-line max-params
const setProperty = (node, name, value, prev) => {
	if (name === 'style') return Object.assign(node.style, value)
	if (value === prev) return

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
		Refer to https://github.com/SudoMaker/dominative#tweaking to learn how to enable event bubbling and capturing.`)
		}
		node.setAttribute(name, value)
	}
}

const renderer = createRenderer({
	createElement(tagName, staticProps) {
		const node = document.createElement(tagName)
		if (staticProps) {
			for (const name in staticProps) setProperty(node, name, staticProps[name])
		}
		return node
	},
	createTextNode(value) {
		return document.createTextNode(value)
	},
	replaceText(textNode, value) {
		textNode.nodeValue = value
	},
	setProperty,
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

export const {
	render,
	effect,
	memo,
	createComponent,
	createElement,
	createTextNode,
	insertNode,
	spread,
	setProp,
	mergeProps,
	ref,
	applyRef
} = renderer

// Give every compiled insertion point a private anchor. Sibling blocks compiled
// against the same following element otherwise collapse onto it once one of them
// renders empty — the runtime drops the sentinel it made for that block and the
// remaining ones then append in flush order rather than source order.
// An empty text node is what the runtime itself uses to hold an empty slot, and
// DOMiNATIVE logs every comment node it sees.
// eslint-disable-next-line max-params
export const insert = (parent, accessor, marker, initial) => {
	if (marker === undefined) return renderer.insert(parent, accessor, marker, initial)
	const anchor = document.createTextNode('')
	parent.insertBefore(anchor, marker)
	return renderer.insert(parent, accessor, anchor, initial)
}

// Forward Solid control flow
export {
	For,
	Repeat,
	Show,
	Switch,
	Match,
	Loading,
	Reveal,
	Errored
} from "solid-js"
