'use strict';

import { alt } from '../alt';
import WalletSettingsActions from '../actions/wallet_settings_actions';


class WalletSettingsStore {
    constructor() {
        this.walletSettings = {};
        this.bindActions(WalletSettingsActions);
    }

    onUpdateWalletSettings(walletSettings) {
        this.walletSettings = walletSettings;
    }
}

export default alt.createStore(WalletSettingsStore, 'WalletSettingsStore');
