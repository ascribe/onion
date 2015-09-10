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
    fetchContractList(isActive){
        return requests.get(ApiUrls.ownership_contract_list, isActive);
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

    fetchLoanPieceRequestList(){
        return requests.get(ApiUrls.ownership_loans_pieces_request);
    },

    makeContractPublic(contractObj){
        return requests.put(ApiUrls.ownership_contract, { body: contractObj, contract_id: contractObj.id });
    },

    deleteContract(contractObjId){
        return requests.delete(ApiUrls.ownership_contract, {contract_id: contractObjId});
    }
};

export default OwnershipFetcher;
