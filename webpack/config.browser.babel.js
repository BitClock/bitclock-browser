import { ProvidePlugin } from 'webpack';
import nodeExternals from 'webpack-node-externals';

import extendBaseConfig from './config.base.babel';

export default extendBaseConfig({
	node: {
		process: false
	},
	entry: {
		'bitclock-browser': require.resolve('../src')
	},
	externals: [nodeExternals()],
	plugins: [
		new ProvidePlugin({ process: 'process' })
	]
});
