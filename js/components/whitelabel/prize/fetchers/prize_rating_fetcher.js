'use strict';

import requests from '../../../../utils/requests';


let PrizeRatingFetcher = {
    fetchAverage(pieceId) {
        return requests.get('rating_average', {'piece_id': pieceId});
    },

    fetchOne(pieceId) {
        return requests.get('rating', {'piece_id': pieceId});
    },

    rate(pieceId, rating) {
        return requests.post('ratings', {body: {'piece_id': pieceId, 'note': rating}});
    }
};

export default PrizeRatingFetcher;
