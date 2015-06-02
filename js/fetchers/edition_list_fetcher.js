import fetch from '../utils/fetch';

import AppConstants from '../constants/application_constants';


let EditionListFetcher = {
    /**
     * Fetches a list of editions from the API.
     */
    fetch(pieceId) {
        return fetch.get('editions_list', { 'piece_id': pieceId });
    }
};

export default EditionListFetcher;
