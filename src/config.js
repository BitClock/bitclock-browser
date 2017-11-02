import merge from 'deepmerge';

export default function withDefaults(initial) {
	return merge({
		networkIdleInflight: 2,
		networkIdleTimeout: 1000,
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
	}, initial);
}
