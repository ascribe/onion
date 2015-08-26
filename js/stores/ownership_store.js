'use strict';

import alt from '../alt';
import OwnershipActions from '../actions/ownership_actions';


class OwnershipStore {
    constructor() {
        this.loanRequestList = [];
        this.loanRequest = null;
        this.bindActions(OwnershipActions);
    }

    onUpdateLoanPieceRequestList(loanRequests) {
        this.loanRequestList = loanRequests;
    }

    onUpdateLoanPieceRequest({loanRequests, pieceId}) {
        this.loanRequestList = loanRequests;
        this.loanRequest = loanRequests.filter((item) => item.piece_id === pieceId.toString());
        if (this.loanRequest.length > 0){
            this.loanRequest = this.loanRequest[0];
        }
        else {
            this.loanRequest = null;
        }
    }

    onFlushLoanPieceRequest(){
        this.loanRequestList = [];
        this.loanRequest = null;
    }
}

export default alt.createStore(OwnershipStore, 'OwnershipStore');
