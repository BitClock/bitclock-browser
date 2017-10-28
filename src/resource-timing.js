import { pickBy } from './helpers';

const { performance = {} } = global;

function navigationStatsFallback() {
	const timing = Object.create(null);
	for (const key in performance.timing) {
		if (typeof performance.timing[key] === 'number') {
			timing[key] = performance.timing[key];
		}
	}
	return Object
		.entries(pickBy(timing, Boolean))
		.sort(([, a], [, b]) => a - b)
		.reduce(([first = next[1], acc], next) => (
			[first, { ...acc, [next[0]]: next[1] - first }]
		), [])[1];
}

export default function ResourceTiming(transaction) {
	const sets = {
		paint: new Set(),
		navigation: new Set(),
		resource: new Set(),
		other: new Set()
	};

	const predicates = {};

	function define(hash) {
		Object.assign(predicates, hash);
	}

	function getStats(calculate = true) {
		(performance.getEntries ? performance.getEntries() : []).forEach((entry) => {
			const set = sets[entry.entryType] || sets.other;
			if (!set.has(entry)) {
				set.add(entry);
			}
		});

		if (sets.navigation.size === 0 && performance.timing) {
			sets.navigation.add(navigationStatsFallback());
		}

		const stats = Object.create(
			Object.entries(sets).reduce(({ count, ...acc }, [key, value]) => (
				{ ...acc, count: count + value.size, [key]: Array.from(value) }
			), { count: 0 })
		);

		return Object.assign(stats, (
			calculate && Object.entries(predicates).reduce((acc, [key, fn]) => (
				{ ...acc, [key]: fn(stats) }
			), {})
		));
	}

	function send() {
		Object.entries(getStats()).forEach(([activity, stats]) => {
			transaction.metrics(
				pickBy(stats, value => (typeof value === 'number')),
				{ activity }
			);
		});
	}

	function settle(timeout, tolerance, cb, attempts = 0) {
		const { count } = getStats(false);
		setTimeout(() => {
			if (Math.abs(getStats(false).count - count) <= tolerance) {
				cb();
			} else if (attempts < 10) {
				settle(timeout, tolerance, cb, attempts + 1);
			}
		}, timeout);
	}

	return { define, getStats, send, settle };
}
