'use strict';

import walletConstants from './wallet_application_constants';

// gets subdomain as a parameter
function getWalletApiUrls(subdomain) {
    if (subdomain === 'cyland'){
        return {
            'pieces_list': walletConstants.walletApiEndpoint + subdomain + '/pieces/',
            'piece': walletConstants.walletApiEndpoint + subdomain + '/pieces/${piece_id}/',
            'piece_extradata': walletConstants.walletApiEndpoint + subdomain + '/pieces/${piece_id}/extradata/',
            'user': walletConstants.walletApiEndpoint + subdomain + '/users/'
        };
    }
    else if (subdomain === 'ikonotv'){
        return {
            'pieces_list': walletConstants.walletApiEndpoint + subdomain + '/pieces/',
            'piece': walletConstants.walletApiEndpoint + subdomain + '/pieces/${piece_id}/',
            'user': walletConstants.walletApiEndpoint + subdomain + '/users/'
        };
    }
    else if (subdomain === 'lumenus'){
        return {
            'editions': walletConstants.walletApiEndpoint + subdomain + '/editions/',
            'pieces_list': walletConstants.walletApiEndpoint + subdomain + '/pieces/',
            'user': walletConstants.walletApiEndpoint + subdomain + '/users/'
        };
    }
    return {};
}

export default getWalletApiUrls;
