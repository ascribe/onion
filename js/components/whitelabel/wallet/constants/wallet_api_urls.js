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
    } else if (subdomain === 'lumenus' || subdomain === '23vivi' ||
               subdomain === 'polline' || subdomain === 'artcity' ||
               subdomain === 'demo') {
        return {
            'editions_list': walletConstants.walletApiEndpoint + 'markets/' + subdomain + '/pieces/${piece_id}/editions/',
            'edition': walletConstants.walletApiEndpoint + 'markets/' + subdomain + '/editions/${bitcoin_id}/',
            'pieces_list': walletConstants.walletApiEndpoint + 'markets/' + subdomain + '/pieces/',
            'piece': walletConstants.walletApiEndpoint + 'markets/' + subdomain + '/pieces/${piece_id}/',
            'piece_extradata': walletConstants.walletApiEndpoint + 'markets/' + subdomain + '/pieces/${piece_id}/extradata/',
            'user': walletConstants.walletApiEndpoint + 'markets/' + subdomain + '/users/'
        };
    }
    return {};
}

export default getWalletApiUrls;
