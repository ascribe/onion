'use strict';

import requests from '../../../../../utils/requests';


let PrizeJuryFetcher = {
    fetch() {
        return requests.get('jurys');
    },

    activate(email) {
        return requests.post('jury_activate', {'email': email});
    },

    delete(email) {
        return requests.delete('jury', {'email': email});
    },

    resend(email) {
        return requests.post('jury_resend', {'email': email});
    }
};

export default PrizeJuryFetcher;
