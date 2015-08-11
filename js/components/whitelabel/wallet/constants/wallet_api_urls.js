'use strict';

import WalletAppConstants from './wallet_application_constants';

function getPrizeApiUrls(subdomain) {
    return {
        'pieces_list': WalletAppConstants.walletApiEndpoint + subdomain + '/pieces/'
    };
}

export default getPrizeApiUrls;