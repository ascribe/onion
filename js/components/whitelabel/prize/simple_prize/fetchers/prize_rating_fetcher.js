'use strict';

import requests from '../../../../../utils/requests';


let PrizeRatingFetcher = {
    fetchAverage(pieceId, round) {
        const params = {
            'piece_id': pieceId
        };

        if (typeof round === 'number') {
            params['prize_round'] = round;
        }

        return requests.get('rating_average', params);
    },

    fetchOne(pieceId, round) {
        const params = {
            'piece_id': pieceId
        };

        if (typeof round === 'number') {
            params['prize_round'] = round;
        }

        return requests.get('rating', params);
    },

    rate(pieceId, rating, round) {
        const body = {
            'piece_id': pieceId,
            'note': rating
        };

        if (typeof round === 'number') {
            body['prize_round'] = round;
        }

        return requests.post('ratings', { body });
    },

    select(pieceId) {
        return requests.post('select_piece', {'piece_id': pieceId});
    }
};

export default PrizeRatingFetcher;
