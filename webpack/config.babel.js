import path from 'path';
import { optimize, BannerPlugin, DefinePlugin } from 'webpack';

import pkg from '../package.json';

const production = (process.env.NODE_ENV === 'production');

export default {
	context: path.resolve(__dirname, '..'),
	entry: [
		'core-js/modules/es6.object.assign',
		'core-js/modules/es6.promise',
		require.resolve('../src')
	],
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: `${pkg.name}.js`,
		chunkFilename: 'bitclock-browser.chunk.[id].js',
		publicPath: production
			? `https://s3.amazonaws.com/bitclock-public/${pkg.version}/`
			: (process.env.BASE_URL || '/static/')
	},
	resolve: {
		mainFields: ['module', 'browser', 'main']
	},
	plugins: [
		new DefinePlugin({
			'process.browser': true,
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		}),
		production && new optimize.UglifyJsPlugin({
			comments: false,
			compress: { warnings: false }
		}),
		new BannerPlugin({
			entryOnly: true,
			banner: `${pkg.name} - ${pkg.version} - ${new Date().toISOString()}`
		})
	].filter(Boolean),
	module: {
		loaders: [{
			test: /\.js$/,
			use: 'babel-loader',
			exclude: /node_modules/
		}]
	}
};
