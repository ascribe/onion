'use strict';

import alt from '../../../../alt';

import PrizeJuryActions from '../actions/prize_jury_actions';

class PrizeJuryStore {
    constructor() {
        this.members = [];
        this.bindActions(PrizeJuryActions);
    }

    onUpdatePrizeJury( members ) {
        this.members = members;
    }
}

export default alt.createStore(PrizeJuryStore, 'PrizeJuryStore');