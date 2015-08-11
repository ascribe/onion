'use strict';

import alt from '../alt';

import PrizeListActions from '../actions/prize_list_actions';

class PrizeListStore {
    constructor() {
        this.prizeList = [];
        this.prizeListCount = -1;
        this.bindActions(PrizeListActions);
    }

    onUpdatePrizeList({ prizeList, prizeListCount }) {
        this.prizeList = prizeList;
        this.prizeListCount = prizeListCount;
    }
}

export default alt.createStore(PrizeListStore, 'PrizeListStore');