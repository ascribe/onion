'use strict';

import requests from '../utils/requests';


let WalletSettingsFetcher = {
    fetchOne() {
        return requests.get('wallet_settings');
    }
};

export default WalletSettingsFetcher;
