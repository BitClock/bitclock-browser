import { optimize } from 'webpack';

import extendBaseConfig from './config.base.babel';

export default extendBaseConfig({
	devtool: process.env.NODE_ENV !== 'production' ? 'inline-sourcemap' : undefined,
	entry: {
		'bitclock-browser.min': require.resolve('../src')
	},
	plugins: [
		new optimize.UglifyJsPlugin({
			comments: false,
			compress: { warnings: false }
		})
	]
});
