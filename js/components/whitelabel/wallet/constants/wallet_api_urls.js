'use strict';

import walletConstants from './wallet_application_constants';

// gets subdomain as a parameter
function getWalletApiUrls(subdomain) {
    if (subdomain === 'cyland'){
        return {
            'pieces_list': walletConstants.walletApiEndpoint + subdomain + '/pieces/',
            'piece': walletConstants.walletApiEndpoint + subdomain + '/pieces/${piece_id}/',
            'piece_extradata': walletConstants.walletApiEndpoint + subdomain + '/pieces/${piece_id}/extradata/'
        };
    }
    else if (subdomain === 'ikonotv'){
        return {
            'pieces_list': walletConstants.walletApiEndpoint + 'cyland' + '/pieces/',
            'piece': walletConstants.walletApiEndpoint + 'cyland' + '/pieces/${piece_id}/'
        };
    }
    return {};
}

export default getWalletApiUrls;