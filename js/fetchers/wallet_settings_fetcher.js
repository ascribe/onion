'use strict';

import request from '../utils/request';


let WalletSettingsFetcher = {
    fetchOne() {
        return request('wallet_settings');
    }
};

export default WalletSettingsFetcher;
