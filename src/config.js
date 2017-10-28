import bitclock from 'bitclock';
import merge from 'deepmerge';

export function withDefaults(config = bitclock.Config()) {
	return merge({
		networkIdleInflight: 2,
		networkIdleTimeout: 2000,
		sendOn: 'networkidle',
		instrument: {
			core: {
				resource: {
					bytes: {
						css: true,
						font: true,
						image: true,
						js: true,
						other: true
					},
					requests: {
						css: true,
						font: true,
						image: true,
						js: true,
						other: true
					}
				},
				timing: {
					navigation: {
						fetchStart: true,
						responseEnd: true,
						domInteractive: true,
						domComplete: true,
						loadEventEnd: true,
						duration: true
					},
					paint: {
						firstPaint: true,
						firstContentfulPaint: true
					}
				}
			}
		}
	}, config);
}

export default function getConfig() {
	return bitclock.Config(withDefaults());
}
