'use strict';

import alt from '../alt';
import OwnershipFetcher from '../fetchers/ownership_fetcher';


class OwnershipActions {
    constructor() {
        this.generateActions(
            'updateLoanPieceRequestList',
            'updateLoanPieceRequest',
            'flushLoanPieceRequest'
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
                this.actions.updateLoanPieceRequest({loanRequests: data.loan_requests, pieceId: pieceId});
            })
            .catch((err) => {
                console.logGlobal(err);
            });
    }
}

export default alt.createActions(OwnershipActions);
