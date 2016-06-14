'use strict';

import walletConstants from './wallet_application_constants';

// gets subdomain as a parameter
function getWalletApiUrls(subdomain) {
    if (subdomain === 'cyland') {
        return {
            'pieces_list': walletConstants.walletApiEndpoint + '/' + subdomain + '/pieces/',
            'piece': walletConstants.walletApiEndpoint + '/' + subdomain + '/pieces/${pieceId}/',
            'piece_extradata': walletConstants.walletApiEndpoint + '/' + subdomain + '/pieces/${pieceId}/extradata/',
            'user': walletConstants.walletApiEndpoint + '/' + subdomain + '/users/'
        };
    } else if (subdomain === 'ikonotv') {
        return {
            'pieces_list': walletConstants.walletApiEndpoint + '/' + subdomain + '/pieces/',
            'piece': walletConstants.walletApiEndpoint + '/' + subdomain + '/pieces/${pieceId}/',
            'user': walletConstants.walletApiEndpoint + '/' + subdomain + '/users/'
        };
    } else if (subdomain === 'lumenus' || subdomain === '23vivi' ||
               subdomain === 'polline' || subdomain === 'artcity' ||
               subdomain === 'demo' || subdomain === 'liquidgallery') {
        return {
            'editions_list': walletConstants.walletApiEndpoint + '/markets/' + subdomain + '/pieces/${pieceId}/editions/',
            'edition': walletConstants.walletApiEndpoint + '/markets/' + subdomain + '/editions/${bitcoinId}/',
            'pieces_list': walletConstants.walletApiEndpoint + '/markets/' + subdomain + '/pieces/',
            'piece': walletConstants.walletApiEndpoint + '/markets/' + subdomain + '/pieces/${pieceId}/',
            'piece_extradata': walletConstants.walletApiEndpoint + '/markets/' + subdomain + '/pieces/${pieceId}/extradata/',
            'user': walletConstants.walletApiEndpoint + '/markets/' + subdomain + '/users/'
        };
    }
    return {};
}

export default getWalletApiUrls;
