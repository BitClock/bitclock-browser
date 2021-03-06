const { document } = global;

function listenOnce(type, target, fn) {
	const handler = (e) => {
		fn(e);
		target.removeEventListener(type, handler);
	};
	target.addEventListener(type, handler);
}

function onLoad() {
	import('./main').then(main => main());
}

if (document.readyState === 'complete') {
	onLoad();
} else {
	listenOnce('load', global, onLoad);
}
