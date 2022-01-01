import React, {useState} from 'react';
import {WalletConnectConfig} from './configs';
import {
	StyleSheet,
	SafeAreaView,
	View,
	Text,
	TouchableOpacity,
	Linking,
	Platform,
	TextInput,
} from 'react-native';
import {withWalletConnect} from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMyWalletConnect} from './hooks';
import WalletListModal from './modals/WalletListModal';
import Logo from './assets/walletconnect-banner.svg';
import DialogAndroid from 'react-native-dialogs/DialogAndroid';

export default withWalletConnect(
	function App() {
		const wcConnector = useMyWalletConnect(
			async uri => {
				setWcUri(uri);

				if (Platform.OS === 'ios') {
					setModalWalletListVisible(true);
				} else {
					if (await Linking.canOpenURL(uri)) {
						await Linking.openURL(uri);
					} else {
						DialogAndroid.alert(
							'No wallet found',
							'Find a wallet at <a href="https://ethereum.org/en/wallets/find-wallet">https://ethereum.org/en/wallets/find-wallet</a>',
							{
								contentIsHtml: true,
							},
						);
					}
				}
			},
			async () => {
				setModalWalletListVisible(false);
			},
		);
		const [wcUri, setWcUri] = useState(null);
		const [modalWalletListVisible, setModalWalletListVisible] = useState(false);

		const handleOnBtnConnectPressed = () => {
			if (!wcConnector.connected) {
				wcConnector.connect();
			}
		};

		const handleOnBtnDisconnectPressed = () => {
			if (wcConnector.connected) {
				wcConnector.killSession();
			}
		};

		const handleOnWalletItemPressed = async (index, item) => {
			if (!wcUri) {
				console.log('WallectConnect Uri is null');
				return;
			}

			const {native, universal} = item.mobile;
			const deepLink = `${
				universal || (native && `${native}/`)
			}/wc?uri=${encodeURIComponent(wcUri)}`;

			console.log(deepLink);

			Linking.openURL(deepLink);
		};

		return (
			<SafeAreaView>
				<View style={styles.body}>
					<Logo width="80%" height="80" />

					<Text style={styles.title}>v1.7.0</Text>

					{wcUri && (
						<TextInput
							style={styles.title}
							value={wcUri}
							multiline={true}
							selectTextOnFocus={true}
						/>
					)}

					{wcConnector.connected && (
						<View>
							<Text style={styles.title}>
								{wcConnector.session.peerMeta.name}
							</Text>
							{wcConnector.session.accounts.map((account, index) => (
								<Text style={styles.title} key={index}>
									{account}
								</Text>
							))}
						</View>
					)}

					{!wcConnector.connected ? (
						<TouchableOpacity
							style={{...styles.button, ...styles.buttonConnect}}
							onPress={handleOnBtnConnectPressed}>
							<View>
								<Text style={styles.buttonText}>Connect</Text>
							</View>
						</TouchableOpacity>
					) : (
						<View>
							<TouchableOpacity
								style={{...styles.button, ...styles.buttonLogout}}
								onPress={handleOnBtnDisconnectPressed}>
								<View>
									<Text style={styles.buttonText}>Logout</Text>
								</View>
							</TouchableOpacity>
						</View>
					)}

					<WalletListModal
						onRequestClose={() => {
							setModalWalletListVisible(false);
						}}
						visible={modalWalletListVisible}
						onItemPressed={handleOnWalletItemPressed}
					/>
				</View>
			</SafeAreaView>
		);
	},
	{
		...WalletConnectConfig,
		storageOptions: {
			asyncStorage: AsyncStorage,
		},
	},
);

const styles = StyleSheet.create({
	body: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
	},
	logo: {
		width: '80%',
		height: 60,
		resizeMode: 'contain',
	},
	title: {
		marginBottom: 20,
		fontSize: 20,
		textAlign: 'center',
		paddingLeft: 15,
		paddingRight: 15,
	},
	button: {
		width: 150,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f4f4f4',
		borderRadius: 5,
		elevation: 15,
	},
	buttonText: {
		color: '#fff',
		fontSize: 20,
	},
	buttonConnect: {
		backgroundColor: '#3D85C6',
		shadowColor: '#3D85C6',
	},
	buttonLogout: {
		backgroundColor: '#e69138',
		shadowColor: '#e69138',
	},
	modalWallets: {
		width: '100%',
		height: '100%',
		backgroundColor: 'red',
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalWalletsDialog: {
		width: '80%',
		height: '50%',
		backgroundColor: 'blue',
		alignItems: 'center',
		justifyContent: 'center',
	},
	wallet: {
		width: 300,
		height: 50,
		backgroundColor: '#fff',
	},
});
