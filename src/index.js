import { Transaction } from 'bitclock';

import getConfig from './config';
import ResourceTiming from './resource-timing';
import { on, getResourceType, camelCase } from './helpers';

const { document } = global;
const config = getConfig();
const t = Transaction();
const resourceTiming = ResourceTiming(t);

const navMetrics = Object.keys(
	config.instrument.core.timing.navigation
);

function onLoad() {
	const { networkIdleInflight, networkIdleTimeout, sendOn } = config;
	if (sendOn === 'networkidle') {
		resourceTiming.settle(networkIdleTimeout, networkIdleInflight, () => {
			resourceTiming.send();
		});
	} else {
		resourceTiming.send();
	}
}

resourceTiming.define({
	'core.resource.bytes': ({ navigation: [navigation = {}], resource }) => ({
		...resource.reduce((acc, { name, initiatorType, transferSize }) => {
			const type = getResourceType(name, initiatorType);
			if (!acc[type]) {
				acc[type] = 0;
			}
			acc[type] += transferSize;
			return acc;
		}, { html: navigation.transferSize })
	}),
	'core.resource.requests': ({ resource }) => (
		resource.reduce((acc, { name, initiatorType }) => {
			const type = getResourceType(name, initiatorType);
			if (!acc[type]) {
				acc[type] = 0;
			}
			acc[type] += 1;
			return acc;
		}, { html: 1 })
	),
	'core.timing.navigation': ({ navigation: [navigation = {}] }) => (
		navMetrics.reduce((acc, key) => {
			if (navigation[key] > 0) {
				acc[key] = navigation[key];
			}
			return acc;
		}, {})
	),
	'core.timing.paint': ({ paint }) => (
		paint.reduce((acc, { name, startTime }) => (
			{ ...acc, [camelCase(name)]: startTime }
		), {})
	)
});

if (document.readyState === 'complete') {
	onLoad();
} else {
	const off = on('load', global, () => {
		off();
		onLoad();
	});
}
