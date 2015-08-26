'use strict';

import alt from '../alt';
import OwnershipFetcher from '../fetchers/ownership_fetcher';


class OwnershipActions {
    constructor() {
        this.generateActions(
            'updateLoanPieceRequestList',
            'updateLoanPieceRequest'
        );
    }

    fetchLoanRequestList() {
        OwnershipFetcher.fetchLoanPieceRequestList()
            .then((data) => {
                this.actions.updateLoanPieceRequestList(data.loan_requests);
            })
            .catch((err) => {
                console.logGlobal(err);
                this.actions.updateLoanPieceRequestList(null);
            });
    }

    fetchLoanRequest(pieceId) {
        OwnershipFetcher.fetchLoanPieceRequestList()
            .then((data) => {
                let loanRequests = data.loan_requests;
                this.actions.updateLoanPieceRequest({loanRequests, pieceId});
            })
            .catch((err) => {
                console.logGlobal(err);
                this.actions.flushLoanPieceRequest();
            });
    }
}

export default alt.createActions(OwnershipActions);
