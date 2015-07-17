'use strict';

import alt from '../alt';
import WalletSettingsFetcher from '../fetchers/wallet_settings_fetcher';


class WalletSettingsActions {
    constructor() {
        this.generateActions(
            'updateWalletSettings'
        );
    }

    fetchWalletSettings() {
        WalletSettingsFetcher.fetchOne()
            .then((res) => {
                this.actions.updateWalletSettings(res.wallet_settings);
            })
            .catch((err) => {
                console.logGlobal(err);
            });
    }
}

export default alt.createActions(WalletSettingsActions);
