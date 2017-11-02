module.exports = {
	presets: [
		['env', {
			targets: {
				browsers: ['last 2 versions', 'not ie < 11']
			},
			useBuiltIns: 'usage'
		}]
	],
	plugins: [
		'async-import',
		['transform-runtime', {
			polyfill: false,
			helpers: Boolean(process.env.RUNTIME_HELPERS)
		}],
		['transform-object-rest-spread', { useBuiltIns: true }]
	]
};
