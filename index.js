/**
 * @format
 */
import {Platform, LogBox} from 'react-native';
import './shim';

if (Platform.OS !== 'web') {
	require('react-native-get-random-values');
	LogBox.ignoreLogs([
		"Warning: The provided value 'ms-stream' is not a valid 'responseType'.",
		"Warning: The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'.",
	]);
}

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
