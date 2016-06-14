'use strict';

import requests from '../utils/requests';


// FIXME: fix query string usage
let OwnershipFetcher = {
    /**
     * Fetch the default, public contract of a user from the API.
     */
    fetchContract(loanee) {
        return requests.get('blob_contracts', { loanee });
    },

    /**
     * Fetch the contracts of the logged-in user from the API.
     */
    fetchContractList(isActive, isPublic, issuer) {
        let queryParams = {
            isActive,
            isPublic,
            issuer
        };
        return requests.get('ownership_contract_list', queryParams);
    },


    /**
     * Create a contractagreement between the logged-in user and the email from the API with contract.
     */
    createContractAgreement(signee, contractObj) {
        return requests.post('ownership_contract_agreements', { body: {signee: signee, contract: contractObj.id }});
    },

    /**
     * Fetch the contractagreement between the logged-in user and the email from the API.
     */
    fetchContractAgreementList(issuer, accepted, pending) {
        let queryParams = {
                issuer,
                accepted,
                pending
            };
        return requests.get('ownership_contract_agreements', queryParams);
    },

    confirmContractAgreement(contractAgreement) {
        return requests.put('ownership_contract_agreements_confirm', {contract_agreement_id: contractAgreement.id});
    },

    denyContractAgreement(contractAgreement) {
        return requests.put('ownership_contract_agreements_deny', {contract_agreement_id: contractAgreement.id});
    },

    fetchLoanPieceRequestList() {
        return requests.get('ownership_loans_pieces_request');
    },

    changeContract(contractObj) {
        return requests.put('ownership_contract', { body: contractObj, contract_id: contractObj.id });
    },

    deleteContract(contractObjId) {
        return requests.delete('ownership_contract', {contract_id: contractObjId});
    }
};

export default OwnershipFetcher;
