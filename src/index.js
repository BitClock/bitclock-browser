const { document } = global;

function listenOnce(type, target, fn) {
	const handler = (e) => {
		fn(e);
		target.removeEventListener(type, handler);
	};
	target.addEventListener(type, handler);
}

async function onLoad() {
	const [bitclock, main] = await Promise.all([
		import('bitclock'),
		import('./main')
	]);
	main(bitclock);
}

if (document.readyState === 'complete') {
	onLoad();
} else {
	listenOnce('load', global, onLoad);
}
