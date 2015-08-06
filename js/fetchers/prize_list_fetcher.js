'use strict';

import requests from '../utils/requests';


let PrizeListFetcher = {
    fetch() {
        return requests.get('prize_list');
    }
};

export default PrizeListFetcher;
