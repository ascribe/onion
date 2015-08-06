'use strict';

import requests from '../../../../utils/requests';


let PrizeFetcher = {
    fetch() {
        return requests.get('prize');
    }
};

export default PrizeFetcher;
