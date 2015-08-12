'use strict';

import requests from '../../../../utils/requests';


let PrizeRatingFetcher = {
    fetch() {
        return requests.get('rating');
    },

    fetchOne(pieceId) {
        return requests.get('rating', {'piece_id': pieceId});
    },

    rate(pieceId, rating) {
        return requests.post('ratings', {body: {'piece_id': pieceId, 'value': rating}});
    }
};

export default PrizeRatingFetcher;
