'use strict';

import { alt } from '../../../../../alt';

import PrizeActions from '../actions/prize_actions';

class PrizeStore {
    constructor() {
        this.prize = [];
        this.bindActions(PrizeActions);
    }

    onUpdatePrize({ prize }) {
        this.prize = prize;
    }
}

export default alt.createStore(PrizeStore, 'PrizeStore');