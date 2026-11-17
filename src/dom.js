import { aliasTagName, globalRegister } from 'dominative'

// Solid 2 schedules every update with queueMicrotask, which some NativeScript
// runtimes (e.g. NativeScript Preview) don't provide. Only fill it in when absent.
if (typeof globalThis.queueMicrotask !== 'function') {
	globalThis.queueMicrotask = (callback) => {
		Promise.resolve()
			.then(callback)
			// Rethrow outside the promise chain so the error is reported instead of swallowed.
			.catch((error) => setTimeout(() => { throw error }))
	}
}

globalRegister(global)

aliasTagName(tag => tag.toLowerCase())
