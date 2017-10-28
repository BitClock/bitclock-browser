import path from 'path';
import { BannerPlugin, DefinePlugin } from 'webpack';

import pkg from '../package.json';

export default ({ plugins = [], ...other }) => ({
	context: path.resolve(__dirname, '..'),
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: '[name].js'
	},
	plugins: [
		new DefinePlugin({
			'process.browser': true,
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		}),
		...plugins,
		new BannerPlugin({
			entryOnly: true,
			banner: `${pkg.name} - ${pkg.version} - ${new Date().toISOString()}`
		})
	],
	module: {
		loaders: [{
			test: /\.js$/,
			use: 'babel-loader',
			exclude: /node_modules/
		}]
	},
	...other
});
