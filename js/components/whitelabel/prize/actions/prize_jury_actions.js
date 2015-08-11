'use strict';

import alt from '../../../../alt';
import Q from 'q';

import PrizeJuryFetcher from '../fetchers/prize_jury_fetcher';

class PrizeJuryActions {
    constructor() {
        this.generateActions(
            'updatePrizeJury',
            'removePrizeJury',
            'activatePrizeJury'
        );
    }

    fetchJury() {
        return Q.Promise((resolve, reject) => {
            PrizeJuryFetcher
                .fetch()
                .then((res) => {
                    this.actions.updatePrizeJury(res.members);
                    resolve(res);
                })
                .catch((err) => {
                    console.logGlobal(err);
                    reject(err);
                });
        });
    }

    activateJury(email) {
        return Q.Promise((resolve, reject) => {
            PrizeJuryFetcher
                .activate(email)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    console.logGlobal(err);
                    reject(err);
                });
        });
    }

    revokeJury(email) {
        return Q.Promise((resolve, reject) => {
            PrizeJuryFetcher
                .delete(email)
                .then((res) => {
                    this.actions.removePrizeJury(email);
                    resolve(res);
                })
                .catch((err) => {
                    console.logGlobal(err);
                    reject(err);
                });
        });
    }

    resendJuryInvitation(email) {
        return Q.Promise((resolve, reject) => {
            PrizeJuryFetcher
                .resend(email)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    console.logGlobal(err);
                    reject(err);
                });
        });
    }
}

export default alt.createActions(PrizeJuryActions);