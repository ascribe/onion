'use strict';

import requests from '../../../../utils/requests';


let PrizeJuryFetcher = {
    fetch() {
        return requests.get('jury');
    }
};

export default PrizeJuryFetcher;
