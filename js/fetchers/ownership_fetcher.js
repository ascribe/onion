'use strict';

import requests from '../utils/requests';

import ApiUrls from '../constants/api_urls';

let OwnershipFetcher = {
    /**
     * Fetch the default, public contract of a user from the API.
     */
    fetchContract(email) {
        return requests.get(ApiUrls.blob_contracts + '?loanee=' + email);
    },

    /**
     * Fetch the contracts of the logged-in user from the API.
     */
    fetchContractList(isActive, isPublic, issuer){
        let queryParams = {
            isActive,
            isPublic,
            issuer
        };
        return requests.get(ApiUrls.ownership_contract_list, queryParams);
    },


    /**
     * Create a contractagreement between the logged-in user and the email from the API with contract.
     */
    createContractAgreement(signee, contractObj){
        return requests.post(ApiUrls.ownership_contract_agreements, { body: {signee: signee, contract: contractObj.id }});
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
        return requests.get(ApiUrls.ownership_contract_agreements, queryParams);
    },

    confirmContractAgreement(contractAgreement){
        return requests.put(ApiUrls.ownership_contract_agreements_confirm, {contract_agreement_id: contractAgreement.id});
    },

    denyContractAgreement(contractAgreement){
        return requests.put(ApiUrls.ownership_contract_agreements_deny, {contract_agreement_id: contractAgreement.id});
    },

    fetchLoanPieceRequestList(){
        return requests.get(ApiUrls.ownership_loans_pieces_request);
    },

    changeContract(contractObj){
        return requests.put(ApiUrls.ownership_contract, { body: contractObj, contract_id: contractObj.id });
    },

    deleteContract(contractObjId){
        return requests.delete(ApiUrls.ownership_contract, {contract_id: contractObjId});
    }
};

export default OwnershipFetcher;
