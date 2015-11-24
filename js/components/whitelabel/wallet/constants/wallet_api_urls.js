'use strict';

import walletConstants from './wallet_application_constants';

// gets subdomain as a parameter
function getWalletApiUrls(subdomain) {
    if (subdomain === 'cyland') {
        return {
            'pieces_list': walletConstants.walletApiEndpoint + subdomain + '/pieces/',
            'piece': walletConstants.walletApiEndpoint + subdomain + '/pieces/${piece_id}/',
            'piece_extradata': walletConstants.walletApiEndpoint + subdomain + '/pieces/${piece_id}/extradata/',
            'user': walletConstants.walletApiEndpoint + subdomain + '/users/'
        };
    } else if (subdomain === 'ikonotv') {
        return {
            'pieces_list': walletConstants.walletApiEndpoint + subdomain + '/pieces/',
            'piece': walletConstants.walletApiEndpoint + subdomain + '/pieces/${piece_id}/',
            'user': walletConstants.walletApiEndpoint + subdomain + '/users/'
        };
    } else if (subdomain === 'lumenus') {
        return {
            'editions_list': walletConstants.walletApiEndpoint + 'market/' + subdomain + '/pieces/${piece_id}/editions/',
            'edition': walletConstants.walletApiEndpoint + 'market/' + subdomain + '/editions/${bitcoin_id}/',
            'pieces_list': walletConstants.walletApiEndpoint + 'market/' + subdomain + '/pieces/',
            'piece': walletConstants.walletApiEndpoint + 'market/' + subdomain + '/pieces/${piece_id}/',
            'piece_extradata': walletConstants.walletApiEndpoint + 'market/' + subdomain + '/pieces/${piece_id}/extradata/',
            'user': walletConstants.walletApiEndpoint + 'market/' + subdomain + '/users/'
        };
    }
    return {};
}

export default getWalletApiUrls;
