'use strict';

import alt from '../alt';
import OwnershipFetcher from '../fetchers/ownership_fetcher';


class LoanContractActions {
    constructor() {
        this.generateActions(
            'updateLoanContract'
        );
    }

    fetchLoanContract(email) {

        if(email.match(/.+\@.+\..+/)) {
            OwnershipFetcher.fetchLoanContract(email)
                .then((contracts) => {
                    if (contracts && contracts.length > 0) {
                        this.actions.updateLoanContract({
                            contractKey: contracts[0].s3Key,
                            contractUrl: contracts[0].s3Url,
                            contractEmail: email
                        });
                    }
                    else {
                        this.actions.updateLoanContract({
                            contractKey: null,
                            contractUrl: null,
                            contractEmail: null
                        });
                    }
                })
                .catch((err) => {
                    console.error(err);
                    this.actions.updateLoanContract({
                        contractKey: null,
                        contractUrl: null,
                        contractEmail: null
                    });
                });
            } else {
                /* No email was entered - Ignore and keep going*/
            }
    }
}

export default alt.createActions(LoanContractActions);
