export const noop = () => undefined;

export function off(type, target, fn, useCapture = false) {
	if (target && target.removeEventListener) {
		target.removeEventListener(type, fn, useCapture);
	}
}

export function on(type, target, fn, useCapture = false) {
	let removeListener = noop;
	if (target && target.addEventListener) {
		target.addEventListener(type, fn, useCapture);
		removeListener = () => off(type, target, fn, useCapture);
	}
	return removeListener;
}

export function getResourceType(name, initiatorType) {
	switch (true) {
		case initiatorType === 'script':
		case /\.js$/i.test(name):
			return 'js';
		case /\.css$/i.test(name):
			return 'css';
		case initiatorType === 'img':
		case /\.(jpe?g|png|gif|ico|svg)$/i.test(name):
			return 'image';
		case /\.(eot|ttf|woff2?)$/i.test(name):
			return 'font';
		default:
			return 'other';
	}
}

export function camelCase(string) {
	return string && string.replace(/[-_]([a-z])/gi, (match, group) => (
		group.toUpperCase()
	));
}

export function mapRecursive(target, fn) {
	const node = (Array.isArray(target) ? [] : {});
	Object.entries(target).forEach(([key, value]) => {
		const nextValue = (value && typeof value === 'object')
			? mapRecursive(value, fn)
			: fn(value, key);
		if (nextValue !== undefined) {
			node[key] = nextValue;
		}
	});
	return node;
}

export function pickBy(target, fn) {
	return mapRecursive(target, (value, key) => (
		fn(value, key) ? value : undefined
	));
}
