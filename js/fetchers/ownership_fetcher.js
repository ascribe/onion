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
    fetchContractList(){
        return requests.get(ApiUrls.ownership_contract_list);
    },

    fetchLoanPieceRequestList(){
        return requests.get(ApiUrls.ownership_loans_pieces_request);
    },

    makeContractPublic(contractObj){
        return requests.put('ownership_csontract', { body: contractObj, contract_id: contractObj.id });
    },

    deleteContract(contractObj){
        return requests.delete('ownership_contract', {body: contractObj, contract_id: contractObj.id});
    }
};

export default OwnershipFetcher;
