const fs = require('fs');

if (
	fs.existsSync(
		'node_modules/@walletconnect/react-native-dapp/node_modules/react-native-svg',
	)
) {
	fs.rmdirSync(
		'node_modules/@walletconnect/react-native-dapp/node_modules/react-native-svg',
	);
}
