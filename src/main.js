import withDefaults from './config';
import ResourceTiming from './resource-timing';
import { getResourceType, camelCase } from './helpers';

module.exports = ({ Config, Transaction }) => {
	const t = Transaction();
	const resourceTiming = ResourceTiming(t);
	const config = Config(withDefaults(Config()));

	const navMetrics = Object.keys(
		config.instrument.core.timing.navigation
	);

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

	if (config.sendOn === 'networkidle') {
		const { networkIdleInflight, networkIdleTimeout } = config;
		resourceTiming.settle(networkIdleTimeout, networkIdleInflight, () => {
			resourceTiming.send();
		});
	} else {
		resourceTiming.send();
	}
};
