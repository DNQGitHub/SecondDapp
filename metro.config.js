/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const extraNodeModules = require('node-libs-browser');
const {getDefaultConfig} = require('metro-config');

module.exports = (async () => {
	const {
		resolver: {sourceExts, assetExts},
	} = await getDefaultConfig();

	return {
		transformer: {
			babelTransformerPath: require.resolve('react-native-svg-transformer'),
			getTransformOptions: async () => ({
				transform: {
					experimentalImportSupport: false,
					inlineRequires: true,
				},
			}),
		},
		resolver: {
			extraNodeModules,
			assetExts: assetExts.filter(ext => ext !== 'svg'),
			sourceExts: [...sourceExts, 'svg'],
		},
	};
})();
