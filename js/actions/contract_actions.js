'use strict';

import alt from '../alt';
import OwnershipFetcher from '../fetchers/ownership_fetcher';


class ContractActions {
    constructor() {
        this.generateActions(
            'updateContract',
            'flushContract'
        );
    }

    fetchContract(email) {
        if(email.match(/.+\@.+\..+/)) {
            OwnershipFetcher.fetchContract(email)
                .then((contracts) => {
                    if (contracts && contracts.length > 0) {
                        this.actions.updateContract({
                            contractKey: contracts[0].s3Key,
                            contractUrl: contracts[0].s3Url,
                            contractEmail: email
                        });
                    }
                    else {
                        this.actions.updateContract({
                            contractKey: null,
                            contractUrl: null,
                            contractEmail: null
                        });
                    }
                })
                .catch((err) => {
                    console.logGlobal(err);
                    this.actions.updateContract({
                        contractKey: null,
                        contractUrl: null,
                        contractEmail: null
                    });
                });
            }
    }

}

export default alt.createActions(ContractActions);
