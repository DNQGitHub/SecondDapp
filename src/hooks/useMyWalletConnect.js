import {useWalletConnect} from '@walletconnect/react-native-dapp';
import {useEffect, useState} from 'react';

export default function useMyWalletConnect(handleOpen, handleClose) {
	const connector = useWalletConnect();
	const [didCustomization, setDidCustomization] = useState(false);

	useEffect(() => {
		if (connector._qrcodeModal && didCustomization === false) {
			const oldClose = connector._qrcodeModal.close;
			connector._qrcodeModal.close = async () => {
				if (handleClose && typeof handleClose === 'function') {
					await handleClose();
				}

				await oldClose();
			};

			connector._qrcodeModal.open = async uri => {
				if (handleOpen && typeof handleOpen === 'function') {
					await handleOpen(uri);
				}
			};

			setDidCustomization(true);
		}
	}, [connector]);

	return connector;
}
